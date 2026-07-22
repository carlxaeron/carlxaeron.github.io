import { mapping } from "../../mapping";
import {
  ADMIN_PUSH_BADGE_URL,
  ADMIN_PUSH_ICON_URL,
  ADMIN_PUSH_SW_PATH,
  extractVapidPublicKey,
  getPushPermissionState,
  getPushStatusLabel,
  isPushSupported,
  shapeSubscribePayload,
  urlBase64ToUint8Array,
} from "./pushNotifications";

describe("pushNotifications helpers", () => {
  const originalNotification = global.Notification;
  const originalNavigator = global.navigator;

  afterEach(() => {
    global.Notification = originalNotification;
    Object.defineProperty(global, "navigator", {
      value: originalNavigator,
      configurable: true,
      writable: true,
    });
  });

  test("mapping exposes admin push endpoints", () => {
    expect(mapping.adminPushVapidPublicKey).toBe(
      "https://api.carlmanuel.com/admin/push/vapidPublicKey"
    );
    expect(mapping.adminPushSubscribe).toBe(
      "https://api.carlmanuel.com/admin/push/subscribe"
    );
    expect(mapping.adminPushTest).toBe("https://api.carlmanuel.com/admin/push/sendPing");
  });

  test("ADMIN_PUSH_SW_PATH points at public service worker", () => {
    expect(ADMIN_PUSH_SW_PATH).toBe("/sw-admin-push.js");
  });

  test("ADMIN_PUSH_ICON_URL uses absolute HTTPS profile PWA icon", () => {
    expect(ADMIN_PUSH_ICON_URL).toBe(
      "https://carlmanuel.com/static/images/pwa-icon-192.png"
    );
    expect(ADMIN_PUSH_BADGE_URL).toBe(ADMIN_PUSH_ICON_URL);
    expect(ADMIN_PUSH_ICON_URL.startsWith("https://")).toBe(true);
  });

  test("public sw-admin-push.js defaults to the same absolute icon URLs", () => {
    // eslint-disable-next-line global-require
    const fs = require("fs");
    // eslint-disable-next-line global-require
    const path = require("path");
    const swPath = path.join(__dirname, "../../../public/sw-admin-push.js");
    const sw = fs.readFileSync(swPath, "utf8");
    expect(sw).toContain(ADMIN_PUSH_ICON_URL);
    expect(sw).toContain("payload.icon || ADMIN_PUSH_ICON");
    expect(sw).toContain("payload.badge || ADMIN_PUSH_BADGE");
  });

  test("manifest.json references profile PWA icons", () => {
    // eslint-disable-next-line global-require
    const fs = require("fs");
    // eslint-disable-next-line global-require
    const path = require("path");
    const manifest = JSON.parse(
      fs.readFileSync(path.join(__dirname, "../../../public/manifest.json"), "utf8")
    );
    const srcs = (manifest.icons || []).map((icon) => icon.src);
    expect(srcs).toContain("/static/images/pwa-icon-192.png");
    expect(srcs).toContain("/static/images/pwa-icon-512.png");
    expect(srcs).toContain("/static/images/pwa-icon-maskable-512.png");
  });

  test("isPushSupported detects PushManager availability", () => {
    Object.defineProperty(global, "navigator", {
      value: { serviceWorker: {} },
      configurable: true,
      writable: true,
    });
    global.Notification = function NotificationMock() {};
    global.PushManager = function PushManagerMock() {};

    expect(isPushSupported()).toBe(true);

    delete global.PushManager;
    expect(isPushSupported()).toBe(false);
  });

  test("getPushPermissionState returns unsupported without Notification API", () => {
    delete global.Notification;
    expect(getPushPermissionState()).toBe("unsupported");
  });

  test("urlBase64ToUint8Array decodes URL-safe base64", () => {
    const input = "BM7T0BYx3UyA0lPO61fY0A";
    const bytes = urlBase64ToUint8Array(input);
    expect(bytes).toBeInstanceOf(Uint8Array);
    expect(bytes.length).toBeGreaterThan(0);
  });

  test("shapeSubscribePayload maps PushSubscription JSON for Laravel", () => {
    const subscription = {
      toJSON() {
        return {
          endpoint: "https://push.example/sub/abc",
          keys: {
            p256dh: "p256-key",
            auth: "auth-key",
          },
        };
      },
    };

    expect(shapeSubscribePayload(subscription)).toEqual({
      endpoint: "https://push.example/sub/abc",
      keys: {
        p256dh: "p256-key",
        auth: "auth-key",
      },
    });
  });

  test("extractVapidPublicKey handles common API shapes", () => {
    expect(extractVapidPublicKey({ publicKey: "abc" })).toBe("abc");
    expect(extractVapidPublicKey({ vapidPublicKey: "def" })).toBe("def");
    expect(extractVapidPublicKey({ data: { publicKey: "nested" } })).toBe("nested");
    expect(extractVapidPublicKey(null)).toBe("");
  });

  test("getPushStatusLabel reflects support, permission, and subscription", () => {
    expect(
      getPushStatusLabel({ supported: false, permission: "default", subscribed: false })
    ).toBe("Not supported");
    expect(
      getPushStatusLabel({ supported: true, permission: "denied", subscribed: false })
    ).toBe("Permission denied");
    expect(
      getPushStatusLabel({ supported: true, permission: "granted", subscribed: true })
    ).toBe("Subscribed");
    expect(
      getPushStatusLabel({ supported: true, permission: "default", subscribed: false })
    ).toBe("Not subscribed");
  });
});

describe("pushNotifications subscribe flow (mocked PushManager)", () => {
  test("shapeSubscribePayload works with mock subscription object", async () => {
    const mockSubscription = {
      endpoint: "https://fcm.googleapis.com/fcm/send/device-id",
      toJSON() {
        return {
          endpoint: this.endpoint,
          keys: { p256dh: "mock-p256", auth: "mock-auth" },
        };
      },
    };

    const payload = shapeSubscribePayload(mockSubscription);
    expect(payload.endpoint).toContain("fcm.googleapis.com");
    expect(payload.keys.p256dh).toBe("mock-p256");
    expect(payload.keys.auth).toBe("mock-auth");
  });
});
