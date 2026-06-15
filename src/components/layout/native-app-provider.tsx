"use client";

import { useEffect } from "react";
import { isNativeApp } from "@/lib/native-app";

export function NativeAppProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    if (!isNativeApp()) return;
    document.documentElement.classList.add("native-app");
    document.documentElement.setAttribute("data-native-app", "true");
    return () => {
      document.documentElement.classList.remove("native-app");
      document.documentElement.removeAttribute("data-native-app");
    };
  }, []);

  return children;
}
