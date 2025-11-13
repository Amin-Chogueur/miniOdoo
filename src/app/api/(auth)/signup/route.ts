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
    const { fullName, email, password, role, position } = data;

    // Validate required fields
    if (email !== SUPER_ADMIN_EMAIL) {
      return NextResponse.json(
        {
          message:
            "Currently Only the Super Admin is allowed to axess the app.",
        },
        { status: 400 }
      );
    }
    // Check if user already exists
    const isExist = await Employee.findOne({ email });
    if (isExist) {
      return NextResponse.json(
        { message: "Error: this email is already exist." },
        { status: 400 }
      );
    }

    // Hash the password
    const salt = await bcryptjs.genSalt(10);
    const hashedPassword = await bcryptjs.hash(password, salt);

    // Create and save the new user
    const superAdmin = new Employee({
      fullName,
      email,
      role,
      position,
      password: hashedPassword,
    });
    await superAdmin.save();

    return NextResponse.json(
      { message: "Inscription réussie." },
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
