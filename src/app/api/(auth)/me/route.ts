import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import jwt, { JwtPayload } from "jsonwebtoken";

interface MyTokenPayload extends JwtPayload {
  role: "Super Admin" | "Admin" | "User";
  position:
    | "Manager"
    | "Mechanical Engineer"
    | "Electrical Engineer"
    | "StoreKeeper"
    | "Production Operator";
}
const TOKEN_SECRET = process.env.TOKEN_SECRET;

export async function GET(req: Request) {
  try {
    // 1. Get cookies
    const cookieStore = await cookies();
    const token = cookieStore.get("miniOdooApp")?.value;

    if (!token || !TOKEN_SECRET) {
      return NextResponse.json(
        { user: null, message: "Not authenticated" },
        { status: 401 }
      );
    }

    // 2. Decode the token
    const decodedToken = jwt.verify(token, TOKEN_SECRET!) as MyTokenPayload;

    // 3. Return user object
    return NextResponse.json({
      user: {
        role: decodedToken.role,
        position: decodedToken.position,
        username: decodedToken.username,
      },
    });
  } catch (err) {
    console.log(err);
    return NextResponse.json(
      { user: null, message: "Invalid or expired token" },
      { status: 401 }
    );
  }
}
