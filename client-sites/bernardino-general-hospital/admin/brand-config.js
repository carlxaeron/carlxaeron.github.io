window.ADMIN_CONFIG = window.ADMIN_CONFIG || {
  vertical: "appointments",
  businessName: "Bernardino General Hospital",
  ownerRole: "Administrator",
  userInitials: "BG",
  logo: "/assets/logo.jpg",
  painHero:
    "Rehab, imaging, and OPD share one reception on Quirino Highway — see queue status and department load before patients stack up.",
  brand: {
    primary: "#1fa87c",
    primaryDark: "#0c2b26",
    accent: "#d97706",
  },
  extraNav: [{ id: "departments", label: "Departments", icon: "◈", hash: "#/departments" }],
  demo: {
    appointments: {
      labels: {
        dashboardTitle: "OPD & rehab board",
        dashboardSub: "5 waiting · ortho consult in Room 3",
      },
      stats: [
        { label: "Today", value: "31" },
        { label: "Waiting", value: "5" },
        { label: "Rehab sessions", value: "7" },
        { label: "Imaging", value: "4" },
      ],
      queue: {
        waiting: [
          { name: "Mark Villanueva", detail: "Orthopedic follow-up", wait: "16 min", ticket: "BG-052" },
          { name: "Nina Reyes", detail: "Ultrasound · abdominal", wait: "12 min", ticket: "BG-053" },
          { name: "Luis Garcia", detail: "Neuro rehab intake", wait: "8 min", ticket: "BG-054" },
          { name: "Grace Tan", detail: "Pediatric therapy consult", wait: "5 min", ticket: "BG-055" },
          { name: "Pedro Lim", detail: "Geriatric assessment", wait: "2 min", ticket: "BG-056" },
        ],
        inConsult: [
          { name: "Rosa Mendoza", detail: "Musculoskeletal rehab", room: "Rehab 1", doctor: "PT Santos" },
        ],
        done: [
          { name: "Carlo Bautista", detail: "Post-op rehab eval", time: "8:35 AM" },
          { name: "Elena Cruz", detail: "Imaging results", time: "9:00 AM" },
        ],
      },
      rooms: [
        { id: "r3", name: "Room 3", doctor: "Dr. Lim", status: "busy" },
        { id: "rehab1", name: "Rehab 1", doctor: "PT Santos", status: "busy" },
        { id: "us", name: "Ultrasound", doctor: "Tech on duty", status: "available" },
        { id: "r1", name: "Room 1", doctor: "Dr. Reyes", status: "available" },
      ],
      primaryList: [
        { id: "BG-4101", name: "Mark Villanueva", detail: "Orthopedic follow-up", date: "Today · 10:00 AM", status: "open" },
        { id: "BG-4100", name: "Nina Reyes", detail: "Ultrasound · abdominal", date: "Today · 10:30 AM", status: "pending" },
        { id: "BG-4099", name: "Luis Garcia", detail: "Neuro rehab intake", date: "Today · 11:00 AM", status: "confirmed" },
        { id: "BG-4098", name: "Grace Tan", detail: "Pediatric therapy", date: "Tomorrow · 9:00 AM", status: "confirmed" },
      ],
      people: [
        { name: "Mark Villanueva", meta: "Ortho · post-injury", tag: "Rehab" },
        { name: "Nina Reyes", meta: "Imaging referral", tag: "Diagnostics" },
        { name: "Luis Garcia", meta: "Neuro rehab · new", tag: "New" },
      ],
      settings: [
        { label: "Hospital hours", value: "24/7 emergency" },
        { label: "Imaging", value: "Ultrasound on-site" },
        { label: "Rehab", value: "Ortho · Neuro · Pedia · Geriatric" },
        { label: "Address", value: "680 Quirino Highway, QC" },
      ],
      pages: {
        departments: {
          title: "Clinical departments",
          items: [
            { name: "General hospital care", price: "Emergency & inpatient" },
            { name: "Ultrasound & imaging", price: "Scheduled & walk-in" },
            { name: "Orthopedic rehab", price: "Musculoskeletal therapy" },
            { name: "Neurological & post-op rehab", price: "Specialized programs" },
          ],
        },
      },
    },
  },
};
