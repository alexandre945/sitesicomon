import { NextResponse } from "next/server";

export function middleware(req) {
  const { pathname } = req.nextUrl;

  // 🔥 REGRA ABSOLUTA: API NUNCA REDIRECIONA
  if (pathname.startsWith("/api/")) {
    // libera auth
    if (
      pathname.startsWith("/api/auth/login") ||
      pathname.startsWith("/api/auth/logout")
    ) {
      return NextResponse.next();
    }

    // qualquer outra API sem sessão → 401 JSON
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // 🔐 páginas protegidas
  if (pathname !== "/login") {
    const url = req.nextUrl.clone();
    url.pathname = "/login";
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next|favicon.ico).*)"],
};
