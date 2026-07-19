window.ADMIN_CONFIG = window.ADMIN_CONFIG || {
  vertical: "appointments",
  businessName: "H Vill Hospital",
  ownerRole: "Administrator",
  userInitials: "HV",
  logo: "/assets/logo.jpg",
  painHero:
    "Walk-ins and follow-ups stack at the Montalban front desk — see the OPD queue, room status, and who's waiting before the next patient asks.",
  brand: {
    primary: "#14b8a6",
    primaryDark: "#083344",
    accent: "#b45309",
  },
  extraNav: [{ id: "departments", label: "Departments", icon: "◈", hash: "#/departments" }],
  demo: {
    appointments: {
      labels: {
        dashboardTitle: "OPD queue · Rodriguez",
        dashboardSub: "4 waiting · Dr. Santos in Room 2 with prenatal consult",
      },
      stats: [
        { label: "Today", value: "22" },
        { label: "Waiting", value: "4" },
        { label: "Completed", value: "11" },
        { label: "No-shows", value: "1" },
      ],
      queue: {
        waiting: [
          { name: "Maria Reyes", detail: "Prenatal check-up · 28 weeks", wait: "14 min", ticket: "HV-041" },
          { name: "Pedro Lim", detail: "Ultrasound follow-up", wait: "9 min", ticket: "HV-042" },
          { name: "Grace Tan", detail: "Pap smear screening", wait: "6 min", ticket: "HV-043" },
          { name: "Luis Garcia", detail: "PhilHealth consult", wait: "3 min", ticket: "HV-044" },
        ],
        inConsult: [
          { name: "Rosa Mendoza", detail: "OB-GYN · prenatal", room: "Room 2", doctor: "Dr. Santos" },
        ],
        done: [
          { name: "Carlo Bautista", detail: "Lab results review", time: "8:40 AM" },
          { name: "Elena Cruz", detail: "Postpartum check", time: "9:05 AM" },
          { name: "Mark Villanueva", detail: "General consult", time: "9:30 AM" },
        ],
      },
      rooms: [
        { id: "r1", name: "Room 1", doctor: "Dr. Reyes", status: "available" },
        { id: "r2", name: "Room 2", doctor: "Dr. Santos", status: "busy" },
        { id: "r3", name: "Room 3", doctor: "Dr. Lim", status: "busy" },
        { id: "us", name: "Ultrasound", doctor: "Tech on duty", status: "available" },
      ],
      primaryList: [
        { id: "HV-2201", name: "Maria Reyes", detail: "Prenatal · 28 weeks", date: "Today · 10:00 AM", status: "open" },
        { id: "HV-2200", name: "Pedro Lim", detail: "Ultrasound follow-up", date: "Today · 10:30 AM", status: "pending" },
        { id: "HV-2199", name: "Grace Tan", detail: "Pap smear", date: "Today · 11:00 AM", status: "confirmed" },
        { id: "HV-2198", name: "Luis Garcia", detail: "PhilHealth consult", date: "Tomorrow · 8:00 AM", status: "confirmed" },
      ],
      people: [
        { name: "Maria Reyes", meta: "HMO · Repeat prenatal", tag: "Regular" },
        { name: "Pedro Lim", meta: "Ultrasound follow-up", tag: "Follow-up" },
        { name: "Grace Tan", meta: "First visit · FB inquiry", tag: "New" },
      ],
      settings: [
        { label: "Clinic hours", value: "Mon–Sat · 8 AM – 6 PM" },
        { label: "Consultation fee", value: "From ₱500" },
        { label: "PhilHealth", value: "Accredited" },
        { label: "Departments", value: "OB-GYN · Ultrasound · Lab" },
      ],
      pages: {
        departments: {
          title: "Departments & services",
          items: [
            { name: "OB-GYN & prenatal care", price: "Consult · PhilHealth accepted" },
            { name: "Ultrasound imaging", price: "By appointment" },
            { name: "Pap smear screening", price: "Walk-in & scheduled" },
            { name: "General outpatient", price: "Community hospital rates" },
          ],
        },
      },
    },
  },
};
