import { Position, Role } from "@/constants/constants";
import { connectToDB } from "@/db/connectToDb";
import Tool from "@/db/models/toolModel";
import ToolMovement from "@/db/models/toolMovementModel";
import { checkToken } from "@/helpers/checkToken";
import { ToolMovementType } from "@/types/MovementType";
import { NextRequest, NextResponse } from "next/server";

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

    if (ROLE !== Role.USER && POSITION !== Position.STORE_KEEPER) {
      return NextResponse.json(
        { message: "You are Not the StoreKeeper🤨" },
        { status: 403 }
      );
    }
    const { id } = await params;
    await connectToDB();

    const movement = await ToolMovement.findById(id);
    return NextResponse.json(movement);
  } catch (error) {
    console.log(error);
    NextResponse.json({ message: "error fetching data" }, { status: 500 });
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

    if (ROLE !== Role.USER && POSITION !== Position.STORE_KEEPER) {
      return NextResponse.json(
        { message: "You are Not the StoreKeeper🤨" },
        { status: 403 }
      );
    }
    const { id } = await params;
    await connectToDB();
    const updatedMovement: ToolMovementType = await req.json();
    const {
      returnedQuantity,
      toolCode,
      takenQuantity,
      storekeeperGivenName,
      employeeTakingTool,
      storekeeperReceiverName,
      takenAt,
      toolName,
    } = updatedMovement;

    if (returnedQuantity === undefined || !toolCode) {
      return NextResponse.json(
        {
          message: "Provide all required details.",
        },
        { status: 400 }
      );
    }
    //case the quantity returned equal to quantity taken
    if (returnedQuantity && returnedQuantity === takenQuantity) {
      await Tool.findOneAndUpdate(
        { code: toolCode },
        {
          $inc: {
            quantityTaken: -returnedQuantity,
          },
        }
      );
      const movement = await ToolMovement.findByIdAndUpdate(
        id,
        updatedMovement
      );
      if (movement) {
        return NextResponse.json({
          movement,
          message: "Movement edited successfully",
        });
      }
    }
    //case quantity returned is less then the quantity taken we create seperate movement for the rest quantityt taken and update the curent quantity
    if (returnedQuantity && returnedQuantity < takenQuantity) {
      await Tool.findOneAndUpdate(
        { code: toolCode },
        {
          $inc: {
            quantityTaken: -returnedQuantity,
          },
        }
      );
      const newUpdatedMovement = {
        ...updatedMovement,
        takenQuantity: returnedQuantity,
      };
      const newMovementWithTheRestQuantity = {
        takenQuantity: takenQuantity - returnedQuantity,
        returnedQuantity: 0,
        toolCode,
        takenNote: `This is auto message for the new movement created for this tool, Mr ${employeeTakingTool} still have to gave back the remaining quantity of  ${toolName}. `,
        storekeeperGivenName,
        employeeTakingTool,
        takenAt,
        toolName,
      };
      const movement = await ToolMovement.findByIdAndUpdate(
        id,
        newUpdatedMovement
      );

      const newMovement = await ToolMovement.create(
        newMovementWithTheRestQuantity
      );
      if (movement && newMovement) {
        return NextResponse.json({
          movement,
          message: "Movement edited successfully",
        });
      }
    }
  } catch (error) {
    console.log(error);
    NextResponse.json({ message: "error edeting movement" }, { status: 500 });
  }
}
