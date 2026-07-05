"use client";

import { isNativeApp } from "@/lib/native-app";
import type { PushPlatform } from "@/lib/push/types";

let listenersAttached = false;

type CapacitorWindow = Window & {
  Capacitor?: {
    isNativePlatform?: () => boolean;
    isPluginAvailable?: (name: string) => boolean;
    getPlatform?: () => string;
  };
};

function resolvePlatform(): PushPlatform {
  const capacitor = (window as CapacitorWindow).Capacitor;
  const platform = capacitor?.getPlatform?.();
  if (platform === "ios" || platform === "android" || platform === "web") {
    return platform;
  }
  return "unknown";
}

async function waitForNativeBridge(maxAttempts = 40, delayMs = 250): Promise<boolean> {
  for (let attempt = 0; attempt < maxAttempts; attempt += 1) {
    const capacitor = (window as CapacitorWindow).Capacitor;
    if (capacitor?.isNativePlatform?.()) {
      return true;
    }
    await new Promise((resolve) => window.setTimeout(resolve, delayMs));
  }
  return isNativeApp();
}

async function postToken(token: string, platform: PushPlatform): Promise<boolean> {
  const res = await fetch("/api/push/register", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ token, platform })
  });

  if (!res.ok) {
    const body = (await res.json().catch(() => null)) as { error?: string } | null;
    console.warn("[push] register failed", res.status, body?.error ?? "");
    return false;
  }

  return true;
}

async function deleteToken(token: string) {
  await fetch("/api/push/register", {
    method: "DELETE",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ token })
  });
}

function openNotificationUrl(url?: string) {
  if (!url) return;
  try {
    const target = new URL(url, window.location.origin);
    window.location.assign(target.pathname + target.search + target.hash);
  } catch {
    window.location.assign(url);
  }
}

function getNotificationUrl(data: unknown): string | undefined {
  if (!data || typeof data !== "object") return undefined;
  const url = (data as Record<string, unknown>).url;
  return typeof url === "string" ? url : undefined;
}

async function readFcmToken(): Promise<string | null> {
  const { FirebaseMessaging } = await import("@capacitor-firebase/messaging");

  try {
    const { token } = await FirebaseMessaging.getToken();
    return token ?? null;
  } catch (error) {
    console.warn("[push] getToken failed, waiting for tokenReceived", error);
    return null;
  }
}

async function syncPushToken(): Promise<void> {
  const ready = await waitForNativeBridge();
  if (!ready) {
    console.warn("[push] native bridge unavailable");
    return;
  }

  const { FirebaseMessaging } = await import("@capacitor-firebase/messaging");

  const permission = await FirebaseMessaging.checkPermissions();
  if (permission.receive !== "granted") {
    const requested = await FirebaseMessaging.requestPermissions();
    if (requested.receive !== "granted") {
      console.warn("[push] notification permission denied — enable in iOS Settings → PIO Deportes → Notifications");
      return;
    }
  }

  const platform = resolvePlatform();
  for (let attempt = 0; attempt < 8; attempt += 1) {
    const token = await readFcmToken();
    if (token) {
      const saved = await postToken(token, platform);
      if (saved) {
        console.info("[push] token registered");
      }
      return;
    }
    await new Promise((resolve) => window.setTimeout(resolve, 1000));
  }

  console.warn("[push] FCM token unavailable after retries — will register on tokenReceived");
}

async function attachPushListeners(): Promise<void> {
  if (listenersAttached) return;

  const { FirebaseMessaging } = await import("@capacitor-firebase/messaging");

  await FirebaseMessaging.addListener("tokenReceived", async (event) => {
    if (event.token) {
      const saved = await postToken(event.token, resolvePlatform());
      if (saved) {
        console.info("[push] token registered from tokenReceived");
      }
    }
  });

  await FirebaseMessaging.addListener("notificationActionPerformed", (event) => {
    const url = getNotificationUrl(event.notification?.data);
    if (url) {
      openNotificationUrl(url);
    }
  });

  await FirebaseMessaging.addListener("notificationReceived", (event) => {
    const url = getNotificationUrl(event.notification?.data);
    if (url && document.visibilityState === "visible") {
      openNotificationUrl(url);
    }
  });

  listenersAttached = true;
}

export async function registerNativePushNotifications(): Promise<void> {
  if (!isNativeApp()) return;

  try {
    await attachPushListeners();
    await syncPushToken();
  } catch (error) {
    console.warn("[push] native registration unavailable", error);
  }
}

export function bindNativePushLifecycle(): () => void {
  if (!isNativeApp()) return () => undefined;

  const onVisible = () => {
    if (document.visibilityState === "visible") {
      void registerNativePushNotifications();
    }
  };

  document.addEventListener("visibilitychange", onVisible);
  return () => document.removeEventListener("visibilitychange", onVisible);
}

export async function unregisterNativePushToken(token: string): Promise<void> {
  if (!token) return;
  await deleteToken(token);
}
