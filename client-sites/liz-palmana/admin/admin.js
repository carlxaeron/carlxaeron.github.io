(function () {
  "use strict";

  var config = window.ADMIN_CONFIG || {};
  var vertical = config.vertical || "booking";
  var packs = window.ADMIN_DEMO_PACKS || {};
  var baseData = packs[vertical] || packs.booking;
  var data = mergeDemo(baseData, config.demo && config.demo[vertical]);

  var labels = data.labels;

  var NAV = [
    { id: "dashboard", label: "Dashboard", icon: "▣", hash: "#/" },
    { id: "primary", label: labels.primary, icon: "☰", hash: "#/primary" },
    { id: "calendar", label: labels.calendar, icon: "▦", hash: "#/calendar" },
    { id: "people", label: labels.people, icon: "◎", hash: "#/people" },
  ];

  if (config.extraNav && config.extraNav.length) {
    config.extraNav.forEach(function (item) {
      NAV.push({
        id: item.id,
        label: item.label,
        icon: item.icon || "◈",
        hash: item.hash || "#/" + item.id,
      });
    });
  }

  NAV.push({ id: "settings", label: "Settings", icon: "⚙", hash: "#/settings" });

  var sidebar = document.querySelector("[data-sidebar]");
  var navEl = document.querySelector("[data-nav]");
  var bottomNav = document.querySelector("[data-bottom-nav]");
  var pageEl = document.querySelector("[data-page]");
  var menuBtn = document.querySelector("[data-menu-toggle]");
  var overlay = document.querySelector("[data-overlay]");

  function mergeDemo(base, override) {
    if (!override) return base;
    var out = {};
    Object.keys(base).forEach(function (k) {
      out[k] = base[k];
    });
    Object.keys(override).forEach(function (k) {
      if (
        override[k] &&
        typeof override[k] === "object" &&
        !Array.isArray(override[k]) &&
        base[k] &&
        typeof base[k] === "object" &&
        !Array.isArray(base[k])
      ) {
        out[k] = mergeDemo(base[k], override[k]);
      } else {
        out[k] = override[k];
      }
    });
    return out;
  }

  function applyBrand() {
    var root = document.documentElement;
    var brand = config.brand || {};
    if (brand.primary) root.style.setProperty("--admin-primary", brand.primary);
    if (brand.primaryDark) root.style.setProperty("--admin-primary-dark", brand.primaryDark);
    if (brand.accent) root.style.setProperty("--admin-accent", brand.accent);
    root.style.setProperty("--admin-nav-count", String(NAV.length));

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

  function sourceBadge(source) {
    if (!source) return "";
    var key = String(source).toLowerCase();
    if (key.indexOf("messenger") !== -1) key = "messenger";
    else if (key.indexOf("facebook") !== -1 || key === "fb") key = "fb";
    else if (key.indexOf("phone") !== -1) key = "phone";
    else if (key.indexOf("email") !== -1) key = "email";
    else if (key.indexOf("sms") !== -1) key = "sms";
    return '<span class="admin-badge admin-badge--' + key + '">' + source + "</span>";
  }

  function priorityBadge(priority) {
    return '<span class="admin-badge admin-badge--' + (priority || "normal") + '">' + (priority || "normal") + "</span>";
  }

  function renderPainHero() {
    if (!config.painHero) return "";
    return (
      '<div class="admin-pain-hero"><p class="admin-pain-hero__eyebrow">Why this system</p>' +
      '<p class="admin-pain-hero__text">' +
      config.painHero +
      "</p></div>"
    );
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

  function renderOccupancyStrip() {
    var occ = data.occupancy || { weekend: 78, weekday: 55, pending: 0, weekendLabel: "Weekend" };
    return (
      '<div class="admin-occupancy">' +
      '<div class="admin-occupancy__cell"><div class="admin-occupancy__label">' +
      (occ.weekendLabel || "Weekend") +
      '</div><div class="admin-occupancy__value">' +
      occ.weekend +
      '% full</div><div class="admin-occupancy__bar"><div class="admin-occupancy__fill" style="width:' +
      occ.weekend +
      '%"></div></div></div>' +
      '<div class="admin-occupancy__cell"><div class="admin-occupancy__label">Weekday</div><div class="admin-occupancy__value">' +
      occ.weekday +
      '% full</div><div class="admin-occupancy__bar"><div class="admin-occupancy__fill" style="width:' +
      occ.weekday +
      '%"></div></div></div>' +
      '<div class="admin-occupancy__cell admin-occupancy__cell--alert"><div class="admin-occupancy__label">Awaiting approval</div><div class="admin-occupancy__value">' +
      occ.pending +
      " request" +
      (occ.pending === 1 ? "" : "s") +
      "</div></div></div>"
    );
  }

  function renderDayTimeline() {
    var items = data.timeline || [];
    return (
      '<div class="admin-card"><div class="admin-card__head">Today\'s timeline</div><div style="padding:1rem">' +
      '<div class="admin-timeline">' +
      items
        .map(function (t) {
          var cls = "admin-timeline__item" + (t.status === "pending" ? " is-pending" : "");
          return (
            '<div class="' +
            cls +
            '"><span class="admin-timeline__dot"></span><div class="admin-timeline__time">' +
            t.time +
            '</div><div class="admin-timeline__title">' +
            t.title +
            '</div><div class="admin-timeline__detail">' +
            t.detail +
            " · " +
            statusBadge(t.status) +
            "</div></div>"
          );
        })
        .join("") +
      "</div></div></div>"
    );
  }

  function renderPendingCards(requests) {
    var list = requests || data.pendingRequests || [];
    return (
      '<div class="admin-card"><div class="admin-card__head">Pending requests · approve or decline</div><div style="padding:1rem"><div class="admin-request-cards">' +
      list
        .map(function (r) {
          return (
            '<div class="admin-request-card"><div class="admin-request-card__top"><div><div class="admin-request-card__name">' +
            r.name +
            '</div><div class="admin-request-card__meta">' +
            r.detail +
            "<br>" +
            r.date +
            " · " +
            sourceBadge(r.source) +
            '</div></div><div class="admin-request-card__amount">' +
            (r.amount || "") +
            '</div></div><div class="admin-request-card__actions"><button type="button" class="admin-btn admin-btn--approve">Approve</button><button type="button" class="admin-btn admin-btn--decline">Decline</button></div></div>'
          );
        })
        .join("") +
      "</div></div></div>"
    );
  }

  function renderQueueBoard() {
    var q = data.queue || { waiting: [], inConsult: [], done: [] };
    function queueItems(items, showTicket) {
      return items
        .map(function (p) {
          return (
            '<li class="admin-queue__item"><div class="admin-queue__name">' +
            p.name +
            '</div><div class="admin-queue__meta">' +
            p.detail +
            (showTicket && p.ticket ? " · " + p.ticket : "") +
            (p.wait ? " · Wait " + p.wait : "") +
            (p.room ? " · " + p.room : "") +
            (p.doctor ? " · " + p.doctor : "") +
            (p.time ? " · " + p.time : "") +
            "</div></li>"
          );
        })
        .join("");
    }
    return (
      '<div class="admin-queue">' +
      '<div class="admin-queue__col"><div class="admin-queue__head admin-queue__head--waiting">Waiting · ' +
      q.waiting.length +
      '</div><ul class="admin-queue__list">' +
      queueItems(q.waiting, true) +
      '</ul></div><div class="admin-queue__col"><div class="admin-queue__head admin-queue__head--active">In consult · ' +
      q.inConsult.length +
      '</div><ul class="admin-queue__list">' +
      queueItems(q.inConsult, false) +
      '</ul></div><div class="admin-queue__col"><div class="admin-queue__head admin-queue__head--done">Done today · ' +
      q.done.length +
      '</div><ul class="admin-queue__list">' +
      queueItems(q.done, false) +
      "</ul></div></div>"
    );
  }

  function renderRoomChips() {
    var rooms = data.rooms || [];
    return (
      '<div class="admin-chips">' +
      rooms
        .map(function (r) {
          var cls = r.status === "busy" ? "admin-chip admin-chip--busy" : "admin-chip admin-chip--available";
          return (
            '<span class="' +
            cls +
            '"><span class="admin-chip__dot"></span>' +
            r.name +
            " · " +
            r.doctor +
            "</span>"
          );
        })
        .join("") +
      "</div>"
    );
  }

  function renderKanban() {
    var kb = data.kanban || { new: [], scheduled: [], inProgress: [], done: [] };
    var cols = [
      { key: "new", label: "New" },
      { key: "scheduled", label: "Scheduled" },
      { key: "inProgress", label: "In progress" },
      { key: "done", label: "Done" },
    ];
    return (
      '<div class="admin-kanban">' +
      cols
        .map(function (col) {
          var cards = kb[col.key] || [];
          return (
            '<div class="admin-kanban__col"><div class="admin-kanban__head">' +
            col.label +
            " · " +
            cards.length +
            '</div><div class="admin-kanban__cards">' +
            cards
              .map(function (j) {
                return (
                  '<div class="admin-kanban__card"><div class="admin-kanban__card-title">' +
                  j.name +
                  '</div><div class="admin-kanban__card-meta">' +
                  j.detail +
                  '</div><div class="admin-kanban__card-foot"><span>' +
                  (j.date || "") +
                  "</span>" +
                  priorityBadge(j.priority) +
                  "</div></div>"
                );
              })
              .join("") +
            "</div></div>"
          );
        })
        .join("") +
      "</div>"
    );
  }

  function renderPipeline() {
    var pipe = data.pipeline || { new: [], quoted: [], negotiating: [], won: [] };
    var cols = [
      { key: "new", label: "New", color: "#d97706" },
      { key: "quoted", label: "Quoted", color: "#0e7490" },
      { key: "negotiating", label: "Negotiating", color: "#6366f1" },
      { key: "won", label: "Won", color: "#059669" },
    ];
    return (
      '<div class="admin-pipeline">' +
      cols
        .map(function (col) {
          var cards = pipe[col.key] || [];
          return (
            '<div class="admin-pipeline__col"><div class="admin-pipeline__head" style="color:' +
            col.color +
            '">' +
            col.label +
            " · " +
            cards.length +
            '</div><div class="admin-pipeline__cards">' +
            cards
              .map(function (l) {
                return (
                  '<div class="admin-pipeline__card"><div class="admin-pipeline__card-name">' +
                  l.name +
                  '</div><div class="admin-pipeline__card-detail">' +
                  l.detail +
                  '<br><span style="font-size:0.65rem">' +
                  (l.date || "") +
                  '</span></div><div class="admin-pipeline__card-foot">' +
                  sourceBadge(l.source) +
                  '<span class="admin-pipeline__quote">' +
                  (l.quoteAmount || "") +
                  "</span></div></div>"
                );
              })
              .join("") +
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

  function renderExtraPage(pageId) {
    var pages = (data.pages || {});
    var page = pages[pageId] || { title: pageId, items: [] };
    return (
      "<h1 class=\"admin-page-title\">" +
      (page.title || pageId) +
      '</h1><p class="admin-page-sub">Configured for this business demo</p>' +
      '<div class="admin-card"><div class="admin-packages">' +
      (page.items || [])
        .map(function (item) {
          return (
            '<div class="admin-package-row"><span>' +
            item.name +
            "</span><strong>" +
            (item.price || item.value || "") +
            "</strong></div>"
          );
        })
        .join("") +
      "</div></div>"
    );
  }

  function pageHeader(title, sub) {
    return (
      "<h1 class=\"admin-page-title\">" +
      title +
      '</h1><p class="admin-page-sub">' +
      sub +
      "</p>" +
      renderPainHero()
    );
  }

  var dashboards = {
    booking: function () {
      return (
        pageHeader(data.labels.dashboardTitle, data.labels.dashboardSub) +
        renderOccupancyStrip() +
        renderPendingCards((data.pendingRequests || []).slice(0, 2)) +
        renderDayTimeline()
      );
    },
    appointments: function () {
      return (
        pageHeader(data.labels.dashboardTitle, data.labels.dashboardSub) +
        renderStats() +
        renderRoomChips() +
        renderQueueBoard()
      );
    },
    service: function () {
      return pageHeader(data.labels.dashboardTitle, data.labels.dashboardSub) + renderStats() + renderKanban();
    },
    leads: function () {
      return pageHeader(data.labels.dashboardTitle, data.labels.dashboardSub) + renderStats() + renderPipeline();
    },
  };

  var primaryViews = {
    booking: function () {
      return (
        pageHeader(labels.primary, "All booking requests — approve, reschedule, or message guests") +
        renderPendingCards(data.pendingRequests) +
        renderPrimaryTable(data.primaryList)
      );
    },
    appointments: function () {
      return (
        pageHeader(labels.primary, "Full appointment list and queue status") +
        renderQueueBoard() +
        renderPrimaryTable(data.primaryList)
      );
    },
    service: function () {
      return pageHeader(labels.primary, "Dispatch board — drag jobs between stages in the full system") + renderKanban();
    },
    leads: function () {
      return pageHeader(labels.primary, "Lead inbox — quote, follow up, and mark won") + renderPipeline();
    },
  };

  var routes = {
    dashboard: function () {
      var fn = dashboards[vertical] || dashboards.booking;
      return fn();
    },
    primary: function () {
      var fn = primaryViews[vertical] || primaryViews.booking;
      return fn();
    },
    calendar: function () {
      return (
        pageHeader(labels.calendar, "Upcoming bookings and blocked dates") + renderCalendar()
      );
    },
    people: function () {
      return pageHeader(labels.people, "Customer records and visit history") + renderPeople();
    },
    settings: function () {
      return pageHeader("Settings", "Rates, hours, and business profile (demo)") + renderSettings();
    },
  };

  if (config.extraNav) {
    config.extraNav.forEach(function (item) {
      routes[item.id] = function () {
        return renderExtraPage(item.id);
      };
    });
  }

  function getRoute() {
    var hash = window.location.hash || "#/";
    if (hash === "#/" || hash === "#/dashboard") return "dashboard";
    var i;
    for (i = 0; i < NAV.length; i += 1) {
      if (hash.indexOf(NAV[i].hash.replace("#", "")) === 0 && NAV[i].id !== "dashboard") {
        return NAV[i].id;
      }
    }
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
