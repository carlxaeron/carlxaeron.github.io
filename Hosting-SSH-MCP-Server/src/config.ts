import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')

function loadDotEnv(envPath: string): void {
  if (!fs.existsSync(envPath)) return
  const text = fs.readFileSync(envPath, 'utf8')
  for (const line of text.split('\n')) {
    const trimmed = line.trim()
    if (!trimmed || trimmed.startsWith('#')) continue
    const eq = trimmed.indexOf('=')
    if (eq <= 0) continue
    const key = trimmed.slice(0, eq).trim()
    let value = trimmed.slice(eq + 1).trim()
    if (
      (value.startsWith('"') && value.endsWith('"')) ||
      (value.startsWith("'") && value.endsWith("'"))
    ) {
      value = value.slice(1, -1)
    }
    if (process.env[key] === undefined) process.env[key] = value
  }
}

loadDotEnv(path.join(ROOT, '.env'))

function required(name: string, fallback?: string): string {
  const v = process.env[name] ?? fallback
  if (!v) throw new Error(`Missing required env: ${name}`)
  return v
}

const keyFromEnv = process.env.SSH_PRIVATE_KEY_PATH?.trim() || ''
const keyAbs = keyFromEnv
  ? path.isAbsolute(keyFromEnv)
    ? keyFromEnv
    : path.join(ROOT, keyFromEnv)
  : ''

export const config = {
  root: ROOT,
  host: required('SSH_HOST', 'server402.web-hosting.com'),
  port: Number(process.env.SSH_PORT || '21098'),
  username: required('SSH_USERNAME', 'carlxaeron'),
  privateKeyPath: keyAbs,
  password: process.env.SSH_PASSWORD?.trim() || '',
  home: required('SSH_HOME', '/home/carlxaeron').replace(/\/$/, '') || '/home/carlxaeron',
  maxReadBytes: Number(process.env.SSH_MAX_READ_BYTES || '524288'),
  execTimeoutMs: Number(process.env.SSH_EXEC_TIMEOUT_MS || '60000'),
}

export function resolveRemotePath(input?: string): string {
  const home = config.home
  const raw = (input ?? '.').trim() || '.'
  if (raw === '~' || raw.startsWith('~/')) {
    return path.posix.join(home, raw.slice(2) || '.')
  }
  const abs = raw.startsWith('/')
    ? path.posix.normalize(raw)
    : path.posix.normalize(path.posix.join(home, raw))
  // Soft jail: allow home and common web roots under it
  if (abs !== home && !abs.startsWith(`${home}/`)) {
    throw new Error(
      `Path escapes hosting home (${home}): ${abs}. Use relative paths or paths under home.`
    )
  }
  return abs
}
