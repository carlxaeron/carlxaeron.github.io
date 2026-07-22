import {
  fetchPushVapidPublicKey,
  removePushSubscription,
  savePushSubscription,
} from "./adminApi";

/** Service worker script path (served from CRA public/). */
export const ADMIN_PUSH_SW_PATH = "/sw-admin-push.js";

/** Absolute HTTPS notification icon (matches public/sw-admin-push.js + Laravel push payload). */
export const ADMIN_PUSH_ICON_URL =
  "https://carlmanuel.com/static/images/pwa-icon-192.png";

export const ADMIN_PUSH_BADGE_URL = ADMIN_PUSH_ICON_URL;

export function isPushSupported() {
  if (typeof window === "undefined") return false;
  return (
    "serviceWorker" in navigator &&
    "PushManager" in window &&
    typeof Notification !== "undefined"
  );
}

export function getPushPermissionState() {
  if (typeof Notification === "undefined") return "unsupported";
  return Notification.permission;
}

/** Decode URL-safe base64 VAPID public key for PushManager.subscribe. */
export function urlBase64ToUint8Array(base64String) {
  const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding).replace(/-/g, "+").replace(/_/g, "/");
  const raw = window.atob(base64);
  const output = new Uint8Array(raw.length);
  for (let i = 0; i < raw.length; i += 1) {
    output[i] = raw.charCodeAt(i);
  }
  return output;
}

/** Normalize PushSubscription for Laravel POST /admin/push/subscribe. */
export function shapeSubscribePayload(subscription) {
  const json = typeof subscription.toJSON === "function" ? subscription.toJSON() : subscription;
  return {
    endpoint: json.endpoint,
    keys: {
      p256dh: json.keys?.p256dh,
      auth: json.keys?.auth,
    },
  };
}

export function extractVapidPublicKey(response) {
  if (!response || typeof response !== "object") return "";
  if (typeof response.publicKey === "string") return response.publicKey;
  if (typeof response.vapidPublicKey === "string") return response.vapidPublicKey;
  if (response.data && typeof response.data === "object") {
    return extractVapidPublicKey(response.data);
  }
  return "";
}

export async function ensureAdminPushServiceWorker() {
  if (!isPushSupported()) {
    throw new Error("Web Push is not supported in this browser.");
  }

  const existing = await navigator.serviceWorker.getRegistration("/");
  if (existing?.active) {
    return existing;
  }

  return navigator.serviceWorker.register(ADMIN_PUSH_SW_PATH, { scope: "/" });
}

export async function refreshPushSubscriptionState() {
  if (!isPushSupported()) {
    return {
      supported: false,
      permission: "unsupported",
      subscribed: false,
      subscription: null,
    };
  }

  const permission = Notification.permission;
  try {
    const registration = await navigator.serviceWorker.getRegistration("/");
    if (!registration) {
      return { supported: true, permission, subscribed: false, subscription: null };
    }
    const subscription = await registration.pushManager.getSubscription();
    return {
      supported: true,
      permission,
      subscribed: Boolean(subscription),
      subscription,
    };
  } catch {
    return { supported: true, permission, subscribed: false, subscription: null };
  }
}

export async function enableAdminPush() {
  const registration = await ensureAdminPushServiceWorker();
  await navigator.serviceWorker.ready;

  const permission = await Notification.requestPermission();
  if (permission !== "granted") {
    throw new Error(
      permission === "denied"
        ? "Notification permission was denied."
        : "Notification permission was not granted."
    );
  }

  const vapidResponse = await fetchPushVapidPublicKey();
  const publicKey = extractVapidPublicKey(vapidResponse);
  if (!publicKey) {
    throw new Error("VAPID public key was not returned by the API.");
  }

  let subscription = await registration.pushManager.getSubscription();
  if (!subscription) {
    subscription = await registration.pushManager.subscribe({
      userVisibleOnly: true,
      applicationServerKey: urlBase64ToUint8Array(publicKey),
    });
  }

  const payload = shapeSubscribePayload(subscription);
  await savePushSubscription({
    ...payload,
    userAgent: navigator.userAgent,
  });

  return subscription;
}

export async function disableAdminPush() {
  const registration = await navigator.serviceWorker.getRegistration("/");
  const subscription = registration
    ? await registration.pushManager.getSubscription()
    : null;

  if (subscription) {
    const { endpoint } = subscription;
    await removePushSubscription(endpoint);
    await subscription.unsubscribe();
  }
}

export function getPushStatusLabel(state) {
  if (!state.supported) return "Not supported";
  if (state.permission === "denied") return "Permission denied";
  if (state.subscribed) return "Subscribed";
  return "Not subscribed";
}
