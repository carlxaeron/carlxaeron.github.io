#!/usr/bin/env node
/**
 * Hosting SSH/SFTP MCP — Namecheap Stellar (tahanan.org)
 * Connects on port 21098 with key or password from .env
 */

import { Server } from '@modelcontextprotocol/sdk/server/index.js'
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js'
import {
  CallToolRequestSchema,
  ErrorCode,
  ListToolsRequestSchema,
  McpError,
} from '@modelcontextprotocol/sdk/types.js'
import * as ssh from './ssh.js'

const TOOLS = [
  {
    name: 'hosting_info',
    description:
      'Show Namecheap Stellar SSH connection target (host, port 21098, username, home paths). Does not run remote commands.',
    inputSchema: { type: 'object' as const, properties: {} },
  },
  {
    name: 'hosting_exec',
    description:
      'Run a shell command on the hosting account via SSH. Prefer non-interactive commands. Working dir is usually home.',
    inputSchema: {
      type: 'object' as const,
      properties: {
        command: { type: 'string', description: 'Shell command to run' },
        timeout_ms: {
          type: 'number',
          description: 'Timeout in ms (default from SSH_EXEC_TIMEOUT_MS)',
        },
      },
      required: ['command'],
    },
  },
  {
    name: 'hosting_ls',
    description:
      'List a remote directory over SFTP. Paths are relative to /home/carlxaeron unless absolute under home.',
    inputSchema: {
      type: 'object' as const,
      properties: {
        path: {
          type: 'string',
          description: 'Remote path (default: home). e.g. public_html or ~/tahanan',
        },
      },
    },
  },
  {
    name: 'hosting_read',
    description: 'Read a remote text (or base64) file via SFTP. Size-limited.',
    inputSchema: {
      type: 'object' as const,
      properties: {
        path: { type: 'string', description: 'Remote file path' },
        encoding: {
          type: 'string',
          enum: ['utf8', 'base64'],
          description: 'utf8 (default) or base64',
        },
      },
      required: ['path'],
    },
  },
  {
    name: 'hosting_write',
    description: 'Write/create a remote file via SFTP (overwrites).',
    inputSchema: {
      type: 'object' as const,
      properties: {
        path: { type: 'string', description: 'Remote file path' },
        content: { type: 'string', description: 'File contents' },
        encoding: {
          type: 'string',
          enum: ['utf8', 'base64'],
          description: 'utf8 (default) or base64',
        },
      },
      required: ['path', 'content'],
    },
  },
  {
    name: 'hosting_mkdir',
    description: 'Create a remote directory (mkdir -p by default).',
    inputSchema: {
      type: 'object' as const,
      properties: {
        path: { type: 'string' },
        recursive: { type: 'boolean', description: 'Default true' },
      },
      required: ['path'],
    },
  },
  {
    name: 'hosting_rm',
    description:
      'Remove a remote file or directory. Refuses home/public_html roots. Set recursive=true for directories.',
    inputSchema: {
      type: 'object' as const,
      properties: {
        path: { type: 'string' },
        recursive: { type: 'boolean', description: 'Default false' },
      },
      required: ['path'],
    },
  },
  {
    name: 'hosting_upload',
    description: 'Upload a local file to the remote host via SFTP.',
    inputSchema: {
      type: 'object' as const,
      properties: {
        local_path: { type: 'string', description: 'Absolute or cwd-relative local path' },
        remote_path: { type: 'string', description: 'Destination under hosting home' },
      },
      required: ['local_path', 'remote_path'],
    },
  },
  {
    name: 'hosting_download',
    description: 'Download a remote file to local disk via SFTP.',
    inputSchema: {
      type: 'object' as const,
      properties: {
        remote_path: { type: 'string' },
        local_path: { type: 'string', description: 'Local destination path' },
      },
      required: ['remote_path', 'local_path'],
    },
  },
]

function text(data: unknown) {
  return {
    content: [
      {
        type: 'text' as const,
        text: typeof data === 'string' ? data : JSON.stringify(data, null, 2),
      },
    ],
  }
}

const server = new Server(
  { name: 'hosting-ssh', version: '1.0.0' },
  { capabilities: { tools: {} } }
)

server.setRequestHandler(ListToolsRequestSchema, async () => ({ tools: TOOLS }))

server.setRequestHandler(CallToolRequestSchema, async (request) => {
  const { name, arguments: args = {} } = request.params
  try {
    switch (name) {
      case 'hosting_info':
        return text(ssh.info())
      case 'hosting_exec': {
        const command = String((args as { command?: string }).command || '')
        if (!command.trim()) throw new McpError(ErrorCode.InvalidParams, 'command required')
        const timeout = (args as { timeout_ms?: number }).timeout_ms
        const result = await ssh.execRemote(command, timeout)
        return text(result)
      }
      case 'hosting_ls':
        return text(await ssh.listDir((args as { path?: string }).path))
      case 'hosting_read': {
        const a = args as { path?: string; encoding?: 'utf8' | 'base64' }
        if (!a.path) throw new McpError(ErrorCode.InvalidParams, 'path required')
        return text(await ssh.readFile(a.path, a.encoding || 'utf8'))
      }
      case 'hosting_write': {
        const a = args as { path?: string; content?: string; encoding?: 'utf8' | 'base64' }
        if (!a.path || a.content === undefined) {
          throw new McpError(ErrorCode.InvalidParams, 'path and content required')
        }
        return text(await ssh.writeFile(a.path, a.content, a.encoding || 'utf8'))
      }
      case 'hosting_mkdir': {
        const a = args as { path?: string; recursive?: boolean }
        if (!a.path) throw new McpError(ErrorCode.InvalidParams, 'path required')
        return text(await ssh.mkdir(a.path, a.recursive !== false))
      }
      case 'hosting_rm': {
        const a = args as { path?: string; recursive?: boolean }
        if (!a.path) throw new McpError(ErrorCode.InvalidParams, 'path required')
        return text(await ssh.rm(a.path, Boolean(a.recursive)))
      }
      case 'hosting_upload': {
        const a = args as { local_path?: string; remote_path?: string }
        if (!a.local_path || !a.remote_path) {
          throw new McpError(ErrorCode.InvalidParams, 'local_path and remote_path required')
        }
        return text(await ssh.upload(a.local_path, a.remote_path))
      }
      case 'hosting_download': {
        const a = args as { remote_path?: string; local_path?: string }
        if (!a.remote_path || !a.local_path) {
          throw new McpError(ErrorCode.InvalidParams, 'remote_path and local_path required')
        }
        return text(await ssh.download(a.remote_path, a.local_path))
      }
      default:
        throw new McpError(ErrorCode.MethodNotFound, `Unknown tool: ${name}`)
    }
  } catch (err) {
    if (err instanceof McpError) throw err
    const message = err instanceof Error ? err.message : String(err)
    throw new McpError(ErrorCode.InternalError, message)
  }
})

async function main() {
  const transport = new StdioServerTransport()
  await server.connect(transport)
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
