window.ADMIN_CONFIG = window.ADMIN_CONFIG || {
  vertical: "appointments",
  businessName: "Novaliches General Hospital and Medical Center (NovaGen)",
  ownerRole: "Administrator",
  userInitials: "NG",
  logo: "/assets/logo.jpg",
  painHero:
    "CT scan, hemodialysis, and eye center bookings scattered on phone calls — run the OPD board so admissions sees the full queue.",
  brand: {
    primary: "#16a06a",
    primaryDark: "#06332c",
    accent: "#c9973f",
  },
  extraNav: [{ id: "departments", label: "Departments", icon: "◈", hash: "#/departments" }],
  demo: {
    appointments: {
      labels: {
        dashboardTitle: "NovaGen · tertiary OPD",
        dashboardSub: "6 waiting · CT prep in Diagnostics",
      },
      stats: [
        { label: "Today", value: "48" },
        { label: "Waiting", value: "6" },
        { label: "Imaging", value: "9" },
        { label: "Dialysis", value: "12 slots" },
      ],
      queue: {
        waiting: [
          { name: "Ana Villanueva", detail: "CT scan · cranial", wait: "18 min", ticket: "NG-071" },
          { name: "Pedro Lim", detail: "2D Echo appointment", wait: "14 min", ticket: "NG-072" },
          { name: "Maria Reyes", detail: "Mammography screening", wait: "11 min", ticket: "NG-073" },
          { name: "Carlo Bautista", detail: "Endoscopy prep consult", wait: "8 min", ticket: "NG-074" },
          { name: "Grace Tan", detail: "Eye Center · follow-up", wait: "5 min", ticket: "NG-075" },
          { name: "Luis Garcia", detail: "Hemodialysis intake", wait: "2 min", ticket: "NG-076" },
        ],
        inConsult: [
          { name: "Rosa Mendoza", detail: "Digestive endoscopy consult", room: "Room 8", doctor: "Dr. Reyes" },
        ],
        done: [
          { name: "Elena Cruz", detail: "CT scan completed", time: "8:30 AM" },
          { name: "Mark Villanueva", detail: "2D Echo done", time: "9:00 AM" },
        ],
      },
      rooms: [
        { id: "ct", name: "CT Scan", doctor: "Radiology", status: "busy" },
        { id: "r8", name: "Room 8", doctor: "Dr. Reyes", status: "busy" },
        { id: "eye", name: "Eye Center", doctor: "Dr. Lim", status: "available" },
        { id: "hd", name: "Hemodialysis", doctor: "Nephrology", status: "busy" },
      ],
      primaryList: [
        { id: "NG-6101", name: "Ana Villanueva", detail: "CT scan · cranial", date: "Today · 10:00 AM", status: "open" },
        { id: "NG-6100", name: "Pedro Lim", detail: "2D Echo", date: "Today · 10:30 AM", status: "confirmed" },
        { id: "NG-6099", name: "Maria Reyes", detail: "Digital mammography", date: "Today · 11:00 AM", status: "pending" },
        { id: "NG-6098", name: "Grace Tan", detail: "Eye Center consult", date: "Tomorrow · 9:00 AM", status: "confirmed" },
      ],
      people: [
        { name: "Ana Villanueva", meta: "Imaging · referred", tag: "Diagnostics" },
        { name: "Pedro Lim", meta: "Cardio work-up", tag: "Regular" },
        { name: "Luis Garcia", meta: "Dialysis · new slot", tag: "Nephrology" },
      ],
      settings: [
        { label: "Trunkline", value: "(02) 8426-8888" },
        { label: "Imaging", value: "CT · Echo · Mammography" },
        { label: "Specialty", value: "Eye · Endoscopy · Dialysis" },
        { label: "Location", value: "793 Quirino Highway, QC" },
      ],
      pages: {
        departments: {
          title: "NovaGen facilities",
          items: [
            { name: "CT Scan", price: "Cranial · chest · abdomen" },
            { name: "2D Echo & BP monitoring", price: "Cardiology diagnostics" },
            { name: "Digital mammography", price: "Screening program" },
            { name: "Eye Center & hemodialysis", price: "Specialty appointments" },
          ],
        },
      },
    },
  },
};
