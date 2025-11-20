import { Position, Role } from "@/constants/constants";
import { connectToDB } from "@/db/connectToDb";
import Tool from "@/db/models/toolModel";
import ToolMovement from "@/db/models/toolMovementModel";
import { checkToken } from "@/helpers/checkToken";
import { ToolMovementType } from "@/types/MovementType";

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

    const { ROLE, POSITION } = tokenData;

    if (ROLE !== Role.USER && POSITION !== Position.STORE_KEEPER) {
      return NextResponse.json(
        { message: "You are Not the StoreKeeper🤨" },
        { status: 403 }
      );
    }
    await connectToDB();
    const movement: ToolMovementType = await req.json();
    const {
      toolName,
      toolCode,
      storekeeperGivenName,
      employeeTakingTool,
      takenQuantity,
    } = movement;

    if (
      !employeeTakingTool ||
      !storekeeperGivenName ||
      !toolName ||
      !toolCode
    ) {
      return NextResponse.json(
        {
          message: "Provide all required details.",
        },
        { status: 400 }
      );
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

export async function DELETE() {
  try {
    const tokenData = await checkToken();

    if (!tokenData) {
      return NextResponse.json(
        { message: "Invalid token or not authenticated" },
        { status: 401 }
      );
    }

    const { ROLE, POSITION } = tokenData;

    if (ROLE !== Role.USER && POSITION !== Position.STORE_KEEPER) {
      return NextResponse.json(
        { message: "You are Not the StoreKeeper🤨" },
        { status: 403 }
      );
    }
    await connectToDB();
    await ToolMovement.deleteMany({
      returnedAt: { $ne: null },
    });

    return NextResponse.json({
      message: "Delete only the  returned tool movements successfully",
    });
  } catch (error) {
    console.log(error);
    NextResponse.json(
      { message: "error deleting returned tool movements" },
      { status: 500 }
    );
  }
}
