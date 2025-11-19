import { Position, Role } from "@/constants/constants";
import { connectToDB } from "@/db/connectToDb";
import Employee from "@/db/models/employeeModel";
import { checkToken } from "@/helpers/checkToken";
import { generatePin6 } from "@/helpers/generatePin";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const tokenData = await checkToken();

    if (!tokenData) {
      return NextResponse.json(
        { message: "Invalid token or not authenticated" },
        { status: 401 }
      );
    }

    if (tokenData.ROLE !== Role.SUPER_ADMIN) {
      return NextResponse.json(
        { message: "You are Not the Super Admin🤨" },
        { status: 403 }
      );
    }

    await connectToDB();
    const { fullName, position, role, email } = await req.json();

    if (!fullName || !position || !role || !email) {
      return NextResponse.json(
        { message: "Provide all required details." },
        { status: 400 }
      );
    }

    const existing = await Employee.findOne({ fullName });
    if (existing) {
      return NextResponse.json(
        { message: "This employee already exists." },
        { status: 400 }
      );
    }

    // -------------------------------------
    // Generate UNIQUE 6-digit PIN
    // -------------------------------------
    let pin;
    let newEmployee;
    let attempts = 0;

    while (!newEmployee && attempts < 10) {
      attempts++;
      pin = generatePin6();

      const exists = await Employee.findOne({ pin });
      if (exists) continue;

      newEmployee = await Employee.create({
        email,
        fullName,
        position,
        pin,
        role,
      });
    }

    if (!newEmployee) {
      return NextResponse.json(
        { message: "Failed to generate unique PIN. Try again." },
        { status: 500 }
      );
    }

    return NextResponse.json(
      {
        message: "Employee created successfully.",
      },
      { status: 201 }
    );
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { message: "Error creating employee" },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const tokenData = await checkToken();

    if (!tokenData) {
      return NextResponse.json(
        { message: "Invalid token or not authenticated" },
        { status: 401 }
      );
    }
    const isSuperAdminOrStoreKeeper =
      tokenData.ROLE === Role.SUPER_ADMIN ||
      tokenData.POSITION === Position.STORE_KEEPER;

    const currentUserEmail = tokenData.EMAIL;

    await connectToDB();
    let employees;
    if (isSuperAdminOrStoreKeeper) {
      employees = await Employee.find({})
        .select("-password -pin")
        .sort({ createdAt: -1 });
    } else {
      employees = await Employee.find({ email: currentUserEmail })
        .sort({ createdAt: -1 })
        .select("-password");
    }

    return NextResponse.json(employees);
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      {
        message: "error fetching Employees",
      },
      { status: 500 }
    );
  }
}
