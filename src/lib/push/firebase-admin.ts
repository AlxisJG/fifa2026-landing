import { cert, getApps, initializeApp, type App } from "firebase-admin/app";
import { getMessaging, type Messaging } from "firebase-admin/messaging";
import type { PushSendPayload } from "@/lib/push/types";

let messagingClient: Messaging | null | undefined;

function getFirebaseAdminApp(): App | null {
  if (getApps().length > 0) {
    return getApps()[0]!;
  }

  const projectId = process.env.FIREBASE_PROJECT_ID?.trim();
  const clientEmail = process.env.FIREBASE_CLIENT_EMAIL?.trim();
  const privateKey = process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, "\n").trim();

  if (!projectId || !clientEmail || !privateKey) {
    return null;
  }

  try {
    return initializeApp({
      credential: cert({ projectId, clientEmail, privateKey })
    });
  } catch {
    return null;
  }
}

function getMessagingClient(): Messaging | null {
  if (messagingClient !== undefined) return messagingClient;

  const app = getFirebaseAdminApp();
  if (!app) {
    messagingClient = null;
    return null;
  }

  messagingClient = getMessaging(app);
  return messagingClient;
}

export function isFirebaseAdminConfigured(): boolean {
  try {
    return getMessagingClient() !== null;
  } catch {
    return false;
  }
}

export async function sendPushToTokens(
  tokens: string[],
  payload: PushSendPayload
): Promise<{ successCount: number; failureCount: number; invalidTokens: string[] }> {
  const messaging = getMessagingClient();
  if (!messaging || tokens.length === 0) {
    return { successCount: 0, failureCount: tokens.length, invalidTokens: [] };
  }

  const invalidTokens: string[] = [];
  let successCount = 0;
  let failureCount = 0;

  const chunkSize = 500;
  for (let i = 0; i < tokens.length; i += chunkSize) {
    const chunk = tokens.slice(i, i + chunkSize);
    const response = await messaging.sendEachForMulticast({
      tokens: chunk,
      notification: {
        title: payload.title,
        body: payload.body
      },
      data: {
        ...(payload.url ? { url: payload.url } : {}),
        ...(payload.tag ? { tag: payload.tag } : {})
      },
      android: {
        priority: "high",
        notification: {
          clickAction: "FCM_PLUGIN_ACTIVITY"
        }
      },
      apns: {
        payload: {
          aps: {
            sound: "default",
            badge: 1
          }
        }
      }
    });

    successCount += response.successCount;
    failureCount += response.failureCount;

    response.responses.forEach((result, index) => {
      if (result.success) return;
      const code = result.error?.code ?? "";
      if (
        code.includes("registration-token-not-registered") ||
        code.includes("invalid-registration-token")
      ) {
        invalidTokens.push(chunk[index]!);
      }
    });
  }

  return { successCount, failureCount, invalidTokens };
}
