window.ADMIN_CONFIG = window.ADMIN_CONFIG || {
  vertical: "service",
  businessName: "Archipelago Builders Corporation",
  ownerRole: "Project Director",
  userInitials: "AB",
  logo: "/assets/logo.jpg",
  painHero:
    "AAA project bids and site mobilization overlap — see civil works and infrastructure jobs from inquiry to done on one board.",
  brand: {
    primary: "#1e5aab",
    primaryDark: "#0c1a2e",
    accent: "#eef3f9",
  },
  extraNav: [{ id: "projects", label: "Projects", icon: "◈", hash: "#/projects" }],
  demo: {
    service: {
      labels: {
        dashboardTitle: "AAA project pipeline",
        dashboardSub: "2 bids due · 1 infrastructure mobilization",
      },
      stats: [
        { label: "Active projects", value: "6" },
        { label: "Bids due", value: "2" },
        { label: "On site", value: "3" },
        { label: "Completed YTD", value: "4" },
      ],
      kanban: {
        new: [
          { id: "AB-802", name: "Cavite road widening", detail: "Civil & infrastructure · AAA", priority: "normal", date: "Bid due Fri" },
          { id: "AB-803", name: "Laguna commercial complex", detail: "Building construction", priority: "normal", date: "Site visit Tue" },
        ],
        scheduled: [
          { id: "AB-799", name: "Bulacan warehouse", detail: "Archi Cast · steel structure", priority: "normal", date: "Mobilize Mon" },
          { id: "AB-800", name: "QC office tower", detail: "Resilient fit-out phase 2", priority: "normal", date: "Next week" },
        ],
        inProgress: [
          { id: "AB-801", name: "Pasig mixed-use", detail: "Category AAA · foundation", priority: "normal", date: "Active", tech: "Site A" },
          { id: "AB-797", name: "Taguig infrastructure", detail: "Drainage & civil works", priority: "normal", date: "Active", tech: "Site B" },
        ],
        done: [
          { id: "AB-796", name: "Marikina school building", detail: "Turnover inspection", priority: "low", date: "Done last week" },
        ],
      },
      primaryList: [
        { id: "AB-802", name: "Cavite road widening", detail: "AAA bid · civil works", date: "Bid due Fri", status: "pending" },
        { id: "AB-801", name: "Pasig mixed-use", detail: "Foundation phase", date: "Active", status: "open" },
        { id: "AB-800", name: "QC office tower", detail: "Resilient fit-out P2", date: "Next week", status: "confirmed" },
        { id: "AB-799", name: "Bulacan warehouse", detail: "Archi Cast mobilize", date: "Mon", status: "confirmed" },
      ],
      people: [
        { name: "Cavite road widening", meta: "Government bid · AAA", tag: "Hot" },
        { name: "Pasig mixed-use", meta: "Active site · foundation", tag: "Active" },
        { name: "Bulacan warehouse", meta: "Archi Cast division", tag: "Account" },
      ],
      settings: [
        { label: "Classification", value: "Category AAA contractor" },
        { label: "Divisions", value: "Archiwall · Archi Cast · Resilient · White Equipment" },
        { label: "Scope", value: "Building · Civil · Infrastructure" },
        { label: "Active sites", value: "3 today" },
      ],
      pages: {
        projects: {
          title: "Active projects",
          items: [
            { name: "Pasig mixed-use · foundation", price: "In progress" },
            { name: "Taguig infrastructure · drainage", price: "In progress" },
            { name: "Cavite road widening · bid", price: "Due Friday" },
            { name: "Bulacan warehouse · Archi Cast", price: "Mobilize Monday" },
          ],
        },
      },
    },
  },
};
