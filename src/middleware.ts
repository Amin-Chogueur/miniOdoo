import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import jwt, { JwtPayload } from "jsonwebtoken";
import { Position, Role } from "./constants/constants";

const TOKEN_SECRET = process.env.TOKEN_SECRET;

interface MyTokenPayload extends JwtPayload {
  role: "Super Admin" | "Admin" | "User";
  position:
    | "Manager"
    | "Mechanical Engineer"
    | "Electrical Engineer"
    | "StoreKeeper"
    | "Production Operator";
}

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

  const token = request.cookies.get("miniOdooApp")?.value;

  let decodedToken: MyTokenPayload | null = null;

  if (token) {
    try {
      decodedToken = jwt.verify(token, TOKEN_SECRET!) as MyTokenPayload;
    } catch (err) {
      console.error("Invalid token:", err);
      // Invalid token: remove it
      const res = NextResponse.redirect(new URL("/signin", request.nextUrl));
      res.cookies.delete("miniOdooApp");
      return res;
    }
  }

  // Redirect authenticated users away from auth pages
  if (isPublic && decodedToken) {
    return NextResponse.redirect(new URL("/", request.nextUrl));
  }

  // Redirect unauthenticated users away from protected pages
  if (!isPublic && !decodedToken) {
    return NextResponse.redirect(new URL("/signin", request.nextUrl));
  }

  // Role-based access control
  if (decodedToken) {
    const { role, position } = decodedToken;

    // Only Super Admin can access these pages
    if (
      role !== Role.SUPER_ADMIN &&
      (path.startsWith("/employees/") || path.startsWith("/tools/"))
    ) {
      return NextResponse.redirect(new URL("/", request.nextUrl));
    }

    // Only users with STORE_KEEPER position can access movements/new

    const isMovementPath =
      path === "/movements/new" || path.startsWith("/movements/");
    if (
      isMovementPath &&
      !(role === Role.USER && position === Position.STORE_KEEPER)
    ) {
      return NextResponse.redirect(new URL("/movements", request.nextUrl));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/",
    "/tools",
    "/tools/new",
    "/tools/edit/:path*",
    "/employees",
    "/employees/new",
    "/employees/edit/:path*",
    "/movements",
    "/movements/new",
    "/movements/:path*",
    "/api/employees",
    "/api/employees/by-pin/:path*",
    "/api/employees/:path*",
    "/api/tollMovements",
    "/api/toolMovements/:path*",
    "/api/tools",
    "/api/tools/:path*",
    "/signup",
    "/signin",
    "/forgot-password",
    "/reset-password",
  ],
  runtime: "nodejs", // allows jwt.verify to work
};
