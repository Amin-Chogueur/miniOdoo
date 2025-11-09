import { connectToDB } from "@/db/connectToDb";
import Tool from "@/db/models/toolModel";
import ToolMovement from "@/db/models/toolMovementModel";
import { ToolMovementType } from "@/types/MovementType";

import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    await connectToDB();
    const movement: ToolMovementType = await req.json();
    const {
      employeeName,
      toolName,
      toolCode,
      storekeeperGivenName,
      takenQuantity,
    } = movement;
    console.log(movement);
    if (!employeeName || !storekeeperGivenName || !toolName || !toolCode) {
      return NextResponse.json({
        message: "Provide all required details.",
        status: 400,
      });
    }

    await Tool.findOneAndUpdate(
      { code: toolCode },
      {
        $inc: {
          quantityTaken: takenQuantity,
        },
      }
    );

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
