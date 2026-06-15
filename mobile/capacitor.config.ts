import type { CapacitorConfig } from "@capacitor/cli";

const webAppUrl = process.env.APP_WEB_URL?.trim() || "https://fifa.piodeportes.com";

const config: CapacitorConfig = {
  appId: "com.piodeportes.app",
  appName: "PIO Deportes",
  webDir: "www",
  server: {
    url: webAppUrl,
    cleartext: false
  },
  plugins: {
    SplashScreen: {
      launchAutoHide: true,
      backgroundColor: "#0f172a",
      showSpinner: false
    },
    StatusBar: {
      style: "DARK",
      backgroundColor: "#0f172a"
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
