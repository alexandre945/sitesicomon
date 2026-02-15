const COOKIE_NAME = "oem_session";

function encode(obj) {
  return Buffer.from(JSON.stringify(obj)).toString("base64url");
}

function decode(str) {
  return JSON.parse(Buffer.from(str, "base64url").toString("utf8"));
}

export function createSession({ ttlSeconds = 60 * 60 * 12 } = {}) {
  const now = Math.floor(Date.now() / 1000);
  return encode({ exp: now + ttlSeconds });
}

export function verifySession(token) {
  try {
    if (!token) return false;
    const data = decode(token);
    if (!data?.exp) return false;

    const now = Math.floor(Date.now() / 1000);
    return now < data.exp;
  } catch {
    return false;
  }
}

export const sessionCookieName = COOKIE_NAME;
