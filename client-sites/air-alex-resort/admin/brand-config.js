window.ADMIN_CONFIG = window.ADMIN_CONFIG || {
  vertical: "booking",
  businessName: "Airalex Private Lodge & Resort",
  ownerRole: "Owner",
  userInitials: "AP",
  logo: "/assets/logo.jpg",
  painHero:
    "Private lodge bookings scattered on chat — see which dates are taken and approve day-rental requests from one board.",
  brand: {
    primary: "#f59e0b",
    primaryDark: "#063a4e",
    accent: "#e6f7fb",
  },
  demo: {
    booking: {
      labels: { dashboardTitle: "Lodge bookings today", dashboardSub: "Day rentals and private pool slots" },
      occupancy: { weekend: 88, weekday: 55, pending: 2, weekendLabel: "Sat–Sun" },
      pendingRequests: [
        { id: "AA-101", name: "Bautista family", detail: "Private lodge · 12 pax", date: "Sat · 9 AM", source: "Messenger", amount: "₱12,000" },
        { id: "AA-100", name: "QC barkada", detail: "Day tour · pool access", date: "Sun · 8 AM", source: "Facebook", amount: "₱9,500" },
      ],
    },
  },
};
