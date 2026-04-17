import { NextResponse } from "next/server";
import { computeSessionToken } from "./lib/operator-session.js";

export async function middleware(request) {
  const { pathname } = request.nextUrl;

  if (pathname === "/operator/login" || pathname.startsWith("/operator/login/")) {
    return NextResponse.next();
  }

  if (pathname === "/operator" || pathname.startsWith("/operator/")) {
    const secret = process.env.OPERATOR_SESSION_SECRET;
    const cookie = request.cookies.get("operator_session")?.value;
    const expected = await computeSessionToken(secret);

    if (!secret || !cookie || cookie !== expected) {
      const login = new URL("/operator/login", request.url);
      login.searchParams.set("from", pathname);
      return NextResponse.redirect(login);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/operator", "/operator/:path*"],
};
