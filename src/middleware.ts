import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname;

  // Define public routes
  const publicPaths = [
    "/signin",
    "/signup",
    "/forgot-password",
    "/reset-password",
  ];
  const isPublic = publicPaths.some((p) => path.startsWith(p));

  const token = request.cookies.get("miniOdooApp")?.value || "";

  // Redirect authenticated users away from auth pages
  if (isPublic && token) {
    return NextResponse.redirect(new URL("/", request.nextUrl));
  }

  // Redirect unauthenticated users away from protected pages
  if (!isPublic && !token) {
    return NextResponse.redirect(new URL("/signin", request.nextUrl));
  }
}

export const config = {
  // Apply to all routes except static files and Next internals
  matcher: [
    "/((?!_next|api/auth|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
