import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";

export async function middleware(req: NextRequest) {
  const token = await getToken({ req });
  const { pathname } = req.nextUrl;

  // Allow public access to auth and homepage
  if (pathname.startsWith("/api/auth") || pathname === "/") {
    return NextResponse.next();
  }

  // Redirect unauthenticated users away from protected routes
  if (!token && (pathname.startsWith("/dashboard") || pathname === "/onboarding")) {
    return NextResponse.redirect(new URL("/api/auth/signin", req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*", "/onboarding", "/api/:path*"],
};
