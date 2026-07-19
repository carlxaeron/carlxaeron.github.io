window.ADMIN_CONFIG = window.ADMIN_CONFIG || {
  vertical: "leads",
  businessName: "Trumed Pharmaceuticals",
  ownerRole: "Sales",
  userInitials: "TP",
  logo: "/assets/logo.png",
  painHero:
    "Cardiovascular and anti-infective product inquiries — track B2B leads from Facebook and email in one pipeline.",
  brand: {
    primary: "#1d6fb8",
    primaryDark: "#0b2545",
    accent: "#e8f1f8",
  },
  demo: {
    leads: {
      labels: {
        dashboardTitle: "B2B pharma pipeline",
        dashboardSub: "3 hospital inquiries · 1 nutritionals reorder",
      },
      stats: [
        { label: "New leads", value: "3" },
        { label: "Quoted", value: "4" },
        { label: "Hospital accounts", value: "2" },
        { label: "Follow-ups due", value: "2" },
      ],
      pipeline: {
        new: [
          { id: "TP-88", name: "Private hospital QC", detail: "Cardiovascular line · formulary", source: "Email", quoteAmount: "₱250,000", date: "Today" },
          { id: "TP-89", name: "Clinic network", detail: "Anti-infectives · initial stock", source: "Facebook", quoteAmount: "₱45,000", date: "Today" },
        ],
        quoted: [
          { id: "TP-87", name: "Pharmacy wholesaler", detail: "Nutritionals · mixed SKUs", source: "Phone", quoteAmount: "₱95,000", date: "Yesterday" },
          { id: "TP-84", name: "Rural health unit", detail: "Anti-infectives · DOH program", source: "Email", quoteAmount: "₱38,000", date: "5 days ago" },
        ],
        negotiating: [
          { id: "TP-86", name: "Hospital group", detail: "Annual supply agreement", source: "Referral", quoteAmount: "₱1.8M/yr", date: "3 days ago" },
        ],
        won: [
          { id: "TP-82", name: "Medical center", detail: "Cardio product launch", source: "Referral", quoteAmount: "₱180,000", date: "Won Wed" },
        ],
      },
      primaryList: [
        { id: "TP-88", name: "Private hospital QC", detail: "Cardiovascular formulary", date: "Today", status: "open" },
        { id: "TP-87", name: "Pharmacy wholesaler", detail: "Nutritionals mixed", date: "Yesterday", status: "pending" },
        { id: "TP-86", name: "Hospital group", detail: "Annual agreement", date: "3 days ago", status: "pending" },
        { id: "TP-84", name: "Rural health unit", detail: "Anti-infectives DOH", date: "5 days ago", status: "pending" },
      ],
      people: [
        { name: "Private hospital QC", meta: "Email · formulary review", tag: "Hot" },
        { name: "Hospital group", meta: "Annual contract · negotiating", tag: "Warm" },
        { name: "Medical center", meta: "Referral · won", tag: "Won" },
      ],
      settings: [
        { label: "Hotline", value: "+632 8697 1754" },
        { label: "Therapeutic areas", value: "Cardiovascular · Anti-infectives · Nutritionals" },
        { label: "Channel", value: "B2B · Hospital · Pharmacy" },
        { label: "Follow-up cadence", value: "3d → 7d × 3" },
      ],
    },
  },
};
