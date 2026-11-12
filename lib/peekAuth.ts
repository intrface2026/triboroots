import { createHmac, timingSafeEqual } from "crypto";

export const PEEK_COOKIE_NAME = "triboroots_peek";

function getSecret(): string {
  return (
    process.env.PEEK_COOKIE_SECRET ||
    "triboroots-trail-peek-signing-secret-v1"
  );
}

/**
 * Creates a compact HMAC-SHA256 signed token proving a visitor submitted
 * the sneak-peek form before viewing the main TriboRoots preview.
 */
export function signPeekToken(email: string): string {
  const payload = Buffer.from(
    JSON.stringify({
      email: email.toLowerCase(),
      iat: Date.now(),
    }),
  ).toString("base64url");

  const sig = createHmac("sha256", getSecret())
    .update(payload)
    .digest("base64url");

  return `${payload}.${sig}`;
}

/** Verifies a cookie token created by signPeekToken using timing-safe comparison. */
export function verifyPeekToken(token: string | undefined): boolean {
  if (!token) return false;
  const parts = token.split(".");
  if (parts.length !== 2) return false;
  const [payload, sig] = parts;
  if (!payload || !sig) return false;

  const expected = createHmac("sha256", getSecret())
    .update(payload)
    .digest("base64url");

  const a = Buffer.from(sig);
  const b = Buffer.from(expected);
  if (a.length !== b.length) return false;
  return timingSafeEqual(a, b);
}

