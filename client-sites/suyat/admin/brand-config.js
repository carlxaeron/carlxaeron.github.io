window.ADMIN_CONFIG = window.ADMIN_CONFIG || {
  vertical: "leads",
  businessName: "Suyat Notary Public",
  ownerRole: "Notary",
  userInitials: "SN",
  logo: null,
  painHero:
    "Affidavit and deed requests flood Messenger — see notarization leads, quote amounts, and follow-ups in one inbox.",
  brand: {
    primary: "#6b3d4f",
    primaryDark: "#1a2332",
    accent: "#cba258",
  },
  demo: {
    leads: {
      labels: {
        dashboardTitle: "Notary inquiries",
        dashboardSub: "4 document requests · 2 appointments tomorrow",
      },
      stats: [
        { label: "New leads", value: "4" },
        { label: "Quoted", value: "3" },
        { label: "Scheduled", value: "2" },
        { label: "Follow-ups due", value: "1" },
      ],
      pipeline: {
        new: [
          { id: "SN-88", name: "Maria Reyes", detail: "Affidavit of loss · ATM card", source: "Messenger", quoteAmount: "₱500", date: "Today" },
          { id: "SN-89", name: "Property buyer Lim", detail: "Deed of sale notarization", source: "Phone", quoteAmount: "₱2,500", date: "Today" },
        ],
        quoted: [
          { id: "SN-87", name: "Corporate HR", detail: "Employment contract batch · 5 docs", source: "Email", quoteAmount: "₱3,500", date: "Yesterday" },
          { id: "SN-84", name: "Immigration applicant", detail: "Affidavit of support", source: "FB", quoteAmount: "₱800", date: "3 days ago" },
        ],
        negotiating: [
          { id: "SN-86", name: "Real estate broker", detail: "Monthly notary retainer", source: "Referral", quoteAmount: "₱5,000/mo", date: "2 days ago" },
        ],
        won: [
          { id: "SN-82", name: "Tan family", detail: "Special power of attorney", source: "Walk-in", quoteAmount: "₱1,200", date: "Won Fri" },
        ],
      },
      primaryList: [
        { id: "SN-88", name: "Maria Reyes", detail: "Affidavit of loss", date: "Today", status: "open" },
        { id: "SN-87", name: "Corporate HR", detail: "Contract batch · 5 docs", date: "Yesterday", status: "pending" },
        { id: "SN-86", name: "Real estate broker", detail: "Retainer inquiry", date: "2 days ago", status: "pending" },
        { id: "SN-84", name: "Immigration applicant", detail: "Affidavit of support", date: "3 days ago", status: "pending" },
      ],
      people: [
        { name: "Maria Reyes", meta: "Messenger · walk-in likely", tag: "Hot" },
        { name: "Real estate broker", meta: "Retainer · referral", tag: "Warm" },
        { name: "Tan family", meta: "Walk-in · completed", tag: "Won" },
      ],
      settings: [
        { label: "Services", value: "Notarization · Affidavits · Deeds" },
        { label: "Standard fee", value: "From ₱500 / document" },
        { label: "Appointments", value: "Walk-in & scheduled" },
        { label: "Follow-up cadence", value: "3d → 7d × 3" },
      ],
    },
  },
};
