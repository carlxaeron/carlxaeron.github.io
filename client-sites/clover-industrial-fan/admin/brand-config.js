window.ADMIN_CONFIG = window.ADMIN_CONFIG || {
  vertical: "service",
  businessName: "Clover Industrial Fan and Blower Inc.",
  ownerRole: "Operations",
  userInitials: "CI",
  logo: null,
  painHero:
    "Bulk fan orders and factory service calls stack up — kanban today's centrifugal installs and roof exhaust jobs by priority.",
  brand: {
    primary: "#4ade80",
    primaryDark: "#14532d",
    accent: "#ecfdf5",
  },
  extraNav: [{ id: "equipment", label: "Equipment", icon: "◈", hash: "#/equipment" }],
  demo: {
    service: {
      labels: {
        dashboardTitle: "Clover dispatch board",
        dashboardSub: "2 factory emergencies · bulk order staging",
      },
      stats: [
        { label: "Open jobs", value: "8" },
        { label: "Emergency", value: "2" },
        { label: "Bulk orders", value: "1" },
        { label: "Done today", value: "4" },
      ],
      kanban: {
        new: [
          { id: "CI-502", name: "Muntinlupa plant", detail: "Roof exhaust · blower down", priority: "emergency", date: "Today" },
          { id: "CI-503", name: "Cavite electronics", detail: "SS centrifugal · 20 units", priority: "normal", date: "Fri" },
        ],
        scheduled: [
          { id: "CI-499", name: "Pasig warehouse", detail: "Axial fan install · 6 units", priority: "normal", date: "Tomorrow" },
          { id: "CI-500", name: "Taguig facility", detail: "Maintenance engineering visit", priority: "normal", date: "Today · PM" },
        ],
        inProgress: [
          { id: "CI-501", name: "Bulacan factory", detail: "MS centrifugal repair", priority: "emergency", date: "Today · AM", tech: "Team A" },
          { id: "CI-497", name: "QC industrial", detail: "Testing & QA · new blower", priority: "normal", date: "Today", tech: "Team B" },
        ],
        done: [
          { id: "CI-496", name: "Marikina workshop", detail: "Preventive maintenance", priority: "low", date: "Done 9:00 AM" },
        ],
      },
      primaryList: [
        { id: "CI-502", name: "Muntinlupa plant", detail: "Emergency · blower down", date: "Today · ASAP", status: "open" },
        { id: "CI-501", name: "Bulacan factory", detail: "MS centrifugal repair", date: "Today · AM", status: "open" },
        { id: "CI-503", name: "Cavite electronics", detail: "Bulk · 20 SS units", date: "Fri", status: "pending" },
        { id: "CI-499", name: "Pasig warehouse", detail: "Axial install · 6 units", date: "Tomorrow", status: "confirmed" },
      ],
      people: [
        { name: "Muntinlupa plant", meta: "Production stopped · emergency", tag: "Priority" },
        { name: "Cavite electronics", meta: "Bulk order · 20 units", tag: "Hot" },
        { name: "Pasig warehouse", meta: "Install project", tag: "Account" },
      ],
      settings: [
        { label: "Hotline", value: "+63 908 157 4707" },
        { label: "Products", value: "Centrifugal · Axial · Roof exhaust" },
        { label: "Services", value: "Sales · Install · Maintenance · QA" },
        { label: "Field teams", value: "2 crews active" },
      ],
      pages: {
        equipment: {
          title: "Industrial fan catalog",
          items: [
            { name: "SS centrifugal fans", price: "Heavy-duty" },
            { name: "MS centrifugal fans", price: "Standard industrial" },
            { name: "Axial fans", price: "Ventilation systems" },
            { name: "Roof exhaust systems", price: "Factory fit-out" },
          ],
        },
      },
    },
  },
};
