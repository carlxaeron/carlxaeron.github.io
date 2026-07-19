window.ADMIN_CONFIG = window.ADMIN_CONFIG || {
  vertical: "service",
  businessName: "Machinemate Mainteneering Services",
  ownerRole: "Operations",
  userInitials: "MM",
  logo: null,
  painHero:
    "Fan installs and factory maintenance requests across sites — see emergency vs scheduled jobs and which team is on the road.",
  brand: {
    primary: "#38bdf8",
    primaryDark: "#0c2340",
    accent: "#eef4fa",
  },
  extraNav: [{ id: "equipment", label: "Equipment", icon: "◈", hash: "#/equipment" }],
  demo: {
    service: {
      labels: {
        dashboardTitle: "Ventilation dispatch",
        dashboardSub: "1 emergency exhaust failure · 2 installs scheduled",
      },
      stats: [
        { label: "Open jobs", value: "6" },
        { label: "Emergency", value: "1" },
        { label: "In progress", value: "2" },
        { label: "QA pending", value: "1" },
      ],
      kanban: {
        new: [
          { id: "MM-402", name: "Caloocan factory", detail: "SS centrifugal · motor failure", priority: "emergency", date: "Today" },
        ],
        scheduled: [
          { id: "MM-399", name: "Laguna plant", detail: "Roof exhaust · 4 units", priority: "normal", date: "Tomorrow" },
          { id: "MM-400", name: "Valenzuela warehouse", detail: "Axial fan install", priority: "normal", date: "Wed" },
        ],
        inProgress: [
          { id: "MM-401", name: "QC industrial park", detail: "MS centrifugal maintenance", priority: "normal", date: "Today", tech: "Team A" },
          { id: "MM-397", name: "Bulacan facility", detail: "Testing & QA · new unit", priority: "normal", date: "Today", tech: "Team B" },
        ],
        done: [
          { id: "MM-396", name: "Pasig manufacturing", detail: "Preventive maintenance", priority: "low", date: "Done 10:00 AM" },
        ],
      },
      primaryList: [
        { id: "MM-402", name: "Caloocan factory", detail: "Emergency · motor failure", date: "Today · ASAP", status: "open" },
        { id: "MM-401", name: "QC industrial park", detail: "MS centrifugal PM", date: "Today", status: "open" },
        { id: "MM-400", name: "Valenzuela warehouse", detail: "Axial fan install", date: "Wed", status: "pending" },
        { id: "MM-399", name: "Laguna plant", detail: "Roof exhaust · 4 units", date: "Tomorrow", status: "confirmed" },
      ],
      people: [
        { name: "Caloocan factory", meta: "Emergency · production line down", tag: "Priority" },
        { name: "QC industrial park", meta: "Quarterly PM contract", tag: "Contract" },
        { name: "Laguna plant", meta: "Roof exhaust project", tag: "Account" },
      ],
      settings: [
        { label: "Products", value: "SS & MS centrifugal · Axial · Roof exhaust" },
        { label: "Services", value: "Install · Maintenance · QA testing" },
        { label: "Hotline", value: "+63 917 776 1418" },
        { label: "Teams", value: "2 field crews today" },
      ],
      pages: {
        equipment: {
          title: "Fan equipment lines",
          items: [
            { name: "SS centrifugal fans", price: "Industrial grade" },
            { name: "MS centrifugal fans", price: "Standard duty" },
            { name: "Axial fans", price: "Ventilation installs" },
            { name: "Roof exhaust systems", price: "Factory & warehouse" },
          ],
        },
      },
    },
  },
};
