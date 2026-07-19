window.ADMIN_CONFIG = window.ADMIN_CONFIG || {
  vertical: "leads",
  businessName: "RG Decals and Printing Shop",
  ownerRole: "Owner",
  userInitials: "RD",
  logo: "/assets/logo.png",
  painHero:
    "Vehicle decal and banner specs sent as FB photos — track print jobs from inquiry to quoted without re-typing sizes.",
  brand: {
    primary: "#e53935",
    primaryDark: "#12151c",
    accent: "#f4f6f8",
  },
  demo: {
    leads: {
      labels: {
        dashboardTitle: "Print inquiries · today",
        dashboardSub: "5 FB leads · 2 vehicle decal quotes due",
      },
      stats: [
        { label: "New leads", value: "5" },
        { label: "Quoted", value: "4" },
        { label: "In production", value: "2" },
        { label: "Follow-ups due", value: "2" },
      ],
      pipeline: {
        new: [
          { id: "RD-88", name: "Grab driver Reyes", detail: "Vehicle decal · full wrap", source: "Facebook", quoteAmount: "₱8,500", date: "Today" },
          { id: "RD-89", name: "Sari-sari store", detail: "Storefront sign · 4×8 ft", source: "Messenger", quoteAmount: "₱3,200", date: "Today" },
        ],
        quoted: [
          { id: "RD-87", name: "Food truck Lim", detail: "Menu board + decals", source: "FB", quoteAmount: "₱6,500", date: "Yesterday" },
          { id: "RD-84", name: "School event", detail: "Banner · 6×3 ft · 3 pcs", source: "Phone", quoteAmount: "₱4,500", date: "3 days ago" },
        ],
        negotiating: [
          { id: "RD-86", name: "Fleet operator", detail: "10-vehicle decal batch", source: "Email", quoteAmount: "₱45,000", date: "2 days ago" },
        ],
        won: [
          { id: "RD-82", name: "Motorcycle club", detail: "Sticker set · 50 pcs", source: "Referral", quoteAmount: "₱2,800", date: "Won Tue" },
        ],
      },
      primaryList: [
        { id: "RD-88", name: "Grab driver Reyes", detail: "Vehicle decal wrap", date: "Today", status: "open" },
        { id: "RD-87", name: "Food truck Lim", detail: "Menu board + decals", date: "Yesterday", status: "pending" },
        { id: "RD-86", name: "Fleet operator", detail: "10-vehicle batch", date: "2 days ago", status: "pending" },
        { id: "RD-84", name: "School event", detail: "Banners · 3 pcs", date: "3 days ago", status: "pending" },
      ],
      people: [
        { name: "Grab driver Reyes", meta: "FB photo specs", tag: "Hot" },
        { name: "Fleet operator", meta: "Bulk order · negotiating", tag: "Warm" },
        { name: "Motorcycle club", meta: "Referral · won", tag: "Won" },
      ],
      settings: [
        { label: "Services", value: "Decals · Signs · Banners · Custom print" },
        { label: "Hotline", value: "+63 995 456 7971" },
        { label: "Design support", value: "Included on quote" },
        { label: "Follow-up cadence", value: "3d → 7d × 3" },
      ],
    },
  },
};
