import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";


const sessionCookieName = "session"; // mesmo nome da API

export function middleware(req: NextRequest) {
    console.log("MIDDLEWARE RODOU:", req.nextUrl.pathname);
  const { pathname } = req.nextUrl;
  const token = req.cookies.get(sessionCookieName)?.value;

  // 🔓 libera login sempre
  if (pathname.startsWith("/login") || pathname.startsWith("/api")) {
    return NextResponse.next();
  }

  // 📍 raiz do sistema
  if (pathname === "/") {
    if (!token) {
      return NextResponse.redirect(new URL("/login", req.url));
    }

    return NextResponse.redirect(new URL("/admin", req.url));
  }

  // 🔒 protege admin
  if (pathname.startsWith("/admin")) {
    if (!token) {
      return NextResponse.redirect(new URL("/login", req.url));
    }
  }

  return NextResponse.next();
}
