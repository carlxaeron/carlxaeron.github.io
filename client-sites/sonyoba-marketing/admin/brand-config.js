window.ADMIN_CONFIG = window.ADMIN_CONFIG || {
  vertical: "leads",
  businessName: "Sonyoba Marketing",
  ownerRole: "Sales",
  userInitials: "SY",
  logo: "/assets/logo.jpg",
  painHero:
    "Shredder model questions and bulk office-equipment quotes on phone — pipeline COMIX and DELI leads by status.",
  brand: {
    primary: "#14a085",
    primaryDark: "#103444",
    accent: "#f5c518",
  },
  extraNav: [{ id: "products", label: "Products", icon: "◈", hash: "#/products" }],
  demo: {
    leads: {
      labels: {
        dashboardTitle: "Equipment inquiries",
        dashboardSub: "4 shredder leads · 1 bulk office quote",
      },
      stats: [
        { label: "New leads", value: "4" },
        { label: "Quoted", value: "5" },
        { label: "Bulk orders", value: "1" },
        { label: "Follow-ups due", value: "3" },
      ],
      pipeline: {
        new: [
          { id: "SY-88", name: "Law firm QC", detail: "COMIX S6610 · 10 sheets micro cut", source: "Phone", quoteAmount: "₱18,500", date: "Today" },
          { id: "SY-89", name: "Bank branch", detail: "Evershred C149-C · 15 sheets", source: "Email", quoteAmount: "₱24,000", date: "Today" },
        ],
        quoted: [
          { id: "SY-87", name: "School admin", detail: "DELI T089 auto-feed · heavy duty", source: "Phone", quoteAmount: "₱32,000", date: "Yesterday" },
          { id: "SY-84", name: "Corporate office", detail: "COMIX S3508D · 8 sheets · 3 units", source: "Referral", quoteAmount: "₱42,000", date: "4 days ago" },
        ],
        negotiating: [
          { id: "SY-86", name: "Government agency", detail: "ACSYS MQ-320D · A3 laminator", source: "Email", quoteAmount: "₱85,000", date: "2 days ago" },
        ],
        won: [
          { id: "SY-82", name: "Accounting firm", detail: "DELI T096 · 16 sheets", source: "Phone", quoteAmount: "₱28,500", date: "Won Mon" },
        ],
      },
      primaryList: [
        { id: "SY-88", name: "Law firm QC", detail: "COMIX S6610 shredder", date: "Today", status: "open" },
        { id: "SY-87", name: "School admin", detail: "DELI T089 auto-feed", date: "Yesterday", status: "pending" },
        { id: "SY-86", name: "Government agency", detail: "ACSYS A3 laminator", date: "2 days ago", status: "pending" },
        { id: "SY-84", name: "Corporate office", detail: "COMIX · 3 units", date: "4 days ago", status: "pending" },
      ],
      people: [
        { name: "Law firm QC", meta: "Phone · micro cut spec", tag: "Hot" },
        { name: "Government agency", meta: "Bulk · negotiating", tag: "Warm" },
        { name: "Accounting firm", meta: "Phone · won", tag: "Won" },
      ],
      settings: [
        { label: "Hotline", value: "(02) 8774-1525" },
        { label: "Brands", value: "COMIX · DELI · Evershred · ACSYS" },
        { label: "Focus", value: "Paper shredders · office machines" },
        { label: "Follow-up cadence", value: "3d → 7d × 3" },
      ],
      pages: {
        products: {
          title: "Featured equipment",
          items: [
            { name: "COMIX S3508D · 8 sheets, 22L", price: "Micro cut" },
            { name: "COMIX S6610 · 10 sheets, 35L", price: "Micro cut" },
            { name: "DELI T089 · Auto-feed heavy duty", price: "Quote" },
            { name: "ACSYS MQ-320D · A3 laminator", price: "4 rollers" },
          ],
        },
      },
    },
  },
};
