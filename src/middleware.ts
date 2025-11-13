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
    "/api/employees",
    "/api/employees/:path*",
    "/api/tollMovements",
    "/api/toolMovements/:path",
    "/api/tools",
    "/api/tools/:path*",
    "/signup",
    "/signin",
    "/forgot-password",
    "/reset-password",
  ],
};
