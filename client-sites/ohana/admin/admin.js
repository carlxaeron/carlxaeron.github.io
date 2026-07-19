(function () {
  "use strict";

  var config = window.ADMIN_CONFIG || {};
  var vertical = config.vertical || "booking";
  var packs = window.ADMIN_DEMO_PACKS || {};
  var data = packs[vertical] || packs.booking;
  var labels = data.labels;

  var NAV = [
    { id: "dashboard", label: "Dashboard", icon: "▣", hash: "#/" },
    { id: "primary", label: labels.primary, icon: "☰", hash: "#/primary" },
    { id: "calendar", label: labels.calendar, icon: "▦", hash: "#/calendar" },
    { id: "people", label: labels.people, icon: "◎", hash: "#/people" },
    { id: "settings", label: "Settings", icon: "⚙", hash: "#/settings" },
  ];

  var sidebar = document.querySelector("[data-sidebar]");
  var navEl = document.querySelector("[data-nav]");
  var bottomNav = document.querySelector("[data-bottom-nav]");
  var pageEl = document.querySelector("[data-page]");
  var menuBtn = document.querySelector("[data-menu-toggle]");
  var overlay = document.querySelector("[data-overlay]");

  function applyBrand() {
    var root = document.documentElement;
    var brand = config.brand || {};
    if (brand.primary) root.style.setProperty("--admin-primary", brand.primary);
    if (brand.primaryDark) root.style.setProperty("--admin-primary-dark", brand.primaryDark);
    if (brand.accent) root.style.setProperty("--admin-accent", brand.accent);

    var nameEl = document.querySelector("[data-brand-name]");
    if (nameEl && config.businessName) nameEl.textContent = config.businessName;

    var roleEl = document.querySelector("[data-owner-role]");
    if (roleEl && config.ownerRole) roleEl.textContent = config.ownerRole;

    var initialsEl = document.querySelector("[data-user-initials]");
    if (initialsEl && config.userInitials) initialsEl.textContent = config.userInitials;

    var logoEl = document.querySelector("[data-brand-logo]");
    if (logoEl && config.logo) {
      logoEl.src = config.logo;
      logoEl.alt = config.businessName || "Logo";
      logoEl.hidden = false;
    }

    if (config.businessName) {
      document.title = config.businessName + " — Admin Demo";
    }
  }

  function navLink(item, compact) {
    var a = document.createElement("a");
    a.href = item.hash;
    a.className = compact ? "admin-bottom-nav__link" : "admin-nav__link";
    a.setAttribute("data-route", item.id);
    a.innerHTML =
      (compact
        ? '<span class="admin-bottom-nav__icon">' + item.icon + "</span>"
        : '<span class="admin-nav__icon">' + item.icon + "</span>") +
      (compact ? item.label.split(" ")[0] : item.label);
    return a;
  }

  function buildNav() {
    NAV.forEach(function (item) {
      navEl.appendChild(navLink(item, false));
      bottomNav.appendChild(navLink(item, true));
    });
  }

  function closeDrawer() {
    sidebar.classList.remove("is-open");
    overlay.hidden = true;
    overlay.classList.remove("is-visible");
    menuBtn.setAttribute("aria-expanded", "false");
  }

  function openDrawer() {
    sidebar.classList.add("is-open");
    overlay.hidden = false;
    overlay.classList.add("is-visible");
    menuBtn.setAttribute("aria-expanded", "true");
  }

  function statusBadge(status) {
    var cls = "admin-badge admin-badge--" + (status || "pending");
    return '<span class="' + cls + '">' + (status || "pending") + "</span>";
  }

  function renderStats() {
    return (
      '<div class="admin-stats">' +
      data.stats
        .map(function (s) {
          return (
            '<div class="admin-stat"><div class="admin-stat__label">' +
            s.label +
            '</div><div class="admin-stat__value">' +
            s.value +
            "</div></div>"
          );
        })
        .join("") +
      "</div>"
    );
  }

  function renderPrimaryTable(rows) {
    return (
      '<div class="admin-card"><div class="admin-card__head">' +
      labels.primary +
      '</div><div class="admin-table-wrap"><table class="admin-table"><thead><tr><th>Ref</th><th>Client</th><th>Details</th><th>When</th><th>Status</th></tr></thead><tbody>' +
      rows
        .map(function (r) {
          return (
            "<tr><td>" +
            r.id +
            "</td><td><strong>" +
            r.name +
            "</strong></td><td>" +
            r.detail +
            "</td><td>" +
            r.date +
            "</td><td>" +
            statusBadge(r.status) +
            "</td></tr>"
          );
        })
        .join("") +
      "</tbody></table></div></div>"
    );
  }

  function renderCalendar() {
    var today = new Date().getDate();
    var days = [];
    for (var d = 1; d <= 28; d += 1) {
      var hasEvent = data.calendarEvents.indexOf(d) !== -1;
      var cls = "admin-calendar__day";
      if (hasEvent) cls += " has-event";
      if (d === today) cls += " is-today";
      days.push(
        '<div class="' +
          cls +
          '"><span>' +
          d +
          "</span>" +
          (hasEvent ? '<span class="admin-calendar__dot"></span>' : "") +
          "</div>"
      );
    }
    return (
      '<div class="admin-card"><div class="admin-card__head">' +
      labels.calendar +
      ' · This month</div><div style="padding:1rem"><div class="admin-calendar">' +
      days.join("") +
      "</div></div></div>"
    );
  }

  function renderPeople() {
    return (
      '<div class="admin-card"><div class="admin-card__head">' +
      labels.people +
      '</div><ul class="admin-list">' +
      data.people
        .map(function (p) {
          return (
            '<li class="admin-list__item"><div><div class="admin-list__name">' +
            p.name +
            '</div><div class="admin-list__meta">' +
            p.meta +
            '</div></div><span class="admin-badge admin-badge--open">' +
            p.tag +
            "</span></li>"
          );
        })
        .join("") +
      "</ul></div>"
    );
  }

  function renderSettings() {
    return (
      '<div class="admin-card"><div class="admin-card__head">Settings <span style="font-weight:400;color:var(--admin-muted)">· read-only demo</span></div><div class="admin-settings-grid" style="padding:1rem">' +
      data.settings
        .map(function (s) {
          return (
            '<div class="admin-setting"><div><div class="admin-setting__label">' +
            s.label +
            '</div><strong>' +
            s.value +
            "</strong></div></div>"
          );
        })
        .join("") +
      "</div></div>"
    );
  }

  var routes = {
    dashboard: function () {
      return (
        "<h1 class=\"admin-page-title\">" +
        data.labels.dashboardTitle +
        '</h1><p class="admin-page-sub">' +
        data.labels.dashboardSub +
        "</p>" +
        renderStats() +
        renderPrimaryTable(data.primaryList.slice(0, 3))
      );
    },
    primary: function () {
      return (
        "<h1 class=\"admin-page-title\">" +
        labels.primary +
        '</h1><p class="admin-page-sub">Sample list — browse and filter in the full system</p>' +
        renderPrimaryTable(data.primaryList)
      );
    },
    calendar: function () {
      return (
        "<h1 class=\"admin-page-title\">" +
        labels.calendar +
        '</h1><p class="admin-page-sub">Upcoming bookings and blocked dates</p>' +
        renderCalendar()
      );
    },
    people: function () {
      return (
        "<h1 class=\"admin-page-title\">" +
        labels.people +
        '</h1><p class="admin-page-sub">Customer records and visit history</p>' +
        renderPeople()
      );
    },
    settings: function () {
      return (
        '<h1 class="admin-page-title">Settings</h1><p class="admin-page-sub">Rates, hours, and business profile (demo)</p>' +
        renderSettings()
      );
    },
  };

  function getRoute() {
    var hash = window.location.hash || "#/";
    if (hash === "#/" || hash === "#/dashboard") return "dashboard";
    if (hash.indexOf("#/primary") === 0) return "primary";
    if (hash.indexOf("#/calendar") === 0) return "calendar";
    if (hash.indexOf("#/people") === 0) return "people";
    if (hash.indexOf("#/settings") === 0) return "settings";
    return "dashboard";
  }

  function setActiveRoute(routeId) {
    document.querySelectorAll("[data-route]").forEach(function (el) {
      el.classList.toggle("is-active", el.getAttribute("data-route") === routeId);
    });
  }

  function render() {
    var routeId = getRoute();
    var renderFn = routes[routeId] || routes.dashboard;
    pageEl.innerHTML = renderFn();
    setActiveRoute(routeId);
    closeDrawer();
    document.querySelector("[data-main]").scrollTop = 0;
  }

  menuBtn.addEventListener("click", function () {
    if (sidebar.classList.contains("is-open")) {
      closeDrawer();
    } else {
      openDrawer();
    }
  });

  overlay.addEventListener("click", closeDrawer);

  window.addEventListener("hashchange", render);

  applyBrand();
  buildNav();
  render();
})();
