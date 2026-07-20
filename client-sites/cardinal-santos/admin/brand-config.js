window.ADMIN_CONFIG = window.ADMIN_CONFIG || {
  vertical: "appointments",
  businessName: "Cardinal Santos Medical Center",
  ownerRole: "Administrator",
  userInitials: "CS",
  logo: "/assets/logo.png",
  painHero:
    "Cardiology, Cancer Center, and OPD share one Greenhills front desk — see which institute is backed up before patients stack in the lobby.",
  brand: {
    primary: "#c41e3a",
    primaryDark: "#1a0f10",
    accent: "#c9a84c",
  },
  extraNav: [{ id: "institutes", label: "Institutes", icon: "◈", hash: "#/institutes" }],
  demo: {
    appointments: {
      labels: {
        dashboardTitle: "OPD & institutes board",
        dashboardSub: "8 waiting · cardio consult in CV Institute",
      },
      stats: [
        { label: "Today", value: "64" },
        { label: "Waiting", value: "8" },
        { label: "Institutes", value: "6" },
        { label: "Check-ups", value: "12" },
      ],
      queue: {
        waiting: [
          { name: "Elena Vargas", detail: "Cardiovascular Institute · follow-up", wait: "22 min", ticket: "CS-118" },
          { name: "Ramon Dela Cruz", detail: "Brain & Spine · MRI review", wait: "18 min", ticket: "CS-119" },
          { name: "Sofia Mendoza", detail: "Cancer Center · oncology consult", wait: "14 min", ticket: "CS-120" },
          { name: "James Tan", detail: "GI Endoscopy · prep check", wait: "9 min", ticket: "CS-121" },
          { name: "Ana Reyes", detail: "Sports Medicine · PT intake", wait: "6 min", ticket: "CS-122" },
          { name: "Luis Garcia", detail: "Rehab Medicine · session", wait: "4 min", ticket: "CS-123" },
          { name: "Grace Lim", detail: "Executive check-up", wait: "3 min", ticket: "CS-124" },
          { name: "Mark Villanueva", detail: "Maternity package · OB", wait: "1 min", ticket: "CS-125" },
        ],
        inConsult: [
          { name: "Patricia Ong", detail: "Cardio consult", room: "CV Institute 2", doctor: "Dr. Buenafe" },
        ],
        done: [
          { name: "Carlo Bautista", detail: "Lab results pickup", time: "8:20 AM" },
          { name: "Nina Santos", detail: "Endoscopy clearance", time: "8:55 AM" },
          { name: "Pedro Lim", detail: "Rehab discharge note", time: "9:15 AM" },
        ],
      },
      rooms: [
        { id: "cv2", name: "CV Institute 2", doctor: "Dr. Buenafe", status: "busy" },
        { id: "bs1", name: "Brain & Spine 1", doctor: "Dr. Reyes", status: "busy" },
        { id: "onc", name: "Cancer Center", doctor: "Dr. Lim", status: "available" },
        { id: "gi", name: "GI Endoscopy", doctor: "Dr. Alvarez", status: "available" },
        { id: "rehab", name: "Rehab 1", doctor: "PT Santos", status: "available" },
      ],
      primaryList: [
        { id: "CS-5104", name: "Elena Vargas", detail: "Cardiovascular follow-up", date: "Today · 10:00 AM", status: "open" },
        { id: "CS-5103", name: "Ramon Dela Cruz", detail: "Brain & Spine · MRI review", date: "Today · 10:30 AM", status: "pending" },
        { id: "CS-5102", name: "Sofia Mendoza", detail: "Oncology consult", date: "Today · 11:00 AM", status: "confirmed" },
        { id: "CS-5101", name: "Grace Lim", detail: "Executive check-up", date: "Tomorrow · 8:00 AM", status: "confirmed" },
        { id: "CS-5100", name: "Ana Reyes", detail: "Sports Medicine PT", date: "Tomorrow · 9:30 AM", status: "confirmed" },
      ],
      people: [
        { name: "Elena Vargas", meta: "Cardio · HMO accredited", tag: "Follow-up" },
        { name: "Sofia Mendoza", meta: "Cancer Center · new", tag: "New" },
        { name: "Grace Lim", meta: "Executive check-up package", tag: "Package" },
        { name: "Ramon Dela Cruz", meta: "Brain & Spine · MRI", tag: "Imaging" },
      ],
      settings: [
        { label: "Trunkline", value: "(02) 8727-0001" },
        { label: "Hours", value: "Always open (ER / hospital)" },
        { label: "Campus", value: "Greenhills West, San Juan" },
        { label: "Flagship", value: "Cardio · Brain & Spine · Cancer · GI · Sports · Rehab" },
      ],
      pages: {
        institutes: {
          title: "Centers of Excellence",
          items: [
            { name: "Cardiovascular Institute", price: "Center of Excellence" },
            { name: "Brain and Spine Institute", price: "Center of Excellence" },
            { name: "Cancer Center", price: "Center of Excellence" },
            { name: "GI Endoscopy Center", price: "Prof. Sol Z. Alvarez" },
            { name: "Sports Medicine Institute", price: "Center of Excellence" },
            { name: "Rehabilitation Medicine", price: "Center of Excellence" },
          ],
        },
      },
    },
  },
};
