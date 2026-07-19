window.ADMIN_CONFIG = window.ADMIN_CONFIG || {
  vertical: "leads",
  businessName: "Extra Rice 8 Trading, OPC",
  ownerRole: "Owner",
  userInitials: "ER",
  logo: null,
  painHero:
    "Wholesale sack orders and walk-in price checks on Viber — track rice variety quotes and delivery requests without losing the thread.",
  brand: {
    primary: "#3d8f5a",
    primaryDark: "#1a3d2e",
    accent: "#c9a227",
  },
  demo: {
    leads: {
      labels: {
        dashboardTitle: "Rice orders · today",
        dashboardSub: "5 wholesale inquiries · 2 deliveries scheduled",
      },
      stats: [
        { label: "New leads", value: "5" },
        { label: "Quoted", value: "4" },
        { label: "Deliveries", value: "2" },
        { label: "Follow-ups due", value: "3" },
      ],
      pipeline: {
        new: [
          { id: "ER-88", name: "Carinderia chain QC", detail: "Sinandomeng · 50 sacks", source: "Viber", quoteAmount: "₱42,500", date: "Today" },
          { id: "ER-89", name: "Montalban retailer", detail: "Planters Rice · 20 sacks", source: "Messenger", quoteAmount: "₱38,000", date: "Today" },
        ],
        quoted: [
          { id: "ER-87", name: "Fairview eatery", detail: "Mixed varieties · weekly", source: "Phone", quoteAmount: "₱15,000/wk", date: "Yesterday" },
          { id: "ER-84", name: "School canteen", detail: "Local Sinandomeng · 30 sacks", source: "FB", quoteAmount: "₱24,000", date: "3 days ago" },
        ],
        negotiating: [
          { id: "ER-86", name: "Restaurant group", detail: "Monthly supply contract", source: "Email", quoteAmount: "₱65,000/mo", date: "2 days ago" },
        ],
        won: [
          { id: "ER-82", name: "Barangay cooperative", detail: "Planters · 10 sacks", source: "Walk-in", quoteAmount: "₱19,000", date: "Won Sat" },
        ],
      },
      primaryList: [
        { id: "ER-88", name: "Carinderia chain QC", detail: "Sinandomeng · 50 sacks", date: "Today", status: "open" },
        { id: "ER-87", name: "Fairview eatery", detail: "Weekly supply", date: "Yesterday", status: "pending" },
        { id: "ER-86", name: "Restaurant group", detail: "Monthly contract", date: "2 days ago", status: "pending" },
        { id: "ER-84", name: "School canteen", detail: "30 sacks Sinandomeng", date: "3 days ago", status: "pending" },
      ],
      people: [
        { name: "Carinderia chain QC", meta: "Viber · bulk order", tag: "Hot" },
        { name: "Restaurant group", meta: "Contract negotiation", tag: "Warm" },
        { name: "Barangay cooperative", meta: "Walk-in · won", tag: "Won" },
      ],
      settings: [
        { label: "Varieties", value: "Planters · Sinandomeng · Local" },
        { label: "Wholesale", value: "Sack pricing · delivery" },
        { label: "Hotline", value: "+63 967 582 0455" },
        { label: "Follow-up cadence", value: "3d → 7d × 3" },
      ],
    },
  },
};
