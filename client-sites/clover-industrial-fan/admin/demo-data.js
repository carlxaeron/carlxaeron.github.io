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
