window.ADMIN_CONFIG = window.ADMIN_CONFIG || {
  vertical: "appointments",
  businessName: "San Mateo Medical Center",
  ownerRole: "Administrator",
  userInitials: "SM",
  logo: "/assets/logo.jpg",
  painHero:
    "Phone calls and walk-ins overlap at Gen. Luna — track specialty consults and waiting patients without another paper logbook.",
  brand: {
    primary: "#3b82f6",
    primaryDark: "#0c2340",
    accent: "#c9a227",
  },
  extraNav: [{ id: "departments", label: "Departments", icon: "◈", hash: "#/departments" }],
  demo: {
    appointments: {
      labels: {
        dashboardTitle: "Private hospital · OPD board",
        dashboardSub: "3 waiting · cardiology consult in Room 4",
      },
      stats: [
        { label: "Today", value: "26" },
        { label: "Waiting", value: "3" },
        { label: "Completed", value: "14" },
        { label: "Specialty", value: "8" },
      ],
      queue: {
        waiting: [
          { name: "Ana Villanueva", detail: "Cardiology follow-up", wait: "11 min", ticket: "SM-038" },
          { name: "Juan Dela Cruz", detail: "General consult · always open", wait: "7 min", ticket: "SM-039" },
          { name: "Reyes family", detail: "Pediatric check-up", wait: "4 min", ticket: "SM-040" },
        ],
        inConsult: [
          { name: "Carlo Bautista", detail: "Internal medicine", room: "Room 4", doctor: "Dr. Mendoza" },
          { name: "Elena Cruz", detail: "Post-op follow-up", room: "Room 1", doctor: "Dr. Reyes" },
        ],
        done: [
          { name: "Grace Tan", detail: "Lab work-up", time: "8:50 AM" },
          { name: "Pedro Lim", detail: "Affordable care consult", time: "9:20 AM" },
        ],
      },
      rooms: [
        { id: "r1", name: "Room 1", doctor: "Dr. Reyes", status: "busy" },
        { id: "r4", name: "Room 4", doctor: "Dr. Mendoza", status: "busy" },
        { id: "r2", name: "Room 2", doctor: "Dr. Santos", status: "available" },
        { id: "lab", name: "Diagnostics", doctor: "On duty", status: "available" },
      ],
      primaryList: [
        { id: "SM-3301", name: "Ana Villanueva", detail: "Cardiology follow-up", date: "Today · 10:00 AM", status: "open" },
        { id: "SM-3300", name: "Reyes family", detail: "Pediatric check-up", date: "Today · 10:30 AM", status: "pending" },
        { id: "SM-3299", name: "Juan Dela Cruz", detail: "General consult", date: "Today · 11:00 AM", status: "confirmed" },
        { id: "SM-3298", name: "Corporate health panel", detail: "Executive screening · 12 pax", date: "Tomorrow · 8:00 AM", status: "confirmed" },
      ],
      people: [
        { name: "Ana Villanueva", meta: "Cardiology · HMO", tag: "Regular" },
        { name: "Reyes family", meta: "Pediatric · San Mateo resident", tag: "Local" },
        { name: "Corporate health panel", meta: "Annual account", tag: "Corporate" },
      ],
      settings: [
        { label: "Hospital hours", value: "Always open" },
        { label: "Consultation", value: "Efficient & affordable" },
        { label: "Specialties", value: "IM · Pedia · Cardio" },
        { label: "Location", value: "Gen. Luna Ave., Ampid 2" },
      ],
      pages: {
        departments: {
          title: "Specialty services",
          items: [
            { name: "Private hospital care", price: "Inpatient & outpatient" },
            { name: "Specialty consultations", price: "By appointment" },
            { name: "Efficient affordable OPD", price: "Walk-in accepted" },
            { name: "Diagnostics & lab", price: "On-site" },
          ],
        },
      },
    },
  },
};
