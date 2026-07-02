export type PushPlatform = "ios" | "android" | "web" | "unknown";

export type PushTokenRecord = {
  token: string;
  platform: PushPlatform;
  updatedAt: string;
};

export type PushSendPayload = {
  title: string;
  body: string;
  url?: string;
  tag?: string;
};
