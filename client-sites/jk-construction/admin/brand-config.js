window.ADMIN_CONFIG = window.ADMIN_CONFIG || {
  vertical: "service",
  businessName: "JK Construction Services",
  ownerRole: "Project Lead",
  userInitials: "JC",
  logo: null,
  painHero:
    "Renovation quotes from Facebook and site visits pile up — track paint jobs, tiling, and carpentry from New → Done without losing scope details.",
  brand: {
    primary: "#f97316",
    primaryDark: "#1a2d4a",
    accent: "#f4f6f9",
  },
  extraNav: [{ id: "projects", label: "Projects", icon: "◈", hash: "#/projects" }],
  demo: {
    service: {
      labels: {
        dashboardTitle: "Active renovation jobs",
        dashboardSub: "1 urgent leak repair · 3 finishing trades on site",
      },
      stats: [
        { label: "Open jobs", value: "8" },
        { label: "On site", value: "3" },
        { label: "Quoted", value: "4" },
        { label: "Done this week", value: "5" },
      ],
      kanban: {
        new: [
          { id: "JK-302", name: "Montalban bungalow", detail: "Full repaint · interior + exterior", priority: "normal", date: "Wed" },
          { id: "JK-303", name: "San Mateo kitchen", detail: "Tiling + carpentry fit-out", priority: "normal", date: "Thu" },
        ],
        scheduled: [
          { id: "JK-299", name: "Rodriguez townhouse", detail: "Exterior upgrade · facade", priority: "normal", date: "Tomorrow" },
          { id: "JK-300", name: "QC condo unit", detail: "Masonry repair · bathroom", priority: "normal", date: "Today · PM" },
        ],
        inProgress: [
          { id: "JK-301", name: "Antipolo home", detail: "Painting · 2 bedrooms", priority: "normal", date: "Today", tech: "Crew A" },
          { id: "JK-297", name: "Marikina rowhouse", detail: "General labor · demolition prep", priority: "normal", date: "Today", tech: "Crew B" },
        ],
        done: [
          { id: "JK-296", name: "Fairview garage", detail: "Tiling · floor finish", priority: "low", date: "Done Mon" },
        ],
      },
      primaryList: [
        { id: "JK-301", name: "Antipolo home", detail: "Painting · 2 bedrooms", date: "Today", status: "open" },
        { id: "JK-300", name: "QC condo unit", detail: "Masonry · bathroom", date: "Today · PM", status: "confirmed" },
        { id: "JK-302", name: "Montalban bungalow", detail: "Full repaint", date: "Wed", status: "pending" },
        { id: "JK-303", name: "San Mateo kitchen", detail: "Tiling + carpentry", date: "Thu", status: "pending" },
      ],
      people: [
        { name: "Antipolo home", meta: "Repeat client · paint job", tag: "Repeat" },
        { name: "Montalban bungalow", meta: "FB inquiry · full repaint", tag: "New" },
        { name: "QC condo unit", meta: "Urgent masonry", tag: "Priority" },
      ],
      settings: [
        { label: "Service area", value: "Rizal · NCR" },
        { label: "Renovation quote", value: "Site visit first" },
        { label: "Trades", value: "Paint · Tile · Masonry · Carpentry" },
        { label: "Crews on field", value: "2 today" },
      ],
      pages: {
        projects: {
          title: "Active projects",
          items: [
            { name: "Antipolo home · painting", price: "In progress" },
            { name: "QC condo · masonry", price: "Scheduled PM" },
            { name: "Montalban bungalow · repaint", price: "Quoted · Wed start" },
            { name: "San Mateo kitchen · fit-out", price: "Pending approval" },
          ],
        },
      },
    },
  },
};
