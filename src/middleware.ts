import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname;
  const isPublic =
    path === "/signin" ||
    path === "/signup" ||
    path === "/forgot-password" ||
    path === "/reset-password";
  const token = request.cookies.get("miniOdooApp")?.value || "";

  // If the user has a token and tries to access a public page, redirect to home
  if (isPublic && token) {
    return NextResponse.redirect(new URL("/", request.nextUrl));
  }

  // If the user doesn't have a token and tries to access a protected page, redirect to login
  if (!isPublic && !token) {
    return NextResponse.redirect(new URL("/signin", request.nextUrl));
  }
}

// Apply middleware to specific routes
export const config = {
  matcher: [
    "/",
    "/tools",
    "/tools/new",
    "/tools/edit:path*",
    "/employees",
    "/employees/new",
    "/employees/edit:path*",
    "/movements",
    "/movements/new",
    "/movement/:path*",
    "/api",
    "/signup",
    "/signin",
    "/forgot-password",
    "/reset-password",
  ],
};
