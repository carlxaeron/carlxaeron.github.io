#!/usr/bin/env node

import { Server } from '@modelcontextprotocol/sdk/server/index.js'
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js'
import {
  CallToolRequestSchema,
  ErrorCode,
  ListToolsRequestSchema,
  McpError,
} from '@modelcontextprotocol/sdk/types.js'
import { NamecheapClient } from './client.js'
import type { NamecheapConfig, DNSHost } from './types.js'

// ---- Tool definitions ----

const TOOLS = [
  {
    name: 'namecheap_list_domains',
    description:
      'List all domains in your Namecheap account with details: expiration, auto-renew, lock status, DNS provider.',
    inputSchema: {
      type: 'object' as const,
      properties: {
        page: {
          type: 'number',
          description: 'Page number (default: 1)',
        },
        pageSize: {
          type: 'number',
          description: 'Results per page, max 100 (default: 100)',
        },
      },
    },
  },
  {
    name: 'namecheap_get_domain_info',
    description:
      'Get detailed info about a domain: owner, status, creation/expiry dates, DNS provider, nameservers.',
    inputSchema: {
      type: 'object' as const,
      properties: {
        domain: {
          type: 'string',
          description: 'Domain name (e.g. "example.com")',
        },
      },
      required: ['domain'],
    },
  },
  {
    name: 'namecheap_check_domain',
    description:
      'Check if one or more domains are available for registration. Returns availability and premium pricing.',
    inputSchema: {
      type: 'object' as const,
      properties: {
        domains: {
          type: 'array',
          items: { type: 'string' },
          description:
            'Array of domain names to check (e.g. ["example.com", "test.net"])',
        },
      },
      required: ['domains'],
    },
  },
  {
    name: 'namecheap_get_dns_hosts',
    description:
      'Get all DNS host records for a domain (A, AAAA, CNAME, MX, TXT, NS, SRV, CAA).',
    inputSchema: {
      type: 'object' as const,
      properties: {
        domain: {
          type: 'string',
          description: 'Domain name (e.g. "example.com")',
        },
      },
      required: ['domain'],
    },
  },
  {
    name: 'namecheap_set_dns_hosts',
    description:
      'Set DNS host records for a domain. WARNING: This REPLACES all existing records. Always get current records first, modify them, and set the full list back.',
    inputSchema: {
      type: 'object' as const,
      properties: {
        domain: {
          type: 'string',
          description: 'Domain name (e.g. "example.com")',
        },
        hosts: {
          type: 'array',
          description: 'Array of DNS host records to set',
          items: {
            type: 'object',
            properties: {
              name: {
                type: 'string',
                description:
                  'Host name — "@" for root, "www" for subdomain, "api" for api.domain.com, etc.',
              },
              type: {
                type: 'string',
                description: 'Record type',
                enum: [
                  'A',
                  'AAAA',
                  'CNAME',
                  'MX',
                  'TXT',
                  'NS',
                  'SRV',
                  'CAA',
                  'URL',
                  'URL301',
                  'FRAME',
                ],
              },
              address: {
                type: 'string',
                description:
                  'Record value — IP address, hostname, or text content',
              },
              mxPref: {
                type: 'string',
                description: 'MX priority (required for MX records)',
              },
              ttl: {
                type: 'string',
                description: 'TTL in seconds (default: 1800)',
              },
            },
            required: ['name', 'type', 'address'],
          },
        },
      },
      required: ['domain', 'hosts'],
    },
  },
  {
    name: 'namecheap_get_nameservers',
    description:
      'Get current nameservers for a domain and whether it uses Namecheap DNS or custom nameservers.',
    inputSchema: {
      type: 'object' as const,
      properties: {
        domain: {
          type: 'string',
          description: 'Domain name (e.g. "example.com")',
        },
      },
      required: ['domain'],
    },
  },
  {
    name: 'namecheap_set_nameservers',
    description:
      'Set custom nameservers for a domain (e.g. Cloudflare, AWS Route53). This switches the domain away from Namecheap DNS.',
    inputSchema: {
      type: 'object' as const,
      properties: {
        domain: {
          type: 'string',
          description: 'Domain name (e.g. "example.com")',
        },
        nameservers: {
          type: 'array',
          items: { type: 'string' },
          description:
            'Nameserver hostnames (e.g. ["ns1.cloudflare.com", "ns2.cloudflare.com"])',
          minItems: 1,
          maxItems: 12,
        },
      },
      required: ['domain', 'nameservers'],
    },
  },
  {
    name: 'namecheap_set_default_nameservers',
    description:
      'Reset a domain to use Namecheap default nameservers. Use this to switch back from custom nameservers.',
    inputSchema: {
      type: 'object' as const,
      properties: {
        domain: {
          type: 'string',
          description: 'Domain name (e.g. "example.com")',
        },
      },
      required: ['domain'],
    },
  },
  {
    name: 'namecheap_register_domain',
    description:
      'Register (purchase) a new domain name. Requires contact information as parameters. This will charge your Namecheap account.',
    inputSchema: {
      type: 'object' as const,
      properties: {
        domain: {
          type: 'string',
          description: 'Domain name to register (e.g. "example.com")',
        },
        years: {
          type: 'number',
          description: 'Registration period in years (default: 1)',
        },
        firstName: { type: 'string', description: 'Registrant first name' },
        lastName: { type: 'string', description: 'Registrant last name' },
        address1: { type: 'string', description: 'Street address' },
        city: { type: 'string', description: 'City' },
        stateProvince: { type: 'string', description: 'State or province' },
        postalCode: { type: 'string', description: 'Postal/ZIP code' },
        country: {
          type: 'string',
          description: 'Country code (e.g. "US", "DE")',
        },
        phone: {
          type: 'string',
          description: 'Phone number (e.g. "+1.5555551234")',
        },
        email: {
          type: 'string',
          description: 'Contact email address',
        },
        nameservers: {
          type: 'array',
          items: { type: 'string' },
          description: 'Optional custom nameservers',
        },
        whoisGuard: {
          type: 'boolean',
          description: 'Enable WHOIS privacy (default: true)',
        },
      },
      required: [
        'domain',
        'firstName',
        'lastName',
        'address1',
        'city',
        'stateProvince',
        'postalCode',
        'country',
        'phone',
        'email',
      ],
    },
  },
  {
    name: 'namecheap_get_tld_pricing',
    description:
      'Get pricing for a TLD (.com, .net, .app, etc.) — registration, renewal, and transfer costs for different year periods.',
    inputSchema: {
      type: 'object' as const,
      properties: {
        tld: {
          type: 'string',
          description: 'TLD without dot (e.g. "com", "net", "app")',
        },
      },
      required: ['tld'],
    },
  },
]

