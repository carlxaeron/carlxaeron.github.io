window.ADMIN_CONFIG = window.ADMIN_CONFIG || {
  vertical: "appointments",
  businessName: "Fairview General Hospital Inc.",
  ownerRole: "Administrator",
  userInitials: "FG",
  logo: "/assets/logo.jpg",
  painHero:
    "Emergency, surgical, and outpatient intakes compete for attention — one screen for waiting patients and room assignments on Fairview Ave.",
  brand: {
    primary: "#00a862",
    primaryDark: "#00473e",
    accent: "#cba258",
  },
  extraNav: [{ id: "departments", label: "Departments", icon: "◈", hash: "#/departments" }],
  demo: {
    appointments: {
      labels: {
        dashboardTitle: "Fairview General · OPD",
        dashboardSub: "4 waiting · surgical consult in Room 2",
      },
      stats: [
        { label: "Today", value: "38" },
        { label: "Waiting", value: "4" },
        { label: "Emergency", value: "5" },
        { label: "Completed", value: "20" },
      ],
      queue: {
        waiting: [
          { name: "Juan Dela Cruz", detail: "Outpatient · PhilHealth", wait: "15 min", ticket: "FG-081" },
          { name: "Maria Reyes", detail: "Surgical follow-up", wait: "11 min", ticket: "FG-082" },
          { name: "Pedro Lim", detail: "Diagnostics referral", wait: "7 min", ticket: "FG-083" },
          { name: "Grace Tan", detail: "Circumcision program inquiry", wait: "4 min", ticket: "FG-084" },
        ],
        inConsult: [
          { name: "Rosa Mendoza", detail: "Inpatient discharge review", room: "Room 2", doctor: "Dr. Santos" },
        ],
        done: [
          { name: "Carlo Bautista", detail: "OPD consult", time: "8:55 AM" },
          { name: "Elena Cruz", detail: "Lab results", time: "9:25 AM" },
        ],
      },
      rooms: [
        { id: "er", name: "Emergency", doctor: "On duty", status: "busy" },
        { id: "r2", name: "Room 2", doctor: "Dr. Santos", status: "busy" },
        { id: "r1", name: "Room 1", doctor: "Dr. Reyes", status: "available" },
        { id: "lab", name: "Diagnostics", doctor: "Lab team", status: "available" },
      ],
      primaryList: [
        { id: "FG-7101", name: "Juan Dela Cruz", detail: "PhilHealth OPD", date: "Today · 10:00 AM", status: "open" },
        { id: "FG-7100", name: "Maria Reyes", detail: "Surgical follow-up", date: "Today · 10:30 AM", status: "confirmed" },
        { id: "FG-7099", name: "Grace Tan", detail: "Circumcision program", date: "Today · 11:00 AM", status: "pending" },
        { id: "FG-7098", name: "Pedro Lim", detail: "Diagnostics", date: "Tomorrow · 8:00 AM", status: "confirmed" },
      ],
      people: [
        { name: "Juan Dela Cruz", meta: "PhilHealth · Fairview resident", tag: "Regular" },
        { name: "Maria Reyes", meta: "Post-surgical", tag: "Follow-up" },
        { name: "Grace Tan", meta: "Program inquiry · FB", tag: "New" },
      ],
      settings: [
        { label: "Trunkline", value: "(02) 8939-8764" },
        { label: "PhilHealth", value: "Accredited" },
        { label: "Programs", value: "Surgical · Circumcision" },
        { label: "Location", value: "Mercury St., Fairview QC" },
      ],
      pages: {
        departments: {
          title: "Hospital services",
          items: [
            { name: "Emergency & inpatient", price: "24/7 care" },
            { name: "Outpatient & diagnostics", price: "PhilHealth accepted" },
            { name: "Surgical programs", price: "Scheduled procedures" },
            { name: "Circumcision program", price: "Community health" },
          ],
        },
      },
    },
  },
};
