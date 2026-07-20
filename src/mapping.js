export const mapping = {
  contact: process.env.NODE_ENV === 'development'
    ? 'http://127.0.0.1:5001/carllouismanuel-1e3a9/us-central1/contact'
    : 'https://api.carlmanuel.com/contact',
  assistant: 'https://api.carlmanuel.com/assistant',
  quotation: process.env.NODE_ENV === 'development'
    ? 'http://127.0.0.1:5001/carllouismanuel-1e3a9/us-central1/quotation'
    : 'https://api.carlmanuel.com/quotation',
  trackVisit: process.env.NODE_ENV === 'development'
    ? 'http://127.0.0.1:5001/carllouismanuel-1e3a9/us-central1/trackVisit'
    : 'https://api.carlmanuel.com/trackVisit',
  previewFeedback: process.env.NODE_ENV === 'development'
    ? 'http://127.0.0.1:5001/carllouismanuel-1e3a9/us-central1/previewFeedback'
    : 'https://api.carlmanuel.com/previewFeedback',
  analyticsSummary: process.env.NODE_ENV === 'development'
    ? 'http://127.0.0.1:5001/carllouismanuel-1e3a9/us-central1/analyticsSummary'
    : 'https://api.carlmanuel.com/analyticsSummary',
  adminLogin: 'https://api.carlmanuel.com/admin/login',
  adminLogout: 'https://api.carlmanuel.com/admin/logout',
  adminSummary: 'https://api.carlmanuel.com/admin/summary',
  adminAnalytics: 'https://api.carlmanuel.com/admin/analytics',
  adminContacts: 'https://api.carlmanuel.com/admin/contacts',
  adminQuotations: 'https://api.carlmanuel.com/admin/quotations',
  adminOutreach: 'https://api.carlmanuel.com/admin/outreach',
  adminOutreachPause: 'https://api.carlmanuel.com/admin/outreachPause',
  adminContent: 'https://api.carlmanuel.com/admin/content',
  adminPushVapidPublicKey: 'https://api.carlmanuel.com/admin/push/vapidPublicKey',
  adminPushSubscribe: 'https://api.carlmanuel.com/admin/push/subscribe',
  adminPushTest: 'https://api.carlmanuel.com/admin/push/sendPing',
  adminAgreements: 'https://api.carlmanuel.com/admin/agreements',
  portfolioContent: 'https://api.carlmanuel.com/content',
  /** Public service agreement by token — GET /agreements/{token}, POST /agreements/{token}/sign */
  agreementBase: 'https://api.carlmanuel.com/agreements',
}
