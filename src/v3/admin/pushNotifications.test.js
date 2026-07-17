import { mapping } from "../../mapping";
import {
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
    expect(mapping.adminPushTest).toBe("https://api.carlmanuel.com/admin/push/test");
  });

  test("ADMIN_PUSH_SW_PATH points at public service worker", () => {
    expect(ADMIN_PUSH_SW_PATH).toBe("/sw-admin-push.js");
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
