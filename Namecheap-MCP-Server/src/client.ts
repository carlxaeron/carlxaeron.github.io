import axios from 'axios'
import { parseStringPromise } from 'xml2js'
import type {
  NamecheapConfig,
  DomainListItem,
  DomainCheckResult,
  DomainInfo,
  DNSHost,
  TLDPricing,
} from './types.js'

// ---- IP auto-detection ----

let cachedIp: string | null = null

async function detectPublicIp(): Promise<string> {
  if (cachedIp) return cachedIp

  const services = [
    'https://api.ipify.org',
    'https://api.ip.sb/ip',
    'https://ifconfig.me/ip',
  ]

  for (const url of services) {
    try {
      const res = await axios.get(url, { timeout: 5000 })
      const ip =
        typeof res.data === 'object' && res.data.ip
          ? res.data.ip
          : String(res.data).trim()
      if (/^(\d{1,3}\.){3}\d{1,3}$/.test(ip)) {
        cachedIp = ip
        return ip
      }
    } catch {
      // try next service
    }
  }
  throw new Error('Failed to detect public IP address')
}

// ---- Namecheap API Client ----

export class NamecheapClient {
  private config: NamecheapConfig
  private baseUrl: string

  constructor(config: NamecheapConfig) {
    this.config = config
    this.baseUrl = config.sandbox
      ? 'https://api.sandbox.namecheap.com/xml.response'
      : 'https://api.namecheap.com/xml.response'
  }

  // ---- Low-level API call ----

  private async call(
    command: string,
    params: Record<string, string> = {},
    method: 'GET' | 'POST' = 'GET'
  ): Promise<any> {
    const clientIp = this.config.clientIp || (await detectPublicIp())

    const allParams: Record<string, string> = {
      ApiUser: this.config.apiUser,
      ApiKey: this.config.apiKey,
      UserName: this.config.userName,
      ClientIp: clientIp,
      Command: command,
      ...params,
    }

    let data: string
    if (method === 'POST') {
      const form = new URLSearchParams(allParams)
      const res = await axios.post(this.baseUrl, form, {
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        timeout: 30000,
      })
      data = res.data
    } else {
      const qs = new URLSearchParams(allParams)
      const res = await axios.get(`${this.baseUrl}?${qs}`, { timeout: 30000 })
      data = res.data
    }

    const parsed = await parseStringPromise(data)
    const api = parsed.ApiResponse

    if (api.$.Status !== 'OK') {
      const errors = api.Errors?.[0]?.Error
      if (errors) {
        const msg = Array.isArray(errors)
          ? errors[0]?._ || errors[0]
          : errors._ || errors
        throw new Error(`Namecheap API: ${msg}`)
      }
      throw new Error('Unknown Namecheap API error')
    }

    return api.CommandResponse[0]
  }

  // ---- Domain listing ----

  async listDomains(page = 1, pageSize = 100): Promise<DomainListItem[]> {
    const res = await this.call('namecheap.domains.getList', {
      Page: String(page),
      PageSize: String(pageSize),
    })

    const domains = res.DomainGetListResult?.[0]?.Domain
    if (!domains) return []

    return (Array.isArray(domains) ? domains : [domains]).map((d: any) => ({
      id: d.$.ID,
      name: d.$.Name,
      user: d.$.User,
      created: d.$.Created,
      expires: d.$.Expires,
      isExpired: d.$.IsExpired === 'true',
      isLocked: d.$.IsLocked === 'true',
      autoRenew: d.$.AutoRenew === 'true',
      whoisGuard: d.$.WhoisGuard,
      isPremium: d.$.IsPremium === 'true',
      isOurDns: d.$.IsOurDNS === 'true',
    }))
  }

  // ---- Domain info ----

  async getDomainInfo(domain: string): Promise<DomainInfo> {
    const res = await this.call('namecheap.domains.getInfo', {
      DomainName: domain,
    })

    const info = res.DomainGetInfoResult?.[0] ?? res.DomainGetInfoResult
    const dnsDetails = info?.DnsDetails?.[0] ?? info?.DnsDetails

    const nameservers: string[] = []
    if (dnsDetails?.Nameserver) {
      const ns = dnsDetails.Nameserver
      const list = Array.isArray(ns) ? ns : [ns]
      for (const n of list) {
        nameservers.push(typeof n === 'string' ? n : n._)
      }
    }

    return {
      domainName: info?.$?.DomainName ?? domain,
      ownerName: info?.$?.OwnerName ?? '',
      isOwner: info?.$?.IsOwner === 'true',
      isPremium: info?.$?.IsPremium === 'true',
      status: info?.$?.Status ?? 'unknown',
      createdDate: info?.DomainDetails?.[0]?.CreatedDate?.[0] ?? '',
      expiredDate: info?.DomainDetails?.[0]?.ExpiredDate?.[0] ?? '',
      dnsProvider: dnsDetails?.$?.ProviderType ?? '',
      isUsingOurDns: dnsDetails?.$?.IsUsingOurDNS === 'true',
      nameservers,
    }
  }

