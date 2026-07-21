window.ADMIN_CONFIG = window.ADMIN_CONFIG || {
  vertical: "booking",
  businessName: "CJ Gomez Private Resort",
  ownerRole: "Owner",
  userInitials: "CJ",
  logo: "/assets/logo.jpg",
  painHero:
    "Special-occasion bookings for big groups pile up on Messenger — see which dates are open and confirm parties without double-booking.",
  brand: {
    primary: "#2d6a4f",
    primaryDark: "#1a3d32",
    accent: "#e8b84a",
  },
  demo: {
    booking: {
      labels: {
        dashboardTitle: "Venue bookings today",
        dashboardSub: "Special occasions · groups up to ~100 pax",
      },
      stats: [
        { label: "Check-ins today", value: "4" },
        { label: "Occupancy", value: "86%" },
        { label: "Pending", value: "3" },
        { label: "This week", value: "11" },
      ],
      occupancy: { weekend: 94, weekday: 58, pending: 3, weekendLabel: "Fri–Sun" },
      timeline: [
        { time: "8:00 AM", title: "Magat party", detail: "Birthday venue · ~80 pax", status: "confirmed" },
        { time: "9:30 AM", title: "Santos family", detail: "Day staycation · pavilion", status: "confirmed" },
        { time: "11:00 AM", title: "Rodriguez barkada", detail: "Overnight inquiry · 25 pax", status: "pending" },
        { time: "1:00 PM", title: "Cruz reunion", detail: "Garden + event hall", status: "confirmed" },
        { time: "3:00 PM", title: "Office outing", detail: "Team building · 60 pax", status: "pending" },
      ],
      pendingRequests: [
        {
          id: "CJ-214",
          name: "Pinky Magat",
          detail: "Venue rate · 100 pax",
          date: "Sat · 8:00 AM",
          source: "Facebook",
          amount: "Quote",
        },
        {
          id: "CJ-213",
          name: "Rodriguez barkada",
          detail: "Overnight · 25 pax",
          date: "Fri · 2:00 PM",
          source: "Messenger",
          amount: "₱18,500",
        },
        {
          id: "CJ-211",
          name: "Office outing",
          detail: "Team building · 60 pax",
          date: "Sun · 7:00 AM",
          source: "SMS",
          amount: "₱22,000",
        },
      ],
      primaryList: [
        { id: "CJ-216", name: "Santos family", detail: "Day staycation · pavilion", date: "Today · 9:30 AM", status: "confirmed" },
        { id: "CJ-215", name: "Magat party", detail: "Birthday venue · ~80 pax", date: "Today · 8:00 AM", status: "confirmed" },
        { id: "CJ-214", name: "Pinky Magat", detail: "Venue · 100 pax inquiry", date: "Sat · 8:00 AM", status: "pending" },
        { id: "CJ-213", name: "Rodriguez barkada", detail: "Overnight · 25 pax", date: "Fri · 2:00 PM", status: "pending" },
        { id: "CJ-212", name: "Cruz reunion", detail: "Garden + event hall", date: "Sun · 10:00 AM", status: "confirmed" },
      ],
      calendarEvents: [2, 5, 7, 9, 12, 14, 16, 19, 22, 26],
      people: [
        { name: "Santos family", meta: "3 visits · Pavilion regulars", tag: "VIP" },
        { name: "Magat party", meta: "Birthday · Large group", tag: "Event" },
        { name: "Pinky Magat", meta: "FB inquiry · 100 pax", tag: "New" },
        { name: "Office outing", meta: "Corporate · 60 pax", tag: "Corporate" },
      ],
      settings: [
        { label: "Day venue (small group)", value: "Quote on request" },
        { label: "Large occasion (~100 pax)", value: "Quote on request" },
        { label: "Overnight / staycation", value: "By package" },
        { label: "Contact", value: "0919 358 8505" },
      ],
    },
  },
};
