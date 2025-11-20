import bcryptjs from "bcryptjs";

import { NextRequest, NextResponse } from "next/server";

import Employee from "@/db/models/employeeModel";
import { connectToDB } from "@/db/connectToDb";

const SUPER_ADMIN_EMAIL = process.env.SUPER_ADMIN_EMAIL;
export async function POST(req: NextRequest) {
  try {
    // Ensure the database is connected
    await connectToDB();

    // Parse the request data
    const data = await req.json();
    const { email, password, fullName } = data;
    const user = await Employee.findOne({ email });

    // Validate required fields

    if (!user && email !== SUPER_ADMIN_EMAIL) {
      return NextResponse.json(
        {
          message: "Oops! you do not have  an account in this app yet.",
        },
        { status: 400 }
      );
    }

    if (user && user.password) {
      return NextResponse.json(
        {
          message: "Oops! your account is already active, Please Sign in.",
        },
        { status: 400 }
      );
    }

    // Hash the password
    const salt = await bcryptjs.genSalt(10);
    const hashedPassword = await bcryptjs.hash(password, salt);
    if (email === SUPER_ADMIN_EMAIL) {
      const admin = {
        email,
        password: hashedPassword,
        role: "Super Admin",
        pin: "111111",
        fullName,
        position: "Manager",
      };
      await Employee.create(admin);
      return NextResponse.json(
        { message: "Super Admin account activited successfully" },
        { status: 200 }
      );
    }
    // Create and save the new user
    await Employee.findOneAndUpdate({ email }, { password: hashedPassword });

    return NextResponse.json(
      { message: "Account activited successfully!" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Signup error:", error);
    return NextResponse.json(
      { message: "Erreur lors de l'inscription." },
      { status: 500 }
    );
  }
}
