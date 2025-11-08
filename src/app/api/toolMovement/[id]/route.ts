import { connectToDB } from "@/db/connectToDb";
import ToolMovement from "@/db/models/toolMovementModel";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
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
    const { id } = await params;
    await connectToDB();
    const updatedMovement = await req.json();

    const movement = await ToolMovement.findByIdAndUpdate(id, updatedMovement);
    if (movement) {
      return NextResponse.json({
        movement,
        message: "Movement edited successfully",
      });
    }
  } catch (error) {
    console.log(error);
    NextResponse.json({ message: "error edeting movement" }, { status: 500 });
  }
}

// export async function DELETE(
//   req: NextRequest,
//   { params }: { params: Promise<{ id: string }> }
// ) {
//   try {
//     const { id } = await params;
//     await connectToDB();
//     const job = await Job.findByIdAndDelete(id);
//     if (job) {
//       return NextResponse.json({
//         job,
//         message: "Server Responce: job deleted successfully ",
//       });
//     }
//   } catch (error) {
//     console.log(error);
//     NextResponse.json({ message: "error deleting job", status: 500 });
//   }
// }
