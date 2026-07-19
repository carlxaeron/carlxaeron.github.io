window.ADMIN_CONFIG = window.ADMIN_CONFIG || {
  vertical: "leads",
  businessName: "Regan Industrial Sales Inc.",
  ownerRole: "Sales",
  userInitials: "RI",
  logo: "/assets/logo.png",
  painHero:
    "Steel section and pipe inquiries from contractors — see bulk quote requests and follow-ups due before site delivery.",
  brand: {
    primary: "#c41e3a",
    primaryDark: "#1a1a1a",
    accent: "#f5f5f5",
  },
  demo: {
    leads: {
      labels: {
        dashboardTitle: "Steel inquiries · today",
        dashboardSub: "3 contractor quotes · 1 bulk pipe order",
      },
      stats: [
        { label: "New leads", value: "3" },
        { label: "Quoted", value: "5" },
        { label: "Bulk orders", value: "1" },
        { label: "Follow-ups due", value: "2" },
      ],
      pipeline: {
        new: [
          { id: "RI-88", name: "Construction firm BGC", detail: "Steel sections · I-beam · 20 tons", source: "Phone", quoteAmount: "₱850,000", date: "Today" },
          { id: "RI-89", name: "Fabricator Valenzuela", detail: "Pipe & tubings · assorted", source: "Email", quoteAmount: "₱120,000", date: "Today" },
        ],
        quoted: [
          { id: "RI-87", name: "Warehouse builder", detail: "Steel flats & plates", source: "Referral", quoteAmount: "₱340,000", date: "Yesterday" },
          { id: "RI-84", name: "Contractor Pasig", detail: "Bars & rods · rebar supply", source: "Phone", quoteAmount: "₱95,000", date: "4 days ago" },
        ],
        negotiating: [
          { id: "RI-86", name: "Industrial plant", detail: "Monthly steel supply contract", source: "Email", quoteAmount: "₱1.2M/mo", date: "2 days ago" },
        ],
        won: [
          { id: "RI-82", name: "Bridge project sub", detail: "Sections · delivery scheduled", source: "Referral", quoteAmount: "₱520,000", date: "Won Fri" },
        ],
      },
      primaryList: [
        { id: "RI-88", name: "Construction firm BGC", detail: "I-beam · 20 tons", date: "Today", status: "open" },
        { id: "RI-87", name: "Warehouse builder", detail: "Flats & plates", date: "Yesterday", status: "pending" },
        { id: "RI-86", name: "Industrial plant", detail: "Monthly contract", date: "2 days ago", status: "pending" },
        { id: "RI-84", name: "Contractor Pasig", detail: "Rebar supply", date: "4 days ago", status: "pending" },
      ],
      people: [
        { name: "Construction firm BGC", meta: "Phone · bulk I-beam", tag: "Hot" },
        { name: "Industrial plant", meta: "Contract · negotiating", tag: "Warm" },
        { name: "Bridge project sub", meta: "Referral · won", tag: "Won" },
      ],
      settings: [
        { label: "Hotline", value: "+63 998 843 4711" },
        { label: "Products", value: "Sections · Bars · Pipe · Flats & plates" },
        { label: "Delivery", value: "Site delivery available" },
        { label: "Follow-up cadence", value: "3d → 7d × 3" },
      ],
    },
  },
};
