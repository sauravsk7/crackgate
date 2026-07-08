import NextAuth from "next-auth";
import { authConfig } from "@/lib/auth.config";
import { NextResponse } from "next/server";
import { isMutation, isCsrfExempt, verifyOrigin } from "@/lib/csrf";

const { auth } = NextAuth(authConfig);

const PROTECTED = ["/dashboard", "/settings", "/admin"];

export default auth((req) => {
  const path = req.nextUrl.pathname;

  // ── CSRF protection for API mutation endpoints ────────
  if (path.startsWith("/api/") && isMutation(req) && !isCsrfExempt(path)) {
    if (!verifyOrigin(req)) {
      return NextResponse.json(
        { error: "CSRF validation failed" },
        { status: 403 },
      );
    }
  }

  // ── Page route auth ───────────────────────────────────
  const needsAuth = PROTECTED.some((p) => path === p || path.startsWith(p + "/"));
  if (needsAuth && !req.auth) {
    const url = new URL("/login", req.nextUrl.origin);
    url.searchParams.set("next", path);
    return NextResponse.redirect(url);
  }
  if (path.startsWith("/admin") && req.auth?.user?.role !== "admin") {
    return NextResponse.redirect(new URL("/dashboard", req.nextUrl.origin));
  }
});

export const config = {
  matcher: ["/dashboard/:path*", "/settings/:path*", "/admin/:path*", "/api/:path*"],
};
