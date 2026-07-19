window.ADMIN_CONFIG = window.ADMIN_CONFIG || {
  vertical: "leads",
  businessName: "SV More Group of Companies",
  ownerRole: "Sales",
  userInitials: "SV",
  logo: "/assets/logo.png",
  painHero:
    "Pharma distribution inquiries and product orders on email — see Polynerv and FLO Baby leads waiting for a quote.",
  brand: {
    primary: "#2a9d8f",
    primaryDark: "#0c3d3a",
    accent: "#c4a35a",
  },
  extraNav: [{ id: "products", label: "Products", icon: "◈", hash: "#/products" }],
  demo: {
    leads: {
      labels: {
        dashboardTitle: "Pharma inquiries",
        dashboardSub: "4 distributor leads · 2 reorders pending",
      },
      stats: [
        { label: "New leads", value: "4" },
        { label: "Quoted", value: "3" },
        { label: "Reorders", value: "2" },
        { label: "Follow-ups due", value: "2" },
      ],
      pipeline: {
        new: [
          { id: "SV-88", name: "Pharmacy chain Visayas", detail: "Polynerv 1000 · initial stock", source: "Email", quoteAmount: "₱85,000", date: "Today" },
          { id: "SV-89", name: "Pediatric clinic", detail: "FLO Baby · clinic supply", source: "Phone", quoteAmount: "₱12,500", date: "Today" },
        ],
        quoted: [
          { id: "SV-87", name: "Drugstore franchise", detail: "Aminobrain + Macrobee bundle", source: "Email", quoteAmount: "₱45,000", date: "Yesterday" },
          { id: "SV-84", name: "Hospital pharmacy", detail: "Polynerv · monthly supply", source: "Referral", quoteAmount: "₱120,000/mo", date: "4 days ago" },
        ],
        negotiating: [
          { id: "SV-86", name: "Regional distributor", detail: "Full product line · Luzon", source: "Email", quoteAmount: "₱650,000", date: "2 days ago" },
        ],
        won: [
          { id: "SV-82", name: "Mercury Drug branch", detail: "Polynerv restock", source: "Phone", quoteAmount: "₱28,000", date: "Won Mon" },
        ],
      },
      primaryList: [
        { id: "SV-88", name: "Pharmacy chain Visayas", detail: "Polynerv initial stock", date: "Today", status: "open" },
        { id: "SV-87", name: "Drugstore franchise", detail: "Aminobrain bundle", date: "Yesterday", status: "pending" },
        { id: "SV-86", name: "Regional distributor", detail: "Full line · Luzon", date: "2 days ago", status: "pending" },
        { id: "SV-84", name: "Hospital pharmacy", detail: "Monthly Polynerv", date: "4 days ago", status: "pending" },
      ],
      people: [
        { name: "Pharmacy chain Visayas", meta: "Email · new account", tag: "Hot" },
        { name: "Regional distributor", meta: "Bulk · negotiating", tag: "Warm" },
        { name: "Mercury Drug branch", meta: "Reorder · won", tag: "Won" },
      ],
      settings: [
        { label: "Hotline", value: "+632 8373 6240" },
        { label: "Products", value: "Polynerv · FLO Baby · Aminobrain · Macrobee" },
        { label: "Coverage", value: "Nationwide distribution" },
        { label: "Follow-up cadence", value: "3d → 7d × 3" },
      ],
      pages: {
        products: {
          title: "Product line",
          items: [
            { name: "Polynerv 1000", price: "Neuro supplement" },
            { name: "FLO Baby", price: "Pediatric nutrition" },
            { name: "Aminobrain", price: "Cognitive support" },
            { name: "Macrobee with Iron Forte", price: "Multivitamin" },
          ],
        },
      },
    },
  },
};
