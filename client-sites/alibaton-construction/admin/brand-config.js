window.ADMIN_CONFIG = window.ADMIN_CONFIG || {
  vertical: "service",
  businessName: "Alibaton Construction Inc.",
  ownerRole: "Operations",
  userInitials: "AC",
  logo: "/assets/logo.jpg",
  painHero:
    "Tower crane rental inquiries and service tickets stack up — track Potain units on rent vs jobs needing mobile crane dispatch.",
  brand: {
    primary: "#c41e3a",
    primaryDark: "#0a0a0a",
    accent: "#f4f4f5",
  },
  extraNav: [{ id: "equipment", label: "Fleet", icon: "◈", hash: "#/equipment" }],
  demo: {
    service: {
      labels: {
        dashboardTitle: "Crane fleet dispatch",
        dashboardSub: "2 rentals mobilizing · 1 service call on Potain MCT 205",
      },
      stats: [
        { label: "Active rentals", value: "5" },
        { label: "Service calls", value: "2" },
        { label: "Mobilizing", value: "2" },
        { label: "Quotes open", value: "3" },
      ],
      kanban: {
        new: [
          { id: "AC-702", name: "BGC high-rise", detail: "Tower crane rental · 12 months", priority: "normal", date: "Quote due" },
          { id: "AC-703", name: "Cavite industrial", detail: "Mobile crane · steel erection", priority: "normal", date: "Thu" },
        ],
        scheduled: [
          { id: "AC-699", name: "Quezon City mid-rise", detail: "Potain MCT 205 · mobilization", priority: "normal", date: "Tomorrow" },
          { id: "AC-700", name: "Pasig warehouse", detail: "Crane dismantle & transfer", priority: "normal", date: "Today · PM" },
        ],
        inProgress: [
          { id: "AC-701", name: "Makati tower site", detail: "Service · slewing gear", priority: "emergency", date: "Today", tech: "Service Team A" },
          { id: "AC-697", name: "Taguig construction", detail: "Rental · Potain on site", priority: "normal", date: "Active", tech: "Ops" },
        ],
        done: [
          { id: "AC-696", name: "Marikina project", detail: "Monthly inspection", priority: "low", date: "Done Mon" },
        ],
      },
      primaryList: [
        { id: "AC-701", name: "Makati tower site", detail: "Emergency service · slewing", date: "Today", status: "open" },
        { id: "AC-699", name: "Quezon City mid-rise", detail: "Potain MCT 205 mobilize", date: "Tomorrow", status: "confirmed" },
        { id: "AC-702", name: "BGC high-rise", detail: "12-month rental quote", date: "Quote due Fri", status: "pending" },
        { id: "AC-703", name: "Cavite industrial", detail: "Mobile crane · steel", date: "Thu", status: "pending" },
      ],
      people: [
        { name: "Makati tower site", meta: "Active rental · service call", tag: "Priority" },
        { name: "BGC high-rise", meta: "New rental inquiry", tag: "Hot" },
        { name: "Quezon City mid-rise", meta: "Potain mobilization", tag: "Active" },
      ],
      settings: [
        { label: "Hotline", value: "+63 917 542 0415" },
        { label: "Fleet", value: "Potain · Manitowoc class" },
        { label: "Services", value: "Rental · Sales · Service · Parts" },
        { label: "Coverage", value: "NCR · Luzon projects" },
      ],
      pages: {
        equipment: {
          title: "Crane fleet",
          items: [
            { name: "Tower crane rental", price: "Monthly & project terms" },
            { name: "Tower crane sales", price: "Potain class units" },
            { name: "Mobile crane solutions", price: "Steel erection support" },
            { name: "Service & parts", price: "On-site maintenance" },
          ],
        },
      },
    },
  },
};