// ---- Server ----

class NamecheapMCPServer {
  private server: Server
  private client: NamecheapClient | null = null

  constructor() {
    this.server = new Server(
      { name: 'mcp-namecheap', version: '1.0.0' },
      { capabilities: { tools: {} } }
    )
    this.setupHandlers()
  }

  private getClient(): NamecheapClient {
    if (this.client) return this.client

    const config: NamecheapConfig = {
      apiUser: process.env.NAMECHEAP_API_USER || '',
      apiKey: process.env.NAMECHEAP_API_KEY || '',
      userName: process.env.NAMECHEAP_USERNAME || '',
      clientIp: process.env.NAMECHEAP_CLIENT_IP || '',
      sandbox: process.env.NAMECHEAP_SANDBOX === 'true',
    }

    if (!config.apiUser || !config.apiKey || !config.userName) {
      throw new McpError(
        ErrorCode.InternalError,
        'Missing required env vars: NAMECHEAP_API_USER, NAMECHEAP_API_KEY, NAMECHEAP_USERNAME'
      )
    }

    this.client = new NamecheapClient(config)
    return this.client
  }

  private setupHandlers() {
    this.server.setRequestHandler(ListToolsRequestSchema, async () => ({
      tools: TOOLS,
    }))

    this.server.setRequestHandler(
      CallToolRequestSchema,
      async (request) => {
        const { name, arguments: args } = request.params

        try {
          const client = this.getClient()

          switch (name) {
            // ---- List domains ----
            case 'namecheap_list_domains': {
              const page = (args?.page as number) || 1
              const pageSize = Math.min((args?.pageSize as number) || 100, 100)
              const domains = await client.listDomains(page, pageSize)
              return ok(JSON.stringify({ page, pageSize, count: domains.length, domains }, null, 2))
            }

            // ---- Domain info ----
            case 'namecheap_get_domain_info': {
              requireParam(args, 'domain')
              const info = await client.getDomainInfo(args!.domain as string)
              return ok(JSON.stringify(info, null, 2))
            }

            // ---- Check availability ----
            case 'namecheap_check_domain': {
              requireParam(args, 'domains')
              if (!Array.isArray(args!.domains)) {
                throw new McpError(ErrorCode.InvalidParams, 'domains must be an array')
              }
              const results = await client.checkDomain(args!.domains as string[])
              return ok(JSON.stringify(results, null, 2))
            }

            // ---- Get DNS hosts ----
            case 'namecheap_get_dns_hosts': {
              requireParam(args, 'domain')
              const hosts = await client.getDnsHosts(args!.domain as string)
              return ok(JSON.stringify(hosts, null, 2))
            }

            // ---- Set DNS hosts ----
            case 'namecheap_set_dns_hosts': {
              requireParam(args, 'domain')
              requireParam(args, 'hosts')
              if (!Array.isArray(args!.hosts)) {
                throw new McpError(ErrorCode.InvalidParams, 'hosts must be an array')
              }
              const success = await client.setDnsHosts(
                args!.domain as string,
                args!.hosts as DNSHost[]
              )
              return ok(
                JSON.stringify({
                  success,
                  message: success
                    ? 'DNS hosts updated successfully'
                    : 'Failed to update DNS hosts',
                })
              )
            }

            // ---- Get nameservers ----
            case 'namecheap_get_nameservers': {
              requireParam(args, 'domain')
              const ns = await client.getNameservers(args!.domain as string)
              return ok(JSON.stringify(ns, null, 2))
            }

            // ---- Set custom nameservers ----
            case 'namecheap_set_nameservers': {
              requireParam(args, 'domain')
              requireParam(args, 'nameservers')
              if (!Array.isArray(args!.nameservers)) {
                throw new McpError(ErrorCode.InvalidParams, 'nameservers must be an array')
              }
              const success = await client.setNameservers(
                args!.domain as string,
                args!.nameservers as string[]
              )
              return ok(
                JSON.stringify({
                  success,
                  message: success
                    ? 'Custom nameservers set successfully'
                    : 'Failed to set nameservers',
                })
              )
            }

            // ---- Reset to default nameservers ----
            case 'namecheap_set_default_nameservers': {
              requireParam(args, 'domain')
              const success = await client.setDefaultNameservers(args!.domain as string)
              return ok(
                JSON.stringify({
                  success,
                  message: success
                    ? 'Default Namecheap nameservers restored'
                    : 'Failed to restore default nameservers',
                })
              )
            }

            // ---- Register domain ----
            case 'namecheap_register_domain': {
              requireParam(args, 'domain')
              requireParam(args, 'firstName')
              requireParam(args, 'lastName')
              requireParam(args, 'address1')
              requireParam(args, 'city')
              requireParam(args, 'stateProvince')
              requireParam(args, 'postalCode')
              requireParam(args, 'country')
              requireParam(args, 'phone')
              requireParam(args, 'email')

              const a = args!
              const contactTypes = [
                'Registrant',
                'Tech',
                'Admin',
                'AuxBilling',
              ]
              const contact: Record<string, string> = {}
              for (const ct of contactTypes) {
                contact[`${ct}FirstName`] = a.firstName as string
                contact[`${ct}LastName`] = a.lastName as string
                contact[`${ct}Address1`] = a.address1 as string
                contact[`${ct}City`] = a.city as string
                contact[`${ct}StateProvince`] = a.stateProvince as string
                contact[`${ct}PostalCode`] = a.postalCode as string
                contact[`${ct}Country`] = a.country as string
                contact[`${ct}Phone`] = a.phone as string
                contact[`${ct}EmailAddress`] = a.email as string
              }

              const result = await client.registerDomain(
                a.domain as string,
                (a.years as number) || 1,
                contact,
                a.nameservers as string[] | undefined,
                a.whoisGuard !== false
              )
              return ok(JSON.stringify(result, null, 2))
            }

            // ---- TLD pricing ----
            case 'namecheap_get_tld_pricing': {
              requireParam(args, 'tld')
              const pricing = await client.getTldPricing(args!.tld as string)
              return ok(JSON.stringify(pricing, null, 2))
            }

            default:
              throw new McpError(ErrorCode.MethodNotFound, `Unknown tool: ${name}`)
          }
        } catch (err: any) {
          if (err instanceof McpError) throw err
          return {
            content: [{ type: 'text' as const, text: `Error: ${err.message}` }],
            isError: true,
          }
        }
      }
    )
  }

  async run() {
    const transport = new StdioServerTransport()
    await this.server.connect(transport)
    console.error('mcp-namecheap server running on stdio')
  }
}

// ---- Helpers ----

function ok(text: string) {
  return { content: [{ type: 'text' as const, text }] }
}

function requireParam(args: Record<string, unknown> | undefined, key: string) {
  if (!args || args[key] === undefined || args[key] === null) {
    throw new McpError(ErrorCode.InvalidParams, `Missing required parameter: ${key}`)
  }
}

// ---- Start ----

const server = new NamecheapMCPServer()
server.run().catch((err) => {
  console.error('Fatal:', err)
  process.exit(1)
})
