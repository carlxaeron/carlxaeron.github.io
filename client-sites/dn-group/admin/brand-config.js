window.ADMIN_CONFIG = window.ADMIN_CONFIG || {
  vertical: "leads",
  businessName: "DN Group of Companies",
  ownerRole: "Sales",
  userInitials: "DG",
  logo: "/assets/logo.png",
  painHero:
    "Metal roofing and uPVC project quotes from contractors — see new bulk orders and follow-up calls due today.",
  brand: {
    primary: "#d97706",
    primaryDark: "#0e0f12",
    accent: "#f3f4f6",
  },
  extraNav: [{ id: "products", label: "Products", icon: "◈", hash: "#/products" }],
  demo: {
    leads: {
      labels: {
        dashboardTitle: "Roofing inquiries",
        dashboardSub: "4 contractor quotes · 1 warehouse project",
      },
      stats: [
        { label: "New leads", value: "4" },
        { label: "Quoted", value: "5" },
        { label: "Projects", value: "2" },
        { label: "Follow-ups due", value: "3" },
      ],
      pipeline: {
        new: [
          { id: "DG-88", name: "Warehouse builder Cavite", detail: "Metal roofing · 2,000 sqm", source: "Phone", quoteAmount: "₱680,000", date: "Today" },
          { id: "DG-89", name: "Residential developer", detail: "uPVC roofing · 15 units", source: "Email", quoteAmount: "₱420,000", date: "Today" },
        ],
        quoted: [
          { id: "DG-87", name: "Commercial retrofit", detail: "Insulated panels · office", source: "Referral", quoteAmount: "₱850,000", date: "Yesterday" },
          { id: "DG-84", name: "Contractor Bulacan", detail: "Steel decking · mixed", source: "Phone", quoteAmount: "₱320,000", date: "4 days ago" },
        ],
        negotiating: [
          { id: "DG-86", name: "Industrial park", detail: "Full roofing package · 5 buildings", source: "Email", quoteAmount: "₱2.4M", date: "2 days ago" },
        ],
        won: [
          { id: "DG-82", name: "Factory expansion", detail: "Metal roofing delivery", source: "Referral", quoteAmount: "₱540,000", date: "Won Mon" },
        ],
      },
      primaryList: [
        { id: "DG-88", name: "Warehouse builder Cavite", detail: "Metal roofing · 2,000 sqm", date: "Today", status: "open" },
        { id: "DG-87", name: "Commercial retrofit", detail: "Insulated panels", date: "Yesterday", status: "pending" },
        { id: "DG-86", name: "Industrial park", detail: "5-building package", date: "2 days ago", status: "pending" },
        { id: "DG-84", name: "Contractor Bulacan", detail: "Steel decking", date: "4 days ago", status: "pending" },
      ],
      people: [
        { name: "Warehouse builder Cavite", meta: "Phone · large sqm", tag: "Hot" },
        { name: "Industrial park", meta: "Multi-building · negotiating", tag: "Warm" },
        { name: "Factory expansion", meta: "Referral · won", tag: "Won" },
      ],
      settings: [
        { label: "Hotline", value: "+63 998 846 2400" },
        { label: "Products", value: "Metal · uPVC · ACP · Steel decking · Insulated panels" },
        { label: "Market", value: "Contractors · Developers" },
        { label: "Follow-up cadence", value: "3d → 7d × 3" },
      ],
      pages: {
        products: {
          title: "Building systems",
          items: [
            { name: "Metal roofing", price: "Project quote" },
            { name: "uPVC roofing", price: "Residential & commercial" },
            { name: "Aluminum composite", price: "Facade systems" },
            { name: "Insulated panels", price: "Industrial fit-out" },
          ],
        },
      },
    },
  },
};
