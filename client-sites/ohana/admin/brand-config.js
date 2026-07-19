window.ADMIN_CONFIG = window.ADMIN_CONFIG || {
  vertical: "leads",
  businessName: "Ohana Business Solutions Inc",
  ownerRole: "Consultant",
  userInitials: "OB",
  logo: null,
  painHero:
    "Business registration and tax inquiries from Facebook — pipeline new consults to quoted without losing Messenger threads.",
  brand: {
    primary: "#2d8fad",
    primaryDark: "#0f2d4a",
    accent: "#e07a5f",
  },
  demo: {
    leads: {
      labels: {
        dashboardTitle: "Consultation pipeline",
        dashboardSub: "3 new FB inquiries · 2 quotes pending approval",
      },
      stats: [
        { label: "New leads", value: "3" },
        { label: "Quoted", value: "4" },
        { label: "Won this month", value: "2" },
        { label: "Follow-ups due", value: "2" },
      ],
      pipeline: {
        new: [
          { id: "OB-88", name: "Startup food cart", detail: "DTI + BIR registration", source: "Facebook", quoteAmount: "₱8,500", date: "Today" },
          { id: "OB-89", name: "Online seller", detail: "Bookkeeping setup · monthly", source: "Messenger", quoteAmount: "₱3,500/mo", date: "Today" },
        ],
        quoted: [
          { id: "OB-87", name: "Sari-sari expansion", detail: "Business permit renewal", source: "FB", quoteAmount: "₱5,000", date: "Yesterday" },
          { id: "OB-84", name: "Freelancer group", detail: "Tax consultation · 5 pax", source: "Referral", quoteAmount: "₱12,000", date: "4 days ago" },
        ],
        negotiating: [
          { id: "OB-86", name: "Retail shop owner", detail: "Full registration package", source: "Messenger", quoteAmount: "₱15,000", date: "2 days ago" },
        ],
        won: [
          { id: "OB-82", name: "Café startup", detail: "DTI + mayor's permit", source: "Referral", quoteAmount: "₱7,500", date: "Won Mon" },
        ],
      },
      primaryList: [
        { id: "OB-88", name: "Startup food cart", detail: "DTI + BIR registration", date: "Today", status: "open" },
        { id: "OB-87", name: "Sari-sari expansion", detail: "Permit renewal", date: "Yesterday", status: "pending" },
        { id: "OB-86", name: "Retail shop owner", detail: "Full registration", date: "2 days ago", status: "pending" },
        { id: "OB-84", name: "Freelancer group", detail: "Tax consult · 5 pax", date: "4 days ago", status: "pending" },
      ],
      people: [
        { name: "Startup food cart", meta: "FB · new business", tag: "Hot" },
        { name: "Retail shop owner", meta: "Messenger · negotiating", tag: "Warm" },
        { name: "Café startup", meta: "Referral · won", tag: "Won" },
      ],
      settings: [
        { label: "Services", value: "Registration · Tax · Bookkeeping" },
        { label: "Consultation", value: "Document prep included" },
        { label: "Follow-up cadence", value: "3d → 7d × 3" },
        { label: "Channels", value: "FB · Messenger · Referral" },
      ],
    },
  },
};
