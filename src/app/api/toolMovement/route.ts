import { connectToDB } from "@/db/connectToDb";
import ToolMovement from "@/db/models/toolMovementModel";
import { ToolMovementType } from "@/types/MovementType";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    await connectToDB();
    const movement: ToolMovementType = await req.json();
    const { employeeName, storekeeperGivenName, toolName } = movement;
    if (!employeeName || !storekeeperGivenName || !toolName) {
      return NextResponse.json({
        message: "Provide all required details.",
        status: 400,
      });
    }
    const newMovement = await ToolMovement.create(movement);
    if (newMovement) {
      return NextResponse.json({
        newMovement,
        message: "New Movement created successfully",
      });
    } else {
      NextResponse.json(
        { message: "error creating movement" },
        { status: 404 }
      );
    }
  } catch (error) {
    console.log(error);
    NextResponse.json({ message: "error creating movement" }, { status: 500 });
  }
}

export async function GET() {
  try {
    await connectToDB();
    const movements = await ToolMovement.find({}).sort({ createdAt: -1 });
    return NextResponse.json(movements);
  } catch (error) {
    console.log(error);
    NextResponse.json({ message: "error fetching movement" }, { status: 500 });
  }
}
