import { NextResponse } from "next/server";
import { createSession, sessionCookieName } from "../../../../lib/auth.js";

export async function POST(req) {
  const { password } = await req.json().catch(() => ({}));

  const expected = process.env.APP_PASSWORD || "";
  const received = typeof password === "string" ? password : "";

  if (!expected || received !== expected) {
    return NextResponse.json(
      { ok: false, error: "Senha inválida" },
      { status: 401 }
    );
  }

  const token = createSession({ ttlSeconds: 60 * 60 * 12 }); // 12h
  // const token = createSession({ ttlSeconds: 10 }); // 10 segundos


  const res = NextResponse.json({ ok: true });
  res.cookies.set(sessionCookieName, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
  });

  return res;
}
