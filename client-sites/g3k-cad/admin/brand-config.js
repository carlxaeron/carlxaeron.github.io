window.ADMIN_CONFIG = window.ADMIN_CONFIG || {
  vertical: "service",
  businessName: "G3k Cad Plotting & Blueprinting Services",
  ownerRole: "Shop Manager",
  userInitials: "GC",
  logo: "/assets/logo.jpg",
  painHero:
    "Rush blueprint jobs and Messenger file sends pile up — track CAD plotting orders from received → printing → ready for pickup.",
  brand: {
    primary: "#2b6cb0",
    primaryDark: "#0a1628",
    accent: "#38bdf8",
  },
  demo: {
    service: {
      labels: {
        dashboardTitle: "Plotting queue · today",
        dashboardSub: "3 rush jobs · 2 large-format prints running",
      },
      stats: [
        { label: "In queue", value: "7" },
        { label: "Rush", value: "3" },
        { label: "Printing", value: "2" },
        { label: "Ready pickup", value: "4" },
      ],
      kanban: {
        new: [
          { id: "GC-102", name: "Architect Reyes", detail: "A1 site plan · 4 sheets", priority: "emergency", date: "Today · 2 hr" },
          { id: "GC-103", name: "Contractor Lim", detail: "Structural dwgs · A0", priority: "emergency", date: "Today · 4 hr" },
        ],
        scheduled: [
          { id: "GC-099", name: "Engineering firm QC", detail: "MEP set · 12 sheets", priority: "normal", date: "Today · PM" },
          { id: "GC-100", name: "Interior designer Tan", detail: "Presentation boards", priority: "normal", date: "Tomorrow" },
        ],
        inProgress: [
          { id: "GC-101", name: "BGC tower project", detail: "Large-format · floor plans", priority: "normal", date: "Printing", tech: "Plotter 1" },
          { id: "GC-097", name: "Marikina residential", detail: "Blueprint set · 8 sheets", priority: "normal", date: "Printing", tech: "Plotter 2" },
        ],
        done: [
          { id: "GC-096", name: "Pasig renovation", detail: "As-built dwgs", priority: "low", date: "Ready 9:30 AM" },
          { id: "GC-095", name: "Antipolo house plan", detail: "A3 color plot", priority: "normal", date: "Ready 8:45 AM" },
        ],
      },
      primaryList: [
        { id: "GC-102", name: "Architect Reyes", detail: "Rush · A1 site plan", date: "Today · 2 hr", status: "open" },
        { id: "GC-101", name: "BGC tower project", detail: "Large-format printing", date: "Today", status: "open" },
        { id: "GC-100", name: "Interior designer Tan", detail: "Presentation boards", date: "Tomorrow", status: "pending" },
        { id: "GC-099", name: "Engineering firm QC", detail: "MEP · 12 sheets", date: "Today · PM", status: "confirmed" },
      ],
      people: [
        { name: "Architect Reyes", meta: "Rush client · repeat", tag: "Priority" },
        { name: "BGC tower project", meta: "Large-format account", tag: "Account" },
        { name: "Engineering firm QC", meta: "Weekly batch orders", tag: "Contract" },
      ],
      settings: [
        { label: "Hotline", value: "+63 928 353 4491" },
        { label: "Services", value: "CAD plotting · Blueprint printing" },
        { label: "Rush turnaround", value: "2–4 hours" },
        { label: "Formats", value: "A0 · A1 · A3 · large-format" },
      ],
    },
  },
};
