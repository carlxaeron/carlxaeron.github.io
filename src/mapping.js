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
}
