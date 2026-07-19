window.ADMIN_CONFIG = window.ADMIN_CONFIG || {
  vertical: "booking",
  businessName: "Villa Clara Pool & Venue",
  ownerRole: "Owner",
  userInitials: "VC",
  logo: "../assets/logo.jpg",
  painHero:
    "Stop taking bookings only on Messenger — see the calendar fill in real time and approve day-swim requests from one screen.",
  brand: {
    primary: "#1a6b72",
    primaryDark: "#0a3d42",
    accent: "#2dd4bf",
  },
  extraNav: [{ id: "packages", label: "Packages", icon: "◈", hash: "#/packages" }],
  demo: {
    booking: {
      labels: {
        dashboardTitle: "Weekend is filling fast",
        dashboardSub: "3 requests waiting · 6 check-ins today",
      },
      stats: [
        { label: "Check-ins today", value: "6" },
        { label: "Occupancy", value: "82%" },
        { label: "Pending", value: "3" },
        { label: "This week", value: "19" },
      ],
      occupancy: { weekend: 92, weekday: 58, pending: 3, weekendLabel: "Sat–Sun" },
      timeline: [
        { time: "8:00 AM", title: "Reyes Family", detail: "Birthday package · up to 25 pax", status: "confirmed" },
        { time: "9:00 AM", title: "Torres barkada", detail: "Day swim · 18 guests", status: "confirmed" },
        { time: "11:00 AM", title: "Montalban office outing", detail: "Team building · 30 pax", status: "pending" },
        { time: "1:00 PM", title: "Ana Villanueva", detail: "Half-day rental · 12 guests", status: "confirmed" },
        { time: "3:00 PM", title: "Garcia reunion", detail: "Day swim · 20 guests", status: "pending" },
      ],
      pendingRequests: [
        {
          id: "VC-1040",
          name: "Juan Dela Cruz",
          detail: "Day swim · 15 guests · weekday",
          date: "Tomorrow · 8:00 AM",
          source: "Messenger",
          amount: "₱8,500",
        },
        {
          id: "VC-1039",
          name: "Montalban office outing",
          detail: "Team building · 30 pax",
          date: "Sat · 7:00 AM",
          source: "Facebook",
          amount: "₱16,500",
        },
        {
          id: "VC-1037",
          name: "Garcia reunion",
          detail: "Day swim · 20 guests",
          date: "Sun · 9:00 AM",
          source: "SMS",
          amount: "₱10,500",
        },
      ],
      primaryList: [
        { id: "VC-1042", name: "Torres barkada", detail: "Day swim · 18 guests", date: "Today · 9:00 AM", status: "confirmed" },
        { id: "VC-1041", name: "Reyes Family", detail: "Birthday package · 25 pax", date: "Today · 1:00 PM", status: "confirmed" },
        { id: "VC-1040", name: "Juan Dela Cruz", detail: "Day swim · 15 guests", date: "Tomorrow · 8:00 AM", status: "pending" },
        { id: "VC-1039", name: "Montalban office outing", detail: "Team building · 30 pax", date: "Sat · 7:00 AM", status: "pending" },
        { id: "VC-1038", name: "Ana Villanueva", detail: "Half-day · 12 guests", date: "Sun · 10:00 AM", status: "confirmed" },
      ],
      people: [
        { name: "Reyes Family", meta: "2 visits · Birthday repeat", tag: "Repeat" },
        { name: "Torres barkada", meta: "3 visits · Always weekend", tag: "VIP" },
        { name: "Juan Dela Cruz", meta: "1 visit · FB inquiry", tag: "New" },
        { name: "Montalban office outing", meta: "Corporate · 30 pax", tag: "Corporate" },
      ],
      settings: [
        { label: "Day rate (weekday)", value: "₱8,500" },
        { label: "Day rate (weekend)", value: "₱10,500" },
        { label: "Operating hours", value: "Daytime only · 8 AM – 5 PM" },
        { label: "Max capacity", value: "50 guests" },
      ],
      pages: {
        packages: {
          title: "Day packages",
          items: [
            { name: "Day swim · up to 20 pax (weekday)", price: "₱8,500" },
            { name: "Day swim · up to 20 pax (weekend)", price: "₱10,500" },
            { name: "Birthday package · tables & chairs", price: "Quote on request" },
            { name: "Half-day rental · smaller groups", price: "₱6,500 weekday" },
          ],
        },
      },
    },
  },
};