  // ---- Domain availability check ----

  async checkDomain(domains: string[]): Promise<DomainCheckResult[]> {
    const res = await this.call('namecheap.domains.check', {
      DomainList: domains.join(','),
    })

    const results = res.DomainCheckResult
    if (!results) return []

    return (Array.isArray(results) ? results : [results]).map((r: any) => ({
      domain: r.$.Domain,
      available: r.$.Available === 'true',
      isPremiumName: r.$.IsPremiumName === 'true',
      premiumRegistrationPrice: r.$.PremiumRegistrationPrice || undefined,
      premiumRenewalPrice: r.$.PremiumRenewalPrice || undefined,
      premiumRestorePrice: r.$.PremiumRestorePrice || undefined,
      premiumTransferPrice: r.$.PremiumTransferPrice || undefined,
      icannFee: r.$.IcannFee || undefined,
    }))
  }

  // ---- DNS host records ----

  private splitDomain(domain: string): [string, string] {
    const parts = domain.split('.')
    if (parts.length < 2) throw new Error(`Invalid domain: ${domain}`)
    const tld = parts.pop()!
    const sld = parts.join('.')
    return [sld, tld]
  }

  async getDnsHosts(domain: string): Promise<DNSHost[]> {
    const [sld, tld] = this.splitDomain(domain)
    const res = await this.call('namecheap.domains.dns.getHosts', {
      SLD: sld,
      TLD: tld,
    })

    const hosts = res.DomainDNSGetHostsResult?.[0]?.host
    if (!hosts) return []

    return (Array.isArray(hosts) ? hosts : [hosts]).map((h: any) => ({
      name: h.$.Name,
      type: h.$.Type,
      address: h.$.Address,
      mxPref: h.$.MXPref || undefined,
      ttl: h.$.TTL || undefined,
    }))
  }

  async setDnsHosts(domain: string, hosts: DNSHost[]): Promise<boolean> {
    const [sld, tld] = this.splitDomain(domain)

    const params: Record<string, string> = { SLD: sld, TLD: tld }
    hosts.forEach((h, i) => {
      const n = i + 1
      params[`HostName${n}`] = h.name
      params[`RecordType${n}`] = h.type
      params[`Address${n}`] = h.address
      if (h.mxPref) params[`MXPref${n}`] = h.mxPref
      params[`TTL${n}`] = h.ttl || '1800'
    })

    const res = await this.call('namecheap.domains.dns.setHosts', params)
    return (
      res.DomainDNSSetHostsResult?.[0]?.$?.IsSuccess === 'true' ||
      res.DomainDNSSetHostsResult?.$?.IsSuccess === 'true'
    )
  }

  // ---- Nameservers ----

  async getNameservers(domain: string): Promise<{
    isUsingOurDns: boolean
    nameservers: string[]
  }> {
    const [sld, tld] = this.splitDomain(domain)
    const res = await this.call('namecheap.domains.dns.getList', {
      SLD: sld,
      TLD: tld,
    })

    const result = res.DomainDNSGetListResult?.[0] ?? res.DomainDNSGetListResult
    const isOurs = result?.$?.IsUsingOurDNS === 'true'

    const ns: string[] = []
    const nameservers = result?.Nameserver
    if (nameservers) {
      const list = Array.isArray(nameservers) ? nameservers : [nameservers]
      for (const n of list) {
        ns.push(typeof n === 'string' ? n : n._)
      }
    }

    return { isUsingOurDns: isOurs, nameservers: ns }
  }

  async setNameservers(domain: string, nameservers: string[]): Promise<boolean> {
    const [sld, tld] = this.splitDomain(domain)
    const res = await this.call('namecheap.domains.dns.setCustom', {
      SLD: sld,
      TLD: tld,
      Nameservers: nameservers.join(','),
    })

    return (
      res.DomainDNSSetCustomResult?.[0]?.$?.IsSuccess === 'true' ||
      res.DomainDNSSetCustomResult?.$?.IsSuccess === 'true'
    )
  }

