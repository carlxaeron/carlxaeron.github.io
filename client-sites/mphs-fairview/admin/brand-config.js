window.ADMIN_CONFIG = window.ADMIN_CONFIG || {
  vertical: "leads",
  businessName: "MPHS Mother of Perpetual Help Inc. Fairview",
  ownerRole: "Registrar",
  userInitials: "MP",
  logo: "/assets/logo.jpg",
  painHero:
    "Enrollment inquiries and campus tour requests on Messenger — pipeline K–12 admission leads without losing parent names.",
  brand: {
    primary: "#c9a227",
    primaryDark: "#0b1f4d",
    accent: "#cba258",
  },
  demo: {
    leads: {
      labels: {
        dashboardTitle: "Enrollment inquiries",
        dashboardSub: "6 new parent leads · 2 campus tours Friday",
      },
      stats: [
        { label: "New leads", value: "6" },
        { label: "Quoted", value: "3" },
        { label: "Tours booked", value: "2" },
        { label: "Follow-ups due", value: "4" },
      ],
      pipeline: {
        new: [
          { id: "MP-88", name: "Reyes family", detail: "Grade 1 enrollment · SY 2026", source: "Messenger", quoteAmount: "Tuition quote", date: "Today" },
          { id: "MP-89", name: "Lim parents", detail: "Senior High · STEM strand", source: "Facebook", quoteAmount: "Tuition quote", date: "Today" },
        ],
        quoted: [
          { id: "MP-87", name: "Tan family", detail: "K2 transfer · mid-year", source: "Messenger", quoteAmount: "₱45,000/yr", date: "Yesterday" },
          { id: "MP-84", name: "Garcia siblings", detail: "Grades 3 & 7 · sibling discount", source: "Phone", quoteAmount: "₱82,000/yr", date: "4 days ago" },
        ],
        negotiating: [
          { id: "MP-86", name: "Corporate employee", detail: "Junior High · payment plan", source: "Email", quoteAmount: "₱38,000/yr", date: "2 days ago" },
        ],
        won: [
          { id: "MP-82", name: "Santos family", detail: "Kindergarten K1 · enrolled", source: "Walk-in", quoteAmount: "₱32,000/yr", date: "Won Mon" },
        ],
      },
      primaryList: [
        { id: "MP-88", name: "Reyes family", detail: "Grade 1 · SY 2026", date: "Today", status: "open" },
        { id: "MP-87", name: "Tan family", detail: "K2 transfer", date: "Yesterday", status: "pending" },
        { id: "MP-86", name: "Corporate employee", detail: "Junior High · payment plan", date: "2 days ago", status: "pending" },
        { id: "MP-84", name: "Garcia siblings", detail: "Grades 3 & 7", date: "4 days ago", status: "pending" },
      ],
      people: [
        { name: "Reyes family", meta: "Messenger · Grade 1 inquiry", tag: "Hot" },
        { name: "Garcia siblings", meta: "Sibling discount · negotiating", tag: "Warm" },
        { name: "Santos family", meta: "Walk-in · enrolled K1", tag: "Won" },
      ],
      settings: [
        { label: "Hotline", value: "0966 194 6589" },
        { label: "Levels", value: "K1–K2 · Grades 1–12 · SHS" },
        { label: "Location", value: "Iris St., Dahlia Ave., QC" },
        { label: "Follow-up cadence", value: "3d → 7d × 3" },
      ],
    },
  },
};
