export function isLikelyFcmToken(token: string): boolean {
  if (token.length < 80) return false;
  return /^[\w:/+\-=.]+$/.test(token);
}
