import { connectToDB } from "@/db/connectToDb";
import bcryptjs from "bcryptjs";
import Employee from "@/db/models/employeeModel";
import { NextRequest, NextResponse } from "next/server";
import { EmployeeType } from "@/types/EmployeeType";
import { checkToken } from "@/helpers/checkToken";
import { Position, Role } from "@/constants/constants";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const tokenData = await checkToken();

    if (!tokenData) {
      return NextResponse.json(
        { message: "Invalid token or not authenticated" },
        { status: 401 }
      );
    }

    const { ROLE, POSITION } = tokenData;

    if (ROLE !== Role.SUPER_ADMIN && POSITION !== Position.MANAGER) {
      return NextResponse.json(
        { message: "You are Not the Super Admin🤨" },
        { status: 403 }
      );
    }
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
    const tokenData = await checkToken();

    if (!tokenData) {
      return NextResponse.json(
        { message: "Invalid token or not authenticated" },
        { status: 401 }
      );
    }

    const { ROLE, POSITION } = tokenData;

    if (ROLE !== Role.SUPER_ADMIN && POSITION !== Position.MANAGER) {
      return NextResponse.json(
        { message: "You are Not the Super Admin🤨" },
        { status: 403 }
      );
    }
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
