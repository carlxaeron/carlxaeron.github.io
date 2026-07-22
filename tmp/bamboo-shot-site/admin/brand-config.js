window.ADMIN_CONFIG = window.ADMIN_CONFIG || {
  vertical: "leads",
  businessName: "Bamboo Grove Café",
  ownerRole: "Owner",
  userInitials: "BG",
  logo: null,
  painHero:
    "Catering inquiries and weekend pastry orders on Messenger — see new leads, quotes, and follow-ups due today in one inbox.",
  brand: {
    primary: "#00a862",
    primaryDark: "#00473e",
    accent: "#cba258",
  },
  demo: {
    leads: {
      labels: {
        dashboardTitle: "Café inquiries · today",
        dashboardSub: "4 new Messenger leads · 2 quotes due",
      },
      stats: [
        { label: "New leads", value: "4" },
        { label: "Quoted", value: "3" },
        { label: "Catering", value: "2" },
        { label: "Follow-ups due", value: "2" },
      ],
      pipeline: {
        new: [
          { id: "BG-88", name: "Montalban office", detail: "Weekend pastry box · 30 pax", source: "Messenger", quoteAmount: "₱4,500", date: "Today" },
          { id: "BG-89", name: "Reyes family event", detail: "Bamboo breakfast catering", source: "Facebook", quoteAmount: "₱8,000", date: "Today" },
        ],
        quoted: [
          { id: "BG-87", name: "Corporate meeting", detail: "Iced caramel latte bulk · 50 cups", source: "Email", quoteAmount: "₱6,500", date: "Yesterday" },
          { id: "BG-84", name: "School fair booth", detail: "Matcha cold brew station", source: "Messenger", quoteAmount: "₱12,000", date: "3 days ago" },
        ],
        negotiating: [
          { id: "BG-86", name: "Wedding brunch", detail: "Full catering · 80 pax", source: "Facebook", quoteAmount: "₱45,000", date: "2 days ago" },
        ],
        won: [
          { id: "BG-82", name: "Weekly office delivery", detail: "House blend · 20 cups/day", source: "Referral", quoteAmount: "₱3,200/wk", date: "Won Mon" },
        ],
      },
      primaryList: [
        { id: "BG-88", name: "Montalban office", detail: "Pastry box · 30 pax", date: "Today", status: "open" },
        { id: "BG-87", name: "Corporate meeting", detail: "Latte bulk order", date: "Yesterday", status: "pending" },
        { id: "BG-86", name: "Wedding brunch", detail: "Catering · 80 pax", date: "2 days ago", status: "pending" },
        { id: "BG-84", name: "School fair booth", detail: "Matcha station", date: "3 days ago", status: "pending" },
      ],
      people: [
        { name: "Montalban office", meta: "Messenger · repeat potential", tag: "Hot" },
        { name: "Wedding brunch", meta: "FB · large catering", tag: "Hot" },
        { name: "Weekly office delivery", meta: "Referral · won", tag: "Won" },
      ],
      settings: [
        { label: "Best sellers", value: "House blend · Iced caramel · Matcha" },
        { label: "Catering min", value: "20 pax · quote" },
        { label: "Follow-up cadence", value: "3d → 7d × 3" },
        { label: "Hours", value: "Daily · 7 AM – 8 PM" },
      ],
    },
  },
};
