window.ADMIN_CONFIG = window.ADMIN_CONFIG || {
  vertical: "appointments",
  businessName: "Taguig City General Hospital",
  ownerRole: "Administrator",
  userInitials: "TC",
  logo: "/assets/logo.jpg",
  painHero:
    "Public hospital walk-ins spike at C6 Road — see pedia, OB, and IM queues without losing the next ticket number.",
  brand: {
    primary: "#00A862",
    primaryDark: "#00473e",
    accent: "#CBA258",
  },
  extraNav: [{ id: "departments", label: "Departments", icon: "◈", hash: "#/departments" }],
  demo: {
    appointments: {
      labels: {
        dashboardTitle: "Taguig General · public OPD",
        dashboardSub: "7 waiting · OB consult called to Room 6",
      },
      stats: [
        { label: "Today", value: "62" },
        { label: "Waiting", value: "7" },
        { label: "Pedia", value: "14" },
        { label: "Completed", value: "28" },
      ],
      queue: {
        waiting: [
          { name: "Reyes family", detail: "Pediatrics · fever", wait: "20 min", ticket: "TC-091" },
          { name: "Maria Santos", detail: "OB prenatal · 32 weeks", wait: "16 min", ticket: "TC-092" },
          { name: "Pedro Lim", detail: "Internal medicine", wait: "12 min", ticket: "TC-093" },
          { name: "Grace Tan", detail: "Cardiology referral", wait: "9 min", ticket: "TC-094" },
          { name: "Carlo Bautista", detail: "Pulmonology consult", wait: "6 min", ticket: "TC-095" },
          { name: "Ana Villanueva", detail: "Lab follow-up", wait: "4 min", ticket: "TC-096" },
          { name: "Luis Garcia", detail: "Surgery intake", wait: "2 min", ticket: "TC-097" },
        ],
        inConsult: [
          { name: "Elena Cruz", detail: "OB prenatal", room: "Room 6", doctor: "Dr. Mendoza" },
        ],
        done: [
          { name: "Mark Villanueva", detail: "Pedia consult", time: "8:40 AM" },
          { name: "Nina Reyes", detail: "IM check-up", time: "9:10 AM" },
        ],
      },
      rooms: [
        { id: "r6", name: "Room 6", doctor: "Dr. Mendoza", status: "busy" },
        { id: "pedia", name: "Pediatrics", doctor: "Dr. Santos", status: "busy" },
        { id: "r3", name: "Room 3", doctor: "Dr. Reyes", status: "available" },
        { id: "lab", name: "Laboratory", doctor: "On duty", status: "available" },
      ],
      primaryList: [
        { id: "TC-8101", name: "Reyes family", detail: "Pediatrics · fever", date: "Today · 10:00 AM", status: "open" },
        { id: "TC-8100", name: "Maria Santos", detail: "OB prenatal · 32 weeks", date: "Today · 10:30 AM", status: "confirmed" },
        { id: "TC-8099", name: "Pedro Lim", detail: "Internal medicine", date: "Today · 11:00 AM", status: "pending" },
        { id: "TC-8098", name: "Grace Tan", detail: "Cardiology referral", date: "Tomorrow · 8:00 AM", status: "confirmed" },
      ],
      people: [
        { name: "Reyes family", meta: "Taguig resident · pedia", tag: "Local" },
        { name: "Maria Santos", meta: "OB · prenatal series", tag: "Regular" },
        { name: "Pedro Lim", meta: "IM walk-in", tag: "Walk-in" },
      ],
      settings: [
        { label: "Hotline", value: "+63 968 377 6440" },
        { label: "Departments", value: "IM · Pedia · OB · Cardio · Pulmo · Surgery" },
        { label: "Lab & radiology", value: "On-site" },
        { label: "Location", value: "506 C6 Road, Taguig" },
      ],
      pages: {
        departments: {
          title: "Public hospital departments",
          items: [
            { name: "Internal / Family Medicine", price: "OPD walk-in" },
            { name: "Pediatrics", price: "Child health" },
            { name: "Obstetrics & Gynecology", price: "Prenatal care" },
            { name: "Cardiology · Pulmonology · Surgery", price: "Specialty referrals" },
          ],
        },
      },
    },
  },
};
