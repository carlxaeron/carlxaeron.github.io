window.ADMIN_CONFIG = window.ADMIN_CONFIG || {
  vertical: "service",
  businessName: "Jazz1 Airconditioning Services - Montalban Rizal",
  ownerRole: "Operations",
  userInitials: "JA",
  logo: null,
  painHero:
    "Emergency no-cool calls and scheduled cleanings overlap in Montalban — dispatch tech teams from one job board instead of scattered Messenger threads.",
  brand: {
    primary: "#38bdf8",
    primaryDark: "#0c4a6e",
    accent: "#e0f2fe",
  },
  demo: {
    service: {
      labels: {
        dashboardTitle: "Montalban dispatch · today",
        dashboardSub: "2 emergency no-cool · 4 cleanings scheduled",
      },
      stats: [
        { label: "Open jobs", value: "9" },
        { label: "Emergency", value: "2" },
        { label: "In progress", value: "3" },
        { label: "Done today", value: "6" },
      ],
      kanban: {
        new: [
          { id: "JA-602", name: "San Jose subdiv home", detail: "Split-type not cooling · 2F", priority: "emergency", date: "Today" },
          { id: "JA-603", name: "Rodriguez sari-sari store", detail: "Window type · leak", priority: "emergency", date: "Today" },
        ],
        scheduled: [
          { id: "JA-599", name: "Montalban townhouse", detail: "General cleaning · 3 units", priority: "normal", date: "Today · PM" },
          { id: "JA-600", name: "Greenfield homes", detail: "New install · 2 split types", priority: "normal", date: "Tomorrow" },
        ],
        inProgress: [
          { id: "JA-601", name: "SM East tenant", detail: "Chemical wash · commercial", priority: "normal", date: "Today · AM", tech: "Team A" },
          { id: "JA-597", name: "Antipolo condo", detail: "Repair · PCB issue", priority: "normal", date: "Today", tech: "Team B" },
        ],
        done: [
          { id: "JA-596", name: "Marikina office", detail: "Preventive maintenance", priority: "low", date: "Done 9:30 AM" },
          { id: "JA-595", name: "Fairview apartment", detail: "Gas refill", priority: "normal", date: "Done 8:45 AM" },
        ],
      },
      primaryList: [
        { id: "JA-602", name: "San Jose subdiv home", detail: "Emergency · not cooling", date: "Today · ASAP", status: "open" },
        { id: "JA-601", name: "SM East tenant", detail: "Chemical wash", date: "Today · AM", status: "open" },
        { id: "JA-600", name: "Greenfield homes", detail: "New install · 2 units", date: "Tomorrow", status: "pending" },
        { id: "JA-599", name: "Montalban townhouse", detail: "General cleaning · 3 units", date: "Today · PM", status: "confirmed" },
      ],
      people: [
        { name: "SM East tenant", meta: "Commercial · quarterly PM", tag: "Contract" },
        { name: "Greenfield homes", meta: "New install inquiry · FB", tag: "New" },
        { name: "San Jose subdiv", meta: "Emergency · repeat client", tag: "Priority" },
      ],
      settings: [
        { label: "Service area", value: "Montalban · Rodriguez · NCR" },
        { label: "General cleaning", value: "From ₱450 / unit" },
        { label: "Chemical wash", value: "From ₱800 / unit" },
        { label: "Technicians", value: "4 on duty today" },
      ],
    },
  },
};
