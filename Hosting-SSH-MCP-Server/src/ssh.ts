import fs from 'node:fs'
import path from 'node:path'
import { Client, type ConnectConfig, type SFTPWrapper } from 'ssh2'
import { config, resolveRemotePath } from './config.js'

let client: Client | null = null
let connecting: Promise<Client> | null = null

function authConfig(): ConnectConfig {
  const base: ConnectConfig = {
    host: config.host,
    port: config.port,
    username: config.username,
    readyTimeout: 20000,
    // Namecheap shared hosting is fine with default algorithms
  }
  if (config.privateKeyPath && fs.existsSync(config.privateKeyPath)) {
    return {
      ...base,
      privateKey: fs.readFileSync(config.privateKeyPath),
    }
  }
  if (config.password) {
    return { ...base, password: config.password }
  }
  throw new Error(
    'No SSH auth configured. Set SSH_PRIVATE_KEY_PATH (.ssh/tahanan_mcp) or SSH_PASSWORD in .env'
  )
}

export async function getClient(): Promise<Client> {
  if (client) return client
  if (connecting) return connecting

  connecting = new Promise<Client>((resolve, reject) => {
    const c = new Client()
    const onReady = () => {
      client = c
      connecting = null
      resolve(c)
    }
    const onError = (err: Error) => {
      client = null
      connecting = null
      reject(err)
    }
    c.once('ready', onReady)
    c.once('error', onError)
    c.on('close', () => {
      client = null
      connecting = null
    })
    c.connect(authConfig())
  })

  return connecting
}

export async function withSftp<T>(fn: (sftp: SFTPWrapper) => Promise<T>): Promise<T> {
  const c = await getClient()
  return new Promise<T>((resolve, reject) => {
    c.sftp((err, sftp) => {
      if (err || !sftp) {
        reject(err ?? new Error('SFTP channel failed'))
        return
      }
      fn(sftp)
        .then(resolve)
        .catch(reject)
        .finally(() => sftp.end())
    })
  })
}

export async function execRemote(
  command: string,
  timeoutMs = config.execTimeoutMs
): Promise<{ stdout: string; stderr: string; code: number | null }> {
  const c = await getClient()
  return new Promise((resolve, reject) => {
    const timer = setTimeout(() => {
      reject(new Error(`Command timed out after ${timeoutMs}ms`))
    }, timeoutMs)

    c.exec(command, (err, stream) => {
      if (err) {
        clearTimeout(timer)
        reject(err)
        return
      }
      let stdout = ''
      let stderr = ''
      stream
        .on('close', (code: number | null) => {
          clearTimeout(timer)
          const max = config.maxReadBytes
          if (stdout.length > max) stdout = stdout.slice(0, max) + `\n… truncated at ${max} bytes`
          if (stderr.length > max) stderr = stderr.slice(0, max) + `\n… truncated at ${max} bytes`
          resolve({ stdout, stderr, code })
        })
        .on('data', (d: Buffer) => {
          stdout += d.toString('utf8')
        })
      stream.stderr.on('data', (d: Buffer) => {
        stderr += d.toString('utf8')
      })
    })
  })
}

export async function listDir(remotePath?: string) {
  const abs = resolveRemotePath(remotePath)
  return withSftp(
    (sftp) =>
      new Promise<
        Array<{
          name: string
          type: string
          size: number
          mode: number
          modifyTime: number
        }>
      >((resolve, reject) => {
        sftp.readdir(abs, (err, list) => {
          if (err) {
            reject(err)
            return
          }
          resolve(
            list
              .map((e) => ({
                name: e.filename,
                type: e.attrs.isDirectory()
                  ? 'dir'
                  : e.attrs.isSymbolicLink()
                    ? 'link'
                    : 'file',
                size: e.attrs.size ?? 0,
                mode: e.attrs.mode ?? 0,
                modifyTime: e.attrs.mtime ?? 0,
              }))
              .sort((a, b) => a.name.localeCompare(b.name))
          )
        })
      })
  ).then((entries) => ({ path: abs, entries }))
}

