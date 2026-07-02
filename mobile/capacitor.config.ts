import type { CapacitorConfig } from "@capacitor/cli";

const webAppUrl = process.env.APP_WEB_URL?.trim() || "https://fifa.piodeportes.com";

const config: CapacitorConfig = {
  appId: "com.piodeportes.app",
  appName: "PIO Deportes",
  appendUserAgent: " PIODeportesApp Capacitor",
  webDir: "www",
  server: {
    url: webAppUrl,
    cleartext: webAppUrl.startsWith("http://")
  },
  plugins: {
    SplashScreen: {
      launchAutoHide: true,
      backgroundColor: "#E00000",
      showSpinner: false
    },
    StatusBar: {
      style: "LIGHT",
      backgroundColor: "#000000",
      overlaysWebView: false
    },
    FirebaseMessaging: {
      presentationOptions: ["badge", "sound", "alert"]
    }
  },
  android: {
    allowMixedContent: false
  },
  ios: {
    contentInset: "automatic",
    scrollEnabled: true
  }
};

export default config;
