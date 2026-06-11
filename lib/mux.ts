import "server-only";

import jwt from "jsonwebtoken";

export function signPlayback(playbackId: string): string {
  const keyId = process.env.MUX_SIGNING_KEY_ID;
  const keyPrivate = process.env.MUX_SIGNING_KEY_PRIVATE;

  if (!keyId || !keyPrivate) {
    throw new Error("Mux signing keys are not configured");
  }

  const key = Buffer.from(keyPrivate, "base64").toString("utf8");

  return jwt.sign(
    { sub: playbackId, aud: "v", exp: Math.floor(Date.now() / 1000) + 60 * 60 },
    key,
    { algorithm: "RS256", keyid: keyId },
  );
}
