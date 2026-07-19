window.ADMIN_CONFIG = window.ADMIN_CONFIG || {
  vertical: "leads",
  businessName: "Journey Woodblock Modular Cabinets",
  ownerRole: "Owner",
  userInitials: "JW",
  logo: "/assets/logo.jpg",
  painHero:
    "Kitchen and closet modular quotes from FB photos — see CNC cabinet inquiries, amounts, and follow-ups due today.",
  brand: {
    primary: "#c4a574",
    primaryDark: "#3d2914",
    accent: "#b8860b",
  },
  extraNav: [{ id: "catalog", label: "Catalog", icon: "◈", hash: "#/catalog" }],
  demo: {
    leads: {
      labels: {
        dashboardTitle: "Cabinet inquiries",
        dashboardSub: "5 FB leads · 2 site measurements booked",
      },
      stats: [
        { label: "New leads", value: "5" },
        { label: "Quoted", value: "4" },
        { label: "Site visits", value: "2" },
        { label: "Follow-ups due", value: "3" },
      ],
      pipeline: {
        new: [
          { id: "JW-88", name: "Condo owner BGC", detail: "Modular kitchen · L-shape", source: "Messenger", quoteAmount: "₱185,000", date: "Today" },
          { id: "JW-89", name: "Homeowner Antipolo", detail: "Walk-in closet · master bed", source: "Facebook", quoteAmount: "₱95,000", date: "Today" },
        ],
        quoted: [
          { id: "JW-87", name: "Interior designer", detail: "Storage cabinets · 3 units", source: "Referral", quoteAmount: "₱72,000", date: "Yesterday" },
          { id: "JW-84", name: "Townhouse QC", detail: "Full kitchen + pantry", source: "FB", quoteAmount: "₱240,000", date: "4 days ago" },
        ],
        negotiating: [
          { id: "JW-86", name: "Developer sample unit", detail: "Modular kitchen showcase", source: "Email", quoteAmount: "₱320,000", date: "2 days ago" },
        ],
        won: [
          { id: "JW-82", name: "Marikina family", detail: "Kitchen cabinets · installed", source: "Referral", quoteAmount: "₱156,000", date: "Won Fri" },
        ],
      },
      primaryList: [
        { id: "JW-88", name: "Condo owner BGC", detail: "L-shape kitchen", date: "Today", status: "open" },
        { id: "JW-87", name: "Interior designer", detail: "Storage · 3 units", date: "Yesterday", status: "pending" },
        { id: "JW-86", name: "Developer sample unit", detail: "Showcase kitchen", date: "2 days ago", status: "pending" },
        { id: "JW-84", name: "Townhouse QC", detail: "Kitchen + pantry", date: "4 days ago", status: "pending" },
      ],
      people: [
        { name: "Condo owner BGC", meta: "Messenger · kitchen photos", tag: "Hot" },
        { name: "Developer sample unit", meta: "Email · large project", tag: "Warm" },
        { name: "Marikina family", meta: "Referral · installed", tag: "Won" },
      ],
      settings: [
        { label: "Hotline", value: "+63 917 893 6322" },
        { label: "Services", value: "Kitchen · Closets · Storage · CNC cutting" },
        { label: "Consultation", value: "Site measurement included" },
        { label: "Follow-up cadence", value: "3d → 7d × 3" },
      ],
      pages: {
        catalog: {
          title: "Modular lines",
          items: [
            { name: "Kitchen cabinets", price: "Custom L/U/G shapes" },
            { name: "Closets & walk-ins", price: "Built-in storage" },
            { name: "Storage cabinets", price: "Living & utility" },
            { name: "CNC wood cutting", price: "Workshop service" },
          ],
        },
      },
    },
  },
};
