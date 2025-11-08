import { connectToDB } from "@/db/connectToDb";
import Employee from "@/db/models/employeeModel";
import { NextRequest, NextResponse } from "next/server";

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
    const updatedEmployee = await req.json();
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
