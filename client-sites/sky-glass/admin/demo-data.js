(function () {
  "use strict";

  var PACKS = {
    booking: {
      labels: {
        primary: "Bookings",
        people: "Guests",
        calendar: "Venue calendar",
        dashboardTitle: "Today's check-ins",
        dashboardSub: "Occupancy and arrivals for today",
      },
      stats: [
        { label: "Check-ins today", value: "6" },
        { label: "Occupancy", value: "78%" },
        { label: "Pending", value: "3" },
        { label: "This week", value: "24" },
      ],
      occupancy: {
        weekend: 90,
        weekday: 62,
        pending: 3,
        weekendLabel: "Sat–Sun",
      },
      timeline: [
        { time: "8:00 AM", title: "Reyes Family", detail: "Birthday package · Pool A", status: "confirmed" },
        { time: "9:00 AM", title: "Maria Santos", detail: "Day swim · 20 guests", status: "confirmed" },
        { time: "11:00 AM", title: "Corporate outing", detail: "Team building · 35 pax", status: "pending" },
        { time: "1:00 PM", title: "Ana Villanueva", detail: "Half-day rental", status: "confirmed" },
        { time: "3:00 PM", title: "Juan Dela Cruz", detail: "Day swim · 12 guests", status: "pending" },
      ],
      pendingRequests: [
        { id: "BK-1040", name: "Juan Dela Cruz", detail: "Half-day rental · 15 guests", date: "Tomorrow · 8:00 AM", source: "Messenger", amount: "₱8,500" },
        { id: "BK-1039", name: "Corporate outing", detail: "Team building · 35 pax", date: "Sat · 7:00 AM", source: "Facebook", amount: "₱18,000" },
        { id: "BK-1037", name: "Garcia reunion", detail: "Day swim · 25 guests", date: "Sun · 9:00 AM", source: "SMS", amount: "₱10,500" },
      ],
      primaryList: [
        { id: "BK-1042", name: "Maria Santos", detail: "Day swim · 20 guests", date: "Today · 9:00 AM", status: "confirmed" },
        { id: "BK-1041", name: "Reyes Family", detail: "Birthday package", date: "Today · 1:00 PM", status: "confirmed" },
        { id: "BK-1040", name: "Juan Dela Cruz", detail: "Half-day rental", date: "Tomorrow · 8:00 AM", status: "pending" },
        { id: "BK-1039", name: "Corporate outing", detail: "Team building · 35 pax", date: "Sat · 7:00 AM", status: "pending" },
        { id: "BK-1038", name: "Ana Villanueva", detail: "Day swim · 12 guests", date: "Sun · 10:00 AM", status: "confirmed" },
      ],
      calendarEvents: [3, 5, 7, 10, 12, 14, 18, 21, 24, 28],
      people: [
        { name: "Maria Santos", meta: "3 visits · Last: today", tag: "VIP" },
        { name: "Reyes Family", meta: "2 visits · Birthday repeat", tag: "Repeat" },
        { name: "Juan Dela Cruz", meta: "1 visit · Inquiry via FB", tag: "New" },
        { name: "Corporate outing", meta: "Company account", tag: "Corporate" },
      ],
      settings: [
        { label: "Day rate (weekday)", value: "₱8,500" },
        { label: "Day rate (weekend)", value: "₱10,500" },
        { label: "Operating hours", value: "8:00 AM – 5:00 PM" },
        { label: "Max capacity", value: "50 guests" },
      ],
    },
    appointments: {
      labels: {
        primary: "Appointments",
        people: "Patients",
        calendar: "Schedule",
        dashboardTitle: "Today's appointments",
        dashboardSub: "OPD board and scheduled visits",
      },
      stats: [
        { label: "Today", value: "18" },
        { label: "Waiting", value: "4" },
        { label: "Completed", value: "9" },
        { label: "No-shows", value: "1" },
      ],
      queue: {
        waiting: [
          { name: "Pedro Lim", detail: "Follow-up · Lab results", wait: "12 min", ticket: "A-042" },
          { name: "Grace Tan", detail: "Pediatric consult", wait: "8 min", ticket: "A-043" },
          { name: "Luis Garcia", detail: "Annual physical", wait: "5 min", ticket: "A-044" },
          { name: "Nina Reyes", detail: "General check-up", wait: "3 min", ticket: "A-045" },
        ],
        inConsult: [
          { name: "Rosa Mendoza", detail: "General check-up", room: "Room 2", doctor: "Dr. Santos" },
        ],
        done: [
          { name: "Carlo Bautista", detail: "Lab follow-up", time: "8:45 AM" },
          { name: "Elena Cruz", detail: "Prenatal visit", time: "9:10 AM" },
          { name: "Mark Villanueva", detail: "Dental referral", time: "9:35 AM" },
        ],
      },
      rooms: [
        { id: "r1", name: "Room 1", doctor: "Dr. Reyes", status: "available" },
        { id: "r2", name: "Room 2", doctor: "Dr. Santos", status: "busy" },
        { id: "r3", name: "Room 3", doctor: "Dr. Lim", status: "busy" },
        { id: "lab", name: "Lab", doctor: "Tech on duty", status: "available" },
      ],
      primaryList: [
        { id: "AP-2201", name: "Rosa Mendoza", detail: "General check-up", date: "Today · 9:30 AM", status: "confirmed" },
        { id: "AP-2200", name: "Pedro Lim", detail: "Follow-up · Lab results", date: "Today · 10:15 AM", status: "open" },
        { id: "AP-2199", name: "Grace Tan", detail: "Pediatric consult", date: "Today · 11:00 AM", status: "pending" },
        { id: "AP-2198", name: "Luis Garcia", detail: "Annual physical", date: "Tomorrow · 8:00 AM", status: "confirmed" },
      ],
      calendarEvents: [2, 4, 6, 9, 11, 15, 17, 20, 22, 26],
      people: [
        { name: "Rosa Mendoza", meta: "Member · HMO covered", tag: "Regular" },
        { name: "Pedro Lim", meta: "Follow-up in 2 weeks", tag: "Follow-up" },
        { name: "Grace Tan", meta: "First visit", tag: "New" },
      ],
      settings: [
        { label: "Clinic hours", value: "Mon–Sat · 8 AM – 6 PM" },
        { label: "Consultation fee", value: "₱500" },
        { label: "Emergency line", value: "On-call 24/7" },
        { label: "Departments", value: "OPD · Pedia · Lab" },
      ],
    },
    service: {
      labels: {
        primary: "Jobs",
        people: "Customers",
        calendar: "Dispatch week",
        dashboardTitle: "Open jobs",
        dashboardSub: "Service requests and dispatch schedule",
      },
      stats: [
        { label: "Open jobs", value: "7" },
        { label: "In progress", value: "3" },
        { label: "Done today", value: "5" },
        { label: "This week", value: "19" },
      ],
      kanban: {
        new: [
          { id: "JB-502", name: "Greenfield homes", detail: "New install · 3 units", priority: "normal", date: "Wed" },
          { id: "JB-503", name: "QC office tower", detail: "AC not cooling · 12F", priority: "emergency", date: "Today" },
        ],
        scheduled: [
          { id: "JB-499", name: "Office Bldg QC", detail: "Leak repair", priority: "normal", date: "Tomorrow" },
          { id: "JB-500", name: "Villa Verde", detail: "Preventive maintenance", priority: "low", date: "Today · PM" },
        ],
        inProgress: [
          { id: "JB-501", name: "SM North · Unit 12F", detail: "AC not cooling", priority: "emergency", date: "Today · AM", tech: "Team A" },
          { id: "JB-497", name: "Marikina condo", detail: "Filter replacement", priority: "normal", date: "Today", tech: "Team B" },
        ],
        done: [
          { id: "JB-496", name: "Pasig retail", detail: "Drain clean", priority: "low", date: "Done 10:30 AM" },
          { id: "JB-495", name: "Antipolo home", detail: "Gas refill", priority: "normal", date: "Done 9:15 AM" },
        ],
      },
      primaryList: [
        { id: "JB-501", name: "SM North · Unit 12F", detail: "AC not cooling", date: "Today · AM slot", status: "open" },
        { id: "JB-500", name: "Villa Verde", detail: "Preventive maintenance", date: "Today · PM slot", status: "confirmed" },
        { id: "JB-499", name: "Office Bldg QC", detail: "Leak repair", date: "Tomorrow", status: "pending" },
        { id: "JB-498", name: "Greenfield homes", detail: "New install · 3 units", date: "Wed", status: "pending" },
      ],
      calendarEvents: [1, 4, 5, 8, 11, 13, 16, 19, 23, 27],
      people: [
        { name: "SM North tenant", meta: "Contract · Quarterly PM", tag: "Contract" },
        { name: "Villa Verde HOA", meta: "12 units on file", tag: "Account" },
        { name: "Office Bldg QC", meta: "Emergency call", tag: "Priority" },
      ],
      settings: [
        { label: "Service areas", value: "NCR · Rizal · Bulacan" },
        { label: "Standard call-out", value: "₱800" },
        { label: "Technicians on duty", value: "4 today" },
        { label: "Warranty", value: "90 days on parts" },
      ],
    },
    leads: {
      labels: {
        primary: "Leads",
        people: "Contacts",
        calendar: "Follow-up calendar",
        dashboardTitle: "New leads",
        dashboardSub: "Inquiries and quote requests",
      },
      stats: [
        { label: "New leads", value: "12" },
        { label: "Quoted", value: "5" },
        { label: "Won this month", value: "3" },
        { label: "Follow-ups due", value: "4" },
      ],
      pipeline: {
        new: [
          { id: "LD-88", name: "Fairview school admin", detail: "Website + enrollment portal", source: "Facebook", quoteAmount: "₱45,000", date: "Today" },
          { id: "LD-89", name: "Montalban cafe", detail: "Menu site + booking form", source: "Messenger", quoteAmount: "₱18,000", date: "Today" },
        ],
        quoted: [
          { id: "LD-87", name: "Woodblock inquiry", detail: "Modular kitchen quote", source: "Messenger", quoteAmount: "₱32,000", date: "Yesterday" },
          { id: "LD-84", name: "Retail chain", detail: "Multi-branch site", source: "Email", quoteAmount: "₱120,000", date: "4 days ago" },
        ],
        negotiating: [
          { id: "LD-86", name: "Industrial fan buyer", detail: "Bulk order · 20 units", source: "Phone", quoteAmount: "₱85,000", date: "2 days ago" },
        ],
        won: [
          { id: "LD-82", name: "Local clinic", detail: "Landing page + forms", source: "Referral", quoteAmount: "₱15,000", date: "Won Mon" },
        ],
      },
      primaryList: [
        { id: "LD-88", name: "Fairview school admin", detail: "Website + enrollment portal", date: "Today", status: "open" },
        { id: "LD-87", name: "Woodblock inquiry", detail: "Modular kitchen quote", date: "Yesterday", status: "pending" },
        { id: "LD-86", name: "Industrial fan buyer", detail: "Bulk order · 20 units", date: "2 days ago", status: "confirmed" },
        { id: "LD-85", name: "Retail chain", detail: "Multi-branch site", date: "3 days ago", status: "pending" },
      ],
      calendarEvents: [2, 6, 8, 10, 14, 16, 20, 22, 25, 29],
      people: [
        { name: "Fairview school admin", meta: "Email · Referral", tag: "Hot" },
        { name: "Woodblock inquiry", meta: "FB Messenger", tag: "Warm" },
        { name: "Industrial fan buyer", meta: "Phone · Repeat buyer", tag: "Hot" },
      ],
      settings: [
        { label: "Business profile", value: "B2B · Local retail" },
        { label: "Quote template", value: "Standard website pkg" },
        { label: "Follow-up cadence", value: "3d → 7d × 3" },
        { label: "Owner notifications", value: "Email + SMS" },
      ],
    },
  };

  window.ADMIN_DEMO_PACKS = PACKS;
})();
