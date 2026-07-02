"use client";

"use client";

import { isNativeApp } from "@/lib/native-app";
import type { PushPlatform } from "@/lib/push/types";

function resolvePlatform(): PushPlatform {
  const capacitor = (window as Window & { Capacitor?: { getPlatform?: () => string } }).Capacitor;
  const platform = capacitor?.getPlatform?.();
  if (platform === "ios" || platform === "android" || platform === "web") {
    return platform;
  }
  return "unknown";
}

async function postToken(token: string, platform: PushPlatform) {
  const res = await fetch("/api/push/register", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ token, platform })
  });

  if (!res.ok) {
    console.warn("[push] register failed", res.status);
  }
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

export async function registerNativePushNotifications(): Promise<void> {
  if (!isNativeApp()) return;

  try {
    const { FirebaseMessaging } = await import("@capacitor-firebase/messaging");

    const permission = await FirebaseMessaging.checkPermissions();
    if (permission.receive !== "granted") {
      const requested = await FirebaseMessaging.requestPermissions();
      if (requested.receive !== "granted") {
        return;
      }
    }

    const { token } = await FirebaseMessaging.getToken();
    if (token) {
      await postToken(token, resolvePlatform());
    }

    await FirebaseMessaging.addListener("tokenReceived", async (event) => {
      if (event.token) {
        await postToken(event.token, resolvePlatform());
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
  } catch (error) {
    console.warn("[push] native registration unavailable", error);
  }
}

export async function unregisterNativePushToken(token: string): Promise<void> {
  if (!token) return;
  await deleteToken(token);
}
