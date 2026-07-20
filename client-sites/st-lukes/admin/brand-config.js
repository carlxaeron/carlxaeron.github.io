window.ADMIN_CONFIG = window.ADMIN_CONFIG || {
  vertical: "appointments",
  businessName: "St. Luke's Medical Center",
  ownerRole: "OPD Administrator",
  userInitials: "SL",
  logo: "/assets/logo.png",
  painHero:
    "Specialty clinics across Quezon City and Global City fill fast — see the OPD queue, consult rooms, and who's waiting before the next call stacks up.",
  brand: {
    primary: "#291f84",
    primaryDark: "#1a1254",
    accent: "#c9a227",
  },
  extraNav: [{ id: "institutes", label: "Institutes", icon: "◈", hash: "#/institutes" }],
  demo: {
    appointments: {
      labels: {
        dashboardTitle: "OPD queue · Global City",
        dashboardSub: "6 waiting · Dr. Reyes in Heart Clinic with cardio consult",
      },
      stats: [
        { label: "Today", value: "48" },
        { label: "Waiting", value: "6" },
        { label: "Completed", value: "29" },
        { label: "No-shows", value: "2" },
      ],
      queue: {
        waiting: [
          { name: "Elena Cruz", detail: "Cardiology · follow-up", wait: "18 min", ticket: "GC-112" },
          { name: "Marco Villanueva", detail: "Oncology · TrueBeam consult", wait: "14 min", ticket: "GC-113" },
          { name: "Ana Dela Rosa", detail: "OB · prenatal NIPT", wait: "9 min", ticket: "GC-114" },
          { name: "James Tan", detail: "Orthopedics · joint review", wait: "6 min", ticket: "QC-221" },
          { name: "Sofia Lim", detail: "Eye Institute · cataract", wait: "4 min", ticket: "QC-222" },
          { name: "Paolo Santos", detail: "Internal medicine", wait: "2 min", ticket: "GC-115" },
        ],
        inConsult: [
          { name: "Rosa Mendoza", detail: "Heart Institute · cardio", room: "Heart Clinic 2", doctor: "Dr. Reyes" },
        ],
        done: [
          { name: "Carlo Bautista", detail: "Lab results review", time: "8:20 AM" },
          { name: "Grace Uy", detail: "Dermatology · Mohs follow-up", time: "8:55 AM" },
          { name: "Mark Villanueva", detail: "Executive check-up", time: "9:30 AM" },
        ],
      },
      rooms: [
        { id: "h1", name: "Heart Clinic 1", doctor: "Dr. Santos", status: "available" },
        { id: "h2", name: "Heart Clinic 2", doctor: "Dr. Reyes", status: "busy" },
        { id: "on", name: "Cancer Institute", doctor: "Dr. Lim", status: "busy" },
        { id: "ob", name: "OB Clinic", doctor: "Dr. Garcia", status: "available" },
      ],
      primaryList: [
        { id: "SL-8801", name: "Elena Cruz", detail: "Cardiology follow-up", date: "Today · 10:00 AM", status: "open" },
        { id: "SL-8800", name: "Marco Villanueva", detail: "Oncology · TrueBeam", date: "Today · 10:30 AM", status: "pending" },
        { id: "SL-8799", name: "Ana Dela Rosa", detail: "Prenatal · NIPT", date: "Today · 11:00 AM", status: "confirmed" },
        { id: "SL-8798", name: "James Tan", detail: "Ortho · joint review", date: "Tomorrow · 8:30 AM", status: "confirmed" },
      ],
      people: [
        { name: "Elena Cruz", meta: "HMO · Heart Institute regular", tag: "Regular" },
        { name: "Marco Villanueva", meta: "Cancer Institute · TrueBeam", tag: "Follow-up" },
        { name: "Ana Dela Rosa", meta: "First visit · FB inquiry", tag: "New" },
      ],
      settings: [
        { label: "Global City", value: "(02) 8789 7700" },
        { label: "Quezon City", value: "(02) 8723 0101" },
        { label: "Product info", value: "productinfo@stlukes.com.ph" },
        { label: "Campuses", value: "QC · Global City · Extension Clinic" },
      ],
      pages: {
        institutes: {
          title: "Institutes & specialty clinics",
          items: [
            { name: "Heart Institute", price: "Cardiology · TAVR · STEMI" },
            { name: "Cancer Institute", price: "TrueBeam · oncology pathways" },
            { name: "Institute of Surgery", price: "Robotic & minimally invasive" },
            { name: "Eye Institute", price: "Comprehensive ophthalmology" },
            { name: "CARMI (IVF)", price: "Hospital-based fertility unit" },
            { name: "Emergency & BAT", price: "Stroke & cardiac pathways" },
          ],
        },
      },
    },
  },
};
