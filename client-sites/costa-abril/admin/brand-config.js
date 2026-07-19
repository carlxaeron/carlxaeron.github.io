window.ADMIN_CONFIG = window.ADMIN_CONFIG || {
  vertical: "booking",
  businessName: "Costa Abril Resort",
  ownerRole: "Owner",
  userInitials: "CA",
  logo: "../assets/logo.jpg",
  painHero:
    "Weekend wave-pool days sell out on Facebook — see occupancy, cottage add-ons, and party requests before you reply on Messenger.",
  brand: {
    primary: "#0e7490",
    primaryDark: "#063a4b",
    accent: "#22d3ee",
  },
  extraNav: [{ id: "packages", label: "Packages", icon: "◈", hash: "#/packages" }],
  demo: {
    booking: {
      labels: {
        dashboardTitle: "Water park · today's flow",
        dashboardSub: "Weekend 90% full · 3 party packages pending",
      },
      stats: [
        { label: "Guests today", value: "142" },
        { label: "Occupancy", value: "90%" },
        { label: "Pending", value: "3" },
        { label: "Cottages booked", value: "8" },
      ],
      occupancy: { weekend: 90, weekday: 68, pending: 3, weekendLabel: "Sat–Sun" },
      timeline: [
        { time: "7:00 AM", title: "Garcia family outing", detail: "Wave pool · 25 pax · Cottage A", status: "confirmed" },
        { time: "9:00 AM", title: "San Jose barangay event", detail: "Group entrance · 40 pax", status: "confirmed" },
        { time: "11:00 AM", title: "Reyes birthday party", detail: "Function hall · videoke package", status: "pending" },
        { time: "1:00 PM", title: "Montalban school trip", detail: "Day tour · 55 students", status: "confirmed" },
        { time: "3:00 PM", title: "Lim family", detail: "Night swim · gazebo + cottage", status: "pending" },
      ],
      pendingRequests: [
        {
          id: "CA-2201",
          name: "Reyes birthday party",
          detail: "Function hall · tables · videoke · 35 pax",
          date: "Sat · 11:00 AM",
          source: "Messenger",
          amount: "₱28,000",
        },
        {
          id: "CA-2200",
          name: "Lim family",
          detail: "Night swim · gazebo + cottage",
          date: "Sat · 3:00 PM",
          source: "Facebook",
          amount: "₱12,500",
        },
        {
          id: "CA-2198",
          name: "Corporate team building",
          detail: "Wave pool + hall · 50 pax",
          date: "Sun · 8:00 AM",
          source: "Phone",
          amount: "₱45,000",
        },
      ],
      primaryList: [
        { id: "CA-2202", name: "Garcia family outing", detail: "Wave pool · Cottage A · 25 pax", date: "Today · 7:00 AM", status: "confirmed" },
        { id: "CA-2201", name: "Reyes birthday party", detail: "Function hall · videoke", date: "Sat · 11:00 AM", status: "pending" },
        { id: "CA-2200", name: "Lim family", detail: "Night swim · gazebo", date: "Sat · 3:00 PM", status: "pending" },
        { id: "CA-2199", name: "Montalban school trip", detail: "Day tour · 55 students", date: "Today · 1:00 PM", status: "confirmed" },
        { id: "CA-2198", name: "Corporate team building", detail: "Wave pool + hall · 50 pax", date: "Sun · 8:00 AM", status: "pending" },
      ],
      people: [
        { name: "Garcia family", meta: "4 visits · Cottage repeat", tag: "Repeat" },
        { name: "Reyes birthday party", meta: "Function hall inquiry", tag: "Hot" },
        { name: "Montalban school trip", meta: "Annual booking", tag: "Corporate" },
        { name: "Lim family", meta: "Night rate · FB message", tag: "New" },
      ],
      settings: [
        { label: "Entrance (day/night)", value: "From ₱150 / person" },
        { label: "Cottage add-on", value: "Quote by size & date" },
        { label: "Operating hours", value: "Always open" },
        { label: "Function hall", value: "Party packages + videoke" },
      ],
      pages: {
        packages: {
          title: "Resort packages",
          items: [
            { name: "Day entrance", price: "From ₱150 / person" },
            { name: "Night entrance", price: "From ₱150 / person" },
            { name: "Cottage / gazebo add-on", price: "By group size" },
            { name: "Function hall + videoke", price: "Party package quote" },
            { name: "Air-con room / dorm / villa", price: "On top of entrance" },
          ],
        },
      },
    },
  },
};
