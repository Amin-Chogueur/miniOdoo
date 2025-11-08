import { connectToDB } from "@/db/connectToDb";
import Employee from "@/db/models/employeeModel";
import { EmployeeType } from "@/types/EmployeeType";

import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    await connectToDB();
    const employee: EmployeeType = await req.json();
    const { fullName, position, role } = employee;
    const isExist = await Employee.findOne({ fullName });
    if (isExist) {
      return NextResponse.json(
        { message: "This employee already exist" },
        { status: 500 }
      );
    }
    if (!fullName || !position || !role) {
      return NextResponse.json(
        { message: "Provide all required details." },
        { status: 400 }
      );
    }
    const newEmployee = await Employee.create(employee);
    if (newEmployee) {
      return NextResponse.json(
        { newEmployee, message: "New employee created successfully" },
        { status: 201 }
      );
    } else {
      return NextResponse.json(
        { message: "Error creating employee" },
        { status: 500 }
      );
    }
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      {
        message: "error creating Employee",
      },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    await connectToDB();
    const employees = await Employee.find({})
      .sort({ createdAt: -1 })
      .select("-password");
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
