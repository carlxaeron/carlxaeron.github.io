/* Admin Web Push service worker — registered only from Admin Settings. */

/** Absolute HTTPS URLs — required by many mobile browsers for notification icons. */
var ADMIN_PUSH_ICON =
  "https://carlmanuel.com/static/images/pwa-icon-192.png";
var ADMIN_PUSH_BADGE =
  "https://carlmanuel.com/static/images/pwa-icon-192.png";

self.addEventListener("push", (event) => {
  let payload = {};
  if (event.data) {
    try {
      payload = event.data.json();
    } catch {
      payload = { body: event.data.text() };
    }
  }

  const title = payload.title || "Carl Manuel Admin";
  const options = {
    body: payload.body || "New admin notification",
    icon: payload.icon || ADMIN_PUSH_ICON,
    badge: payload.badge || ADMIN_PUSH_BADGE,
    tag: payload.tag || "admin-push",
    renotify: true,
    data: {
      url: payload.url || payload.data?.url || "https://carlmanuel.com/#admin",
      ...(payload.data || {}),
    },
  };

  event.waitUntil(self.registration.showNotification(title, options));
});

self.addEventListener("notificationclick", (event) => {
  event.notification.close();

  const targetUrl =
    event.notification.data?.url || "https://carlmanuel.com/#admin";

  event.waitUntil(
    self.clients.matchAll({ type: "window", includeUncontrolled: true }).then((clients) => {
      for (const client of clients) {
        if ("focus" in client) {
          const href = client.url || "";
          if (href.includes("carlmanuel.com") || href.includes("localhost")) {
            return client.focus().then((focused) => {
              if ("navigate" in focused && typeof focused.navigate === "function") {
                return focused.navigate(targetUrl);
              }
              return focused;
            });
          }
        }
      }
      if (self.clients.openWindow) {
        return self.clients.openWindow(targetUrl);
      }
      return undefined;
    })
  );
});
