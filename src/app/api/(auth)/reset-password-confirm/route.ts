import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { connectToDB } from "@/db/connectToDb";
import Employee from "@/db/models/employeeModel";

export async function POST(request: NextRequest) {
  await connectToDB();

  const { password, token } = await request.json();

  const user = await Employee.findOne({
    verifyToken: token,
    verifyTokenExpiry: { $gt: Date.now() },
  });

  if (!user) {
    return NextResponse.json(
      { message: "Invalid or expired token." },
      { status: 400 }
    );
  }

  const hashedPassword = await bcrypt.hash(password, 12);
  user.password = hashedPassword;
  user.resetToken = undefined;
  user.resetTokenExpiration = undefined;
  await user.save();

  return NextResponse.json({
    message: "Password reset successfully.",
  });
}