  async setDefaultNameservers(domain: string): Promise<boolean> {
    const [sld, tld] = this.splitDomain(domain)
    const res = await this.call('namecheap.domains.dns.setDefault', {
      SLD: sld,
      TLD: tld,
    })

    return (
      res.DomainDNSSetDefaultResult?.[0]?.$?.Updated === 'true' ||
      res.DomainDNSSetDefaultResult?.$?.Updated === 'true'
    )
  }

  // ---- Domain registration ----

  async registerDomain(
    domain: string,
    years: number,
    contact: Record<string, string>,
    nameservers?: string[],
    whoisGuard = true
  ): Promise<{
    success: boolean
    orderId?: string
    transactionId?: string
    registeredDate?: string
  }> {
    const params: Record<string, string> = {
      DomainName: domain,
      Years: String(years),
      AddFreeWhoisguard: whoisGuard ? 'yes' : 'no',
      WGEnabled: whoisGuard ? 'yes' : 'no',
      ...contact,
    }

    if (nameservers?.length) {
      nameservers.forEach((ns, i) => {
        params[`Nameserver${i + 1}`] = ns
      })
    }

    const res = await this.call('namecheap.domains.create', params, 'POST')
    const result =
      res.DomainCreateResult?.[0] ?? res.DomainCreateResult

    if (result?.$?.OrderID) {
      return {
        success: true,
        orderId: result.$.OrderID,
        transactionId: result.$.TransactionID,
        registeredDate: result.$.RegisterDate,
      }
    }

    return { success: false }
  }

  // ---- TLD Pricing ----

  async getTldPricing(tld: string): Promise<TLDPricing> {
    const cleanTld = tld.replace(/^\./, '')

    // Fetch register + renew + transfer in parallel
    const [regRes, renewRes, transferRes] = await Promise.allSettled([
      this.call('namecheap.users.getPricing', {
        ProductType: 'DOMAIN',
        ProductName: cleanTld,
        ActionName: 'REGISTER',
      }),
      this.call('namecheap.users.getPricing', {
        ProductType: 'DOMAIN',
        ProductName: cleanTld,
        ActionName: 'RENEW',
      }),
      this.call('namecheap.users.getPricing', {
        ProductType: 'DOMAIN',
        ProductName: cleanTld,
        ActionName: 'TRANSFER',
      }),
    ])

    const registration: Record<string, string> = {}
    const renewal: Record<string, string> = {}
    let transfer = 'N/A'

    const extractPrices = (
      result: PromiseSettledResult<any>,
      target: Record<string, string>
    ) => {
      if (result.status !== 'fulfilled') return
      try {
        const pt = result.value.UserGetPricingResult?.[0]?.ProductType
        if (!pt) return
        const domain = (Array.isArray(pt) ? pt : [pt]).find(
          (t: any) =>
            t.$.Name.toLowerCase() === 'domains' ||
            t.$.Name.toLowerCase() === 'domain'
        )
        if (!domain?.ProductCategory) return
        for (const cat of domain.ProductCategory) {
          const product = cat.Product?.find(
            (p: any) => p.$.Name.toLowerCase() === cleanTld.toLowerCase()
          )
          if (!product?.Price) continue
          for (const price of product.Price) {
            if (price.$.DurationType === 'YEAR') {
              target[`${price.$.Duration}yr`] = `$${price.$.YourPrice}`
            }
          }
        }
      } catch {
        // ignore parsing errors
      }
    }

    extractPrices(regRes, registration)
    extractPrices(renewRes, renewal)

    if (transferRes.status === 'fulfilled') {
      try {
        const pt = transferRes.value.UserGetPricingResult?.[0]?.ProductType
        if (pt) {
          const domain = (Array.isArray(pt) ? pt : [pt]).find(
            (t: any) =>
              t.$.Name.toLowerCase() === 'domains' ||
              t.$.Name.toLowerCase() === 'domain'
          )
          if (domain?.ProductCategory) {
            for (const cat of domain.ProductCategory) {
              const product = cat.Product?.find(
                (p: any) => p.$.Name.toLowerCase() === cleanTld.toLowerCase()
              )
              if (product?.Price?.[0]?.$?.YourPrice) {
                transfer = `$${product.Price[0].$.YourPrice}`
                break
              }
            }
          }
        }
      } catch {
        // ignore
      }
    }

    return { registration, renewal, transfer }
  }
}
