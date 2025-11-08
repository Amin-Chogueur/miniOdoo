import { connectToDB } from "@/db/connectToDb";
import Tool from "@/db/models/toolModel";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    await connectToDB();

    const tool = await Tool.findById(id);
    return NextResponse.json(tool);
  } catch (error) {
    console.log(error);
    NextResponse.json({ message: "error fetching tool" }, { status: 500 });
  }
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    await connectToDB();
    const updatedTool = await req.json();
    const tool = await Tool.findByIdAndUpdate(id, updatedTool);
    if (tool) {
      return NextResponse.json({
        tool,
        message: "tool edited successfully",
      });
    }
  } catch (error) {
    console.log(error);
    NextResponse.json({ message: "error edeting tool" }, { status: 500 });
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    await connectToDB();
    const tool = await Tool.findByIdAndDelete(id);
    if (tool) {
      return NextResponse.json({
        tool,
        message: "tool deleted successfully",
      });
    }
  } catch (error) {
    console.log(error);
    NextResponse.json({ message: "error deleting tool", status: 500 });
  }
}
