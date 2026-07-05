# PIO Deportes — Mobile (Capacitor)

Shell nativo iOS/Android para la plataforma PIO Deportes. La app carga la web en producción vía WebView.

## Requisitos

- Node.js 20+
- Xcode + **CocoaPods** (iOS): `sudo gem install cocoapods` o `brew install cocoapods`
- Android Studio (Android)
- Cuentas Apple Developer y Google Play Console

## Setup

```bash
cd mobile
npm install
npx cap sync
```

## Desarrollo

Tras instalar CocoaPods (solo iOS):

```bash
npx cap add ios   # una vez, si aún no existe mobile/ios
npx cap sync
```

Abrir proyecto nativo:

```bash
npm run cap:open:ios
npm run cap:open:android
```

## Configuración

| Variable | Descripción |
|---|---|
| `APP_WEB_URL` | URL del WebView (default: `https://fifa.piodeportes.com`) |

Editar en [`capacitor.config.ts`](./capacitor.config.ts) o exportar antes de `cap sync`:

```bash
APP_WEB_URL=https://fifa.piodeportes.com npx cap sync
```

## Push notifications (Firebase)

1. Descarga `GoogleService-Info.plist` desde Firebase Console (app iOS `com.piodeportes.app`).
2. Colócalo en `ios/App/App/GoogleService-Info.plist`.
3. En Xcode, arrastra el archivo al target **App** y marca **Copy items if needed** + target **App** en *Add to targets*.
4. Sin este archivo en el bundle, push no funciona; versiones anteriores podían cerrarse al abrir si Firebase se inicializaba sin el plist.
5. **TestFlight / App Store** usan build **Release** con `AppRelease.entitlements` (`aps-environment: production`). Debug usa `AppDebug.entitlements` (`development`). Tras cambiar entitlements, sube un build nuevo a TestFlight.
6. Firebase Console → app iOS → **Cloud Messaging** → sube la **APNs Authentication Key** (`.p8`) de Apple Developer.
7. `AppDelegate.swift` debe incluir los callbacks de APNs (`didRegisterForRemoteNotificationsWithDeviceToken`, etc.) requeridos por `@capacitor-firebase/messaging`.

Los tokens FCM se guardan en Upstash Redis (`push:tokens:index`) cuando la app nativa abre y el usuario acepta notificaciones.

- **App name:** PIO Deportes
- **Bundle ID:** `com.piodeportes.app`
- **Deep link scheme:** `piodeportes://`

## Scripts (desde raíz del repo)

```bash
npm run mobile:sync
npm run mobile:ios
npm run mobile:android
```
