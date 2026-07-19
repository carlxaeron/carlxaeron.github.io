window.ADMIN_CONFIG = window.ADMIN_CONFIG || {
  vertical: "appointments",
  businessName: "Pacific Global Medical Center",
  ownerRole: "Administrator",
  userInitials: "PG",
  logo: "/assets/logo.jpg",
  painHero:
    "ER, pulmonology, and outpatient lines blur together on Mindanao Ave — know who's waiting and which rooms are free.",
  brand: {
    primary: "#2f80ed",
    primaryDark: "#0a2540",
    accent: "#eef5fb",
  },
  extraNav: [{ id: "departments", label: "Departments", icon: "◈", hash: "#/departments" }],
  demo: {
    appointments: {
      labels: {
        dashboardTitle: "Pacific Global · today's flow",
        dashboardSub: "4 waiting · pulmonology in Room 5",
      },
      stats: [
        { label: "Today", value: "34" },
        { label: "Waiting", value: "4" },
        { label: "ER triage", value: "6" },
        { label: "Completed", value: "18" },
      ],
      queue: {
        waiting: [
          { name: "Pedro Lim", detail: "Pulmonology · cough follow-up", wait: "13 min", ticket: "PG-061" },
          { name: "Maria Reyes", detail: "Immunization · adult", wait: "10 min", ticket: "PG-062" },
          { name: "Carlo Bautista", detail: "Heart wellness screening", wait: "6 min", ticket: "PG-063" },
          { name: "Grace Tan", detail: "Preventive care consult", wait: "3 min", ticket: "PG-064" },
        ],
        inConsult: [
          { name: "Rosa Mendoza", detail: "Pulmonology consult", room: "Room 5", doctor: "Dr. Mendoza" },
        ],
        done: [
          { name: "Elena Cruz", detail: "Diagnostics review", time: "8:45 AM" },
          { name: "Mark Villanueva", detail: "Immunization", time: "9:15 AM" },
        ],
      },
      rooms: [
        { id: "er", name: "ER Bay", doctor: "On duty", status: "busy" },
        { id: "r5", name: "Room 5", doctor: "Dr. Mendoza", status: "busy" },
        { id: "r2", name: "Room 2", doctor: "Dr. Santos", status: "available" },
        { id: "lab", name: "Diagnostics", doctor: "Lab team", status: "available" },
      ],
      primaryList: [
        { id: "PG-5101", name: "Pedro Lim", detail: "Pulmonology follow-up", date: "Today · 10:00 AM", status: "open" },
        { id: "PG-5100", name: "Maria Reyes", detail: "Immunization", date: "Today · 10:30 AM", status: "confirmed" },
        { id: "PG-5099", name: "Carlo Bautista", detail: "Heart wellness", date: "Today · 11:00 AM", status: "pending" },
        { id: "PG-5098", name: "Corporate panel", detail: "Executive health · 15 pax", date: "Tomorrow · 7:30 AM", status: "confirmed" },
      ],
      people: [
        { name: "Pedro Lim", meta: "Pulmonology · repeat", tag: "Regular" },
        { name: "Maria Reyes", meta: "Preventive care", tag: "Wellness" },
        { name: "Corporate panel", meta: "Annual screening", tag: "Corporate" },
      ],
      settings: [
        { label: "Trunkline", value: "(02) 8248-7400" },
        { label: "Emergency", value: "24/7 ER" },
        { label: "Specialties", value: "Pulmo · Immunization · Cardio" },
        { label: "Location", value: "Lot 2B Mindanao Ave., QC" },
      ],
      pages: {
        departments: {
          title: "Centers & services",
          items: [
            { name: "Emergency Room", price: "24/7 triage" },
            { name: "Pulmonology & diagnostics", price: "Consult & imaging" },
            { name: "Immunization & preventive", price: "Walk-in & scheduled" },
            { name: "Heart & wellness guidance", price: "Screening packages" },
          ],
        },
      },
    },
  },
};
