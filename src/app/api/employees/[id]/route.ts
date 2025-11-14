import { connectToDB } from "@/db/connectToDb";
import bcryptjs from "bcryptjs";
import Employee from "@/db/models/employeeModel";
import { NextRequest, NextResponse } from "next/server";
import { EmployeeType } from "@/types/EmployeeType";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    await connectToDB();

    const employee = await Employee.findById(id).select("-password");
    return NextResponse.json(employee);
  } catch (error) {
    console.log(error);
    NextResponse.json({ message: "error fetching employee" }, { status: 500 });
  }
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    await connectToDB();
    const updatedEmployee: EmployeeType = await req.json();
    const { password } = updatedEmployee;
    if (password) {
      const salt = await bcryptjs.genSalt(10);
      const hashedPassword = await bcryptjs.hash(password as string, salt);
      updatedEmployee.password = hashedPassword;
    }

    const employee = await Employee.findByIdAndUpdate(id, updatedEmployee);
    if (employee) {
      return NextResponse.json({
        employee,
        message: "Employee edited successfully",
      });
    }
  } catch (error) {
    console.log(error);
    NextResponse.json({ message: "error edeting employee" }, { status: 500 });
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    await connectToDB();
    const employee = await Employee.findByIdAndDelete(id);
    if (employee) {
      return NextResponse.json({
        employee,
        message: "employee deleted successfully",
      });
    }
  } catch (error) {
    console.log(error);
    NextResponse.json({ message: "error deleting employee", status: 500 });
  }
}
