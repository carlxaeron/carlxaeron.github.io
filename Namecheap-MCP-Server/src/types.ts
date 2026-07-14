export interface NamecheapConfig {
  apiUser: string
  apiKey: string
  userName: string
  clientIp: string
  sandbox: boolean
}

export interface DomainListItem {
  id: string
  name: string
  user: string
  created: string
  expires: string
  isExpired: boolean
  isLocked: boolean
  autoRenew: boolean
  whoisGuard: string
  isPremium: boolean
  isOurDns: boolean
}

export interface DomainCheckResult {
  domain: string
  available: boolean
  isPremiumName: boolean
  premiumRegistrationPrice?: string
  premiumRenewalPrice?: string
  premiumRestorePrice?: string
  premiumTransferPrice?: string
  icannFee?: string
}

export interface DomainInfo {
  domainName: string
  ownerName: string
  isOwner: boolean
  isPremium: boolean
  status: string
  createdDate: string
  expiredDate: string
  dnsProvider: string
  isUsingOurDns: boolean
  nameservers: string[]
}

export interface DNSHost {
  name: string
  type: string
  address: string
  mxPref?: string
  ttl?: string
}

export interface TLDPricing {
  registration: Record<string, string>
  renewal: Record<string, string>
  transfer: string
}
