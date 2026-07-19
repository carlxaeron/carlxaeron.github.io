window.ADMIN_CONFIG = window.ADMIN_CONFIG || {
  vertical: "leads",
  businessName: "IntelliSmart Technology Inc.",
  ownerRole: "Sales Engineer",
  userInitials: "IT",
  logo: "/assets/logo.png",
  painHero:
    "AV, security, and BMS project inquiries from facilities managers — track system-integration quotes by pipeline stage.",
  brand: {
    primary: "#00b4d8",
    primaryDark: "#061525",
    accent: "#e8f6fa",
  },
  demo: {
    leads: {
      labels: {
        dashboardTitle: "Integration pipeline",
        dashboardSub: "3 new project inquiries · 2 site surveys booked",
      },
      stats: [
        { label: "New leads", value: "3" },
        { label: "Quoted", value: "4" },
        { label: "Site surveys", value: "2" },
        { label: "Follow-ups due", value: "2" },
      ],
      pipeline: {
        new: [
          { id: "IT-88", name: "BGC office tower", detail: "AV + BMS integration", source: "Email", quoteAmount: "₱850,000", date: "Today" },
          { id: "IT-89", name: "QSR chain rollout", detail: "Structured cabling · 5 branches", source: "Referral", quoteAmount: "₱420,000", date: "Today" },
        ],
        quoted: [
          { id: "IT-87", name: "Hospital wing", detail: "Security + access control", source: "Phone", quoteAmount: "₱680,000", date: "Yesterday" },
          { id: "IT-84", name: "Hotel renovation", detail: "Automation & lighting", source: "Email", quoteAmount: "₱1.2M", date: "5 days ago" },
        ],
        negotiating: [
          { id: "IT-86", name: "Commercial mall", detail: "Full ICT + AV fit-out", source: "Referral", quoteAmount: "₱2.5M", date: "3 days ago" },
        ],
        won: [
          { id: "IT-82", name: "Corporate HQ", detail: "Conference room AV", source: "Referral", quoteAmount: "₱320,000", date: "Won Tue" },
        ],
      },
      primaryList: [
        { id: "IT-88", name: "BGC office tower", detail: "AV + BMS integration", date: "Today", status: "open" },
        { id: "IT-87", name: "Hospital wing", detail: "Security + access", date: "Yesterday", status: "pending" },
        { id: "IT-86", name: "Commercial mall", detail: "Full ICT fit-out", date: "3 days ago", status: "pending" },
        { id: "IT-84", name: "Hotel renovation", detail: "Automation & lighting", date: "5 days ago", status: "pending" },
      ],
      people: [
        { name: "BGC office tower", meta: "Email · AV + BMS", tag: "Hot" },
        { name: "Commercial mall", meta: "Referral · large project", tag: "Warm" },
        { name: "Corporate HQ", meta: "Referral · won", tag: "Won" },
      ],
      settings: [
        { label: "Hotline", value: "+632 8350 5986" },
        { label: "Solutions", value: "AV · Security · BMS · ICT · Automation" },
        { label: "Verticals", value: "QSR · Commercial · Healthcare" },
        { label: "Follow-up cadence", value: "3d → 7d × 3" },
      ],
    },
  },
};
