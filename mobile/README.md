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

## Identidad

- **App name:** PIO Deportes
- **Bundle ID:** `com.piodeportes.app`
- **Deep link scheme:** `piodeportes://`

## Scripts (desde raíz del repo)

```bash
npm run mobile:sync
npm run mobile:ios
npm run mobile:android
```
