import { connectToDB } from "@/db/connectToDb";
import Employee from "@/db/models/employeeModel";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ pin: string }> }
) {
  try {
    const { pin } = await params;
    await connectToDB();

    const employee = await Employee.findOne({ pin }).select("fullName");

    if (!employee) {
      return NextResponse.json(
        { message: "Employee not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(employee);
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { message: "Error fetching employee" },
      { status: 500 }
    );
  }
}
