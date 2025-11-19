"use server";

import { cookies } from "next/headers";
import jwt, { JwtPayload } from "jsonwebtoken";

interface MyTokenPayload extends JwtPayload {
  email: string;
  role: "Super Admin" | "Admin" | "User";
  position:
    | "Manager"
    | "Mechanical Engineer"
    | "Electrical Engineer"
    | "StoreKeeper"
    | "Production Operator";
}

const TOKEN_SECRET = process.env.TOKEN_SECRET;
// const SUPER_ADMIN_EMAIL = process.env.SUPER_ADMIN_EMAIL;

export async function checkToken() {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("miniOdooApp")?.value;

    if (!token || !TOKEN_SECRET) {
      return;
    }

    // 2. Decode the token
    const decodedToken = jwt.verify(token, TOKEN_SECRET!) as MyTokenPayload;
    const ROLE = decodedToken?.role;
    const EMAIL = decodedToken?.email;
    const POSITION = decodedToken?.position;
    return { ROLE, POSITION, EMAIL };
  } catch (error) {
    console.error("Token verification error:", error);
    return false;
  }
}