export async function readFile(remotePath: string, encoding: 'utf8' | 'base64' = 'utf8') {
  const abs = resolveRemotePath(remotePath)
  return withSftp(async (sftp) => {
    const buf = await new Promise<Buffer>((resolve, reject) => {
      const chunks: Buffer[] = []
      let total = 0
      const stream = sftp.createReadStream(abs)
      stream.on('data', (chunk: Buffer) => {
        total += chunk.length
        if (total > config.maxReadBytes) {
          stream.destroy(new Error(`File exceeds max read size (${config.maxReadBytes} bytes)`))
          return
        }
        chunks.push(chunk)
      })
      stream.on('error', reject)
      stream.on('end', () => resolve(Buffer.concat(chunks)))
    })
    return {
      path: abs,
      encoding,
      size: buf.length,
      content: encoding === 'base64' ? buf.toString('base64') : buf.toString('utf8'),
    }
  })
}

export async function writeFile(remotePath: string, content: string, encoding: 'utf8' | 'base64' = 'utf8') {
  const abs = resolveRemotePath(remotePath)
  const buf = encoding === 'base64' ? Buffer.from(content, 'base64') : Buffer.from(content, 'utf8')
  return withSftp(
    (sftp) =>
      new Promise<{ path: string; bytes: number }>((resolve, reject) => {
        const stream = sftp.createWriteStream(abs)
        stream.on('error', reject)
        stream.on('close', () => resolve({ path: abs, bytes: buf.length }))
        stream.end(buf)
      })
  )
}

export async function mkdir(remotePath: string, recursive = true) {
  const abs = resolveRemotePath(remotePath)
  if (!recursive) {
    return withSftp(
      (sftp) =>
        new Promise<{ path: string }>((resolve, reject) => {
          sftp.mkdir(abs, (err) => (err ? reject(err) : resolve({ path: abs })))
        })
    )
  }
  // recursive via shell (shared hosting has mkdir -p)
  const r = await execRemote(`mkdir -p -- ${shellQuote(abs)}`)
  if (r.code !== 0) throw new Error(r.stderr || `mkdir failed (${r.code})`)
  return { path: abs }
}

export async function rm(remotePath: string, recursive = false) {
  const abs = resolveRemotePath(remotePath)
  if (abs === config.home || abs === `${config.home}/` || abs === `${config.home}/public_html`) {
    throw new Error('Refusing to delete home or public_html root')
  }
  const flag = recursive ? '-rf' : '-f'
  const r = await execRemote(`rm ${flag} -- ${shellQuote(abs)}`)
  if (r.code !== 0) throw new Error(r.stderr || `rm failed (${r.code})`)
  return { path: abs, removed: true }
}

export async function upload(localPath: string, remotePath: string) {
  const abs = resolveRemotePath(remotePath)
  const localAbs = pathResolveLocal(localPath)
  if (!fs.existsSync(localAbs)) throw new Error(`Local file not found: ${localAbs}`)
  return withSftp(
    (sftp) =>
      new Promise<{ local: string; remote: string; bytes: number }>((resolve, reject) => {
        sftp.fastPut(localAbs, abs, (err) => {
          if (err) reject(err)
          else {
            const bytes = fs.statSync(localAbs).size
            resolve({ local: localAbs, remote: abs, bytes })
          }
        })
      })
  )
}

export async function download(remotePath: string, localPath: string) {
  const abs = resolveRemotePath(remotePath)
  const localAbs = pathResolveLocal(localPath)
  fs.mkdirSync(path.dirname(localAbs), { recursive: true })
  return withSftp(
    (sftp) =>
      new Promise<{ local: string; remote: string }>((resolve, reject) => {
        sftp.fastGet(abs, localAbs, (err) => {
          if (err) reject(err)
          else resolve({ local: localAbs, remote: abs })
        })
      })
  )
}

export function info() {
  return {
    host: config.host,
    port: config.port,
    username: config.username,
    home: config.home,
    auth: config.privateKeyPath
      ? `key:${config.privateKeyPath}`
      : config.password
        ? 'password'
        : 'none',
    hints: {
      web: `${config.home}/public_html`,
      domainRoot: `${config.home}/tahanan`,
      api: `${config.home}/api.tahanan.org`,
    },
  }
}

function shellQuote(s: string): string {
  return `'${s.replace(/'/g, `'\\''`)}'`
}

function pathResolveLocal(p: string): string {
  return path.isAbsolute(p) ? p : path.resolve(process.cwd(), p)
}
