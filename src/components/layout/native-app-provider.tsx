"use client";

import { useEffect } from "react";
import { isNativeApp } from "@/lib/native-app";
import { bindNativePushLifecycle, registerNativePushNotifications } from "@/lib/native-push";

export function NativeAppProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    if (!isNativeApp()) return;
    document.documentElement.classList.add("native-app");
    document.documentElement.setAttribute("data-native-app", "true");
    void registerNativePushNotifications();
    const unbindPushLifecycle = bindNativePushLifecycle();
    return () => {
      document.documentElement.classList.remove("native-app");
      document.documentElement.removeAttribute("data-native-app");
      unbindPushLifecycle();
    };
  }, []);

  return children;
}
