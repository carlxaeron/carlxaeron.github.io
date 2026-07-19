window.ADMIN_CONFIG = window.ADMIN_CONFIG || {
  vertical: "leads",
  businessName: "Fastpoint PH",
  ownerRole: "Sales",
  userInitials: "FP",
  logo: null,
  painHero:
    "Container tire orders and fleet supply inquiries — track Joyall commercial tire quotes from inquiry to won.",
  brand: {
    primary: "#e07a1f",
    primaryDark: "#0a1628",
    accent: "#eef2f6",
  },
  demo: {
    leads: {
      labels: {
        dashboardTitle: "Fleet supply pipeline",
        dashboardSub: "3 container inquiries · 1 fleet contract",
      },
      stats: [
        { label: "New leads", value: "3" },
        { label: "Quoted", value: "4" },
        { label: "Containers", value: "2" },
        { label: "Follow-ups due", value: "2" },
      ],
      pipeline: {
        new: [
          { id: "FP-88", name: "Logistics firm NCR", detail: "Joyall tires · 1 container", source: "Phone", quoteAmount: "₱1.2M", date: "Today" },
          { id: "FP-89", name: "Bus operator", detail: "Commercial tires · mixed sizes", source: "Email", quoteAmount: "₱850,000", date: "Today" },
        ],
        quoted: [
          { id: "FP-87", name: "Trucking company", detail: "Fleet supply · quarterly", source: "Referral", quoteAmount: "₱2.4M/qtr", date: "Yesterday" },
          { id: "FP-84", name: "Delivery fleet startup", detail: "Initial stock · 200 units", source: "Phone", quoteAmount: "₱680,000", date: "5 days ago" },
        ],
        negotiating: [
          { id: "FP-86", name: "National carrier", detail: "Annual supply agreement", source: "Email", quoteAmount: "₱8M/yr", date: "3 days ago" },
        ],
        won: [
          { id: "FP-82", name: "Provincial bus line", detail: "Container delivery scheduled", source: "Referral", quoteAmount: "₱1.5M", date: "Won Tue" },
        ],
      },
      primaryList: [
        { id: "FP-88", name: "Logistics firm NCR", detail: "Joyall · 1 container", date: "Today", status: "open" },
        { id: "FP-87", name: "Trucking company", detail: "Quarterly fleet supply", date: "Yesterday", status: "pending" },
        { id: "FP-86", name: "National carrier", detail: "Annual agreement", date: "3 days ago", status: "pending" },
        { id: "FP-84", name: "Delivery fleet startup", detail: "200 units initial", date: "5 days ago", status: "pending" },
      ],
      people: [
        { name: "Logistics firm NCR", meta: "Phone · container order", tag: "Hot" },
        { name: "National carrier", meta: "Annual contract · negotiating", tag: "Warm" },
        { name: "Provincial bus line", meta: "Referral · won", tag: "Won" },
      ],
      settings: [
        { label: "Hotline", value: "+63 917 821 2009" },
        { label: "Product", value: "Joyall commercial tires" },
        { label: "Reach", value: "Nationwide fleet supply" },
        { label: "Follow-up cadence", value: "3d → 7d × 3" },
      ],
    },
  },
};
