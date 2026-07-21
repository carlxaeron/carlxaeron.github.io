window.ADMIN_CONFIG = window.ADMIN_CONFIG || {
  vertical: "booking",
  businessName: "Sky Glass",
  ownerRole: "Owner",
  userInitials: "SG",
  logo: "/assets/logo.jpg",
  painHero:
    "Indoor-pool day bookings and night staycations stack up on Messenger — see which slots are open without double-booking the glass house.",
  brand: {
    primary: "#1a3a52",
    primaryDark: "#0d2438",
    accent: "#e8a838",
  },
  demo: {
    booking: {
      labels: {
        dashboardTitle: "Pool bookings today",
        dashboardSub: "Indoor pool · night staycations · Congressville",
      },
      stats: [
        { label: "Check-ins today", value: "5" },
        { label: "Occupancy", value: "82%" },
        { label: "Pending", value: "4" },
        { label: "This week", value: "14" },
      ],
      occupancy: { weekend: 96, weekday: 64, pending: 4, weekendLabel: "Fri–Sun" },
      timeline: [
        { time: "8:00 AM", title: "Reyes barkada", detail: "Indoor pool day · 18 pax", status: "confirmed" },
        { time: "10:00 AM", title: "Santos family", detail: "Half-day swim · kids party", status: "confirmed" },
        { time: "12:00 PM", title: "Office outing", detail: "Team hangout · 30 pax", status: "pending" },
        { time: "2:00 PM", title: "Cruz staycation", detail: "Overnight · glass house", status: "confirmed" },
        { time: "5:00 PM", title: "Birthday night", detail: "Evening pool · 25 pax", status: "pending" },
      ],
      pendingRequests: [
        {
          id: "SG-318",
          name: "Office outing",
          detail: "Team hangout · 30 pax",
          date: "Sat · 10:00 AM",
          source: "Messenger",
          amount: "₱12,500",
        },
        {
          id: "SG-317",
          name: "Birthday night",
          detail: "Evening indoor pool · 25 pax",
          date: "Fri · 5:00 PM",
          source: "Facebook",
          amount: "₱15,000",
        },
        {
          id: "SG-315",
          name: "Manggahan barkada",
          detail: "Overnight staycation · 12 pax",
          date: "Sun · 2:00 PM",
          source: "SMS",
          amount: "₱18,000",
        },
      ],
      primaryList: [
        { id: "SG-320", name: "Reyes barkada", detail: "Indoor pool day · 18 pax", date: "Today · 8:00 AM", status: "confirmed" },
        { id: "SG-319", name: "Santos family", detail: "Half-day · kids party", date: "Today · 10:00 AM", status: "confirmed" },
        { id: "SG-318", name: "Office outing", detail: "Team hangout · 30 pax", date: "Sat · 10:00 AM", status: "pending" },
        { id: "SG-317", name: "Birthday night", detail: "Evening pool · 25 pax", date: "Fri · 5:00 PM", status: "pending" },
        { id: "SG-316", name: "Cruz staycation", detail: "Overnight · glass house", date: "Today · 2:00 PM", status: "confirmed" },
      ],
      calendarEvents: [1, 4, 6, 8, 11, 13, 15, 18, 21, 25, 28],
      people: [
        { name: "Reyes barkada", meta: "4 visits · Indoor pool regulars", tag: "VIP" },
        { name: "Santos family", meta: "Kids parties · Day swim", tag: "Repeat" },
        { name: "Office outing", meta: "FB inquiry · 30 pax", tag: "New" },
        { name: "Cruz staycation", meta: "Overnight · Glass house", tag: "Staycation" },
      ],
      settings: [
        { label: "Indoor pool day (weekday)", value: "Quote on request" },
        { label: "Indoor pool day (weekend)", value: "Quote on request" },
        { label: "Overnight / staycation", value: "By package" },
        { label: "Contact", value: "0927 578 8947" },
      ],
    },
  },
};
