window.ADMIN_CONFIG = window.ADMIN_CONFIG || {
  vertical: "appointments",
  businessName: "Amora Body Wellness Spa",
  ownerRole: "Spa Manager",
  userInitials: "AB",
  logo: "/assets/logo.jpg",
  painHero:
    "Massage slots booked via Messenger and walk-ins overlap — see today's appointments, therapists, and package requests in one calendar.",
  brand: {
    primary: "#c9a87c",
    primaryDark: "#2d4a3e",
    accent: "#b8965a",
  },
  extraNav: [{ id: "packages", label: "Packages", icon: "◈", hash: "#/packages" }],
  demo: {
    appointments: {
      labels: {
        primary: "Appointments",
        people: "Clients",
        dashboardTitle: "Spa schedule · today",
        dashboardSub: "3 waiting lounge · couples massage in Room 2",
      },
      stats: [
        { label: "Today", value: "14" },
        { label: "Waiting", value: "3" },
        { label: "In session", value: "4" },
        { label: "Packages sold", value: "2" },
      ],
      queue: {
        waiting: [
          { name: "Ana Villanueva", detail: "Swedish massage · 90 min", wait: "8 min", ticket: "AM-021" },
          { name: "Reyes couple", detail: "Couples package · organic oil", wait: "5 min", ticket: "AM-022" },
          { name: "Grace Tan", detail: "Body scrub + nails add-on", wait: "2 min", ticket: "AM-023" },
        ],
        inConsult: [
          { name: "Maria Santos", detail: "Deep tissue · therapist Liza", room: "Room 2", doctor: "Liza · RMT" },
          { name: "Pedro & Elena", detail: "Couples wellness", room: "Suite 1", doctor: "Team A" },
        ],
        done: [
          { name: "Carlo Bautista", detail: "Hot stone massage", time: "9:00 AM" },
          { name: "Lim family", detail: "Group spa · 4 pax", time: "9:45 AM" },
        ],
      },
      rooms: [
        { id: "r1", name: "Room 1", doctor: "Therapist Ana", status: "available" },
        { id: "r2", name: "Room 2", doctor: "Liza · RMT", status: "busy" },
        { id: "suite1", name: "Suite 1", doctor: "Couples team", status: "busy" },
        { id: "nails", name: "Nails station", doctor: "On duty", status: "available" },
      ],
      primaryList: [
        { id: "AM-1201", name: "Ana Villanueva", detail: "Swedish · 90 min", date: "Today · 11:00 AM", status: "confirmed" },
        { id: "AM-1200", name: "Reyes couple", detail: "Couples organic package", date: "Today · 11:30 AM", status: "pending" },
        { id: "AM-1199", name: "Grace Tan", detail: "Body scrub + nails", date: "Today · 1:00 PM", status: "confirmed" },
        { id: "AM-1198", name: "Lim family", detail: "Group visit · gift certificate", date: "Sat · 2:00 PM", status: "pending" },
      ],
      people: [
        { name: "Ana Villanueva", meta: "3 visits · Swedish regular", tag: "VIP" },
        { name: "Reyes couple", meta: "Messenger booking", tag: "New" },
        { name: "Lim family", detail: "Group · gift cert inquiry", tag: "Hot" },
      ],
      settings: [
        { label: "Spa hours", value: "Daily · 10 AM – 9 PM" },
        { label: "Swedish massage", value: "From ₱899 / 60 min" },
        { label: "Couples package", value: "Organic oil · quote" },
        { label: "Booking", value: "Online · Messenger · walk-in" },
      ],
      pages: {
        packages: {
          title: "Spa packages",
          items: [
            { name: "Swedish massage · 60 min", price: "From ₱899" },
            { name: "Deep tissue · 90 min", price: "From ₱1,299" },
            { name: "Couples organic package", price: "Quote on request" },
            { name: "Body scrub + nails add-on", price: "Bundle pricing" },
          ],
        },
      },
    },
  },
};
