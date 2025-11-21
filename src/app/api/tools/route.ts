import { Role } from "@/constants/constants";
import { connectToDB } from "@/db/connectToDb";
import Tool from "@/db/models/toolModel";
import { checkToken } from "@/helpers/checkToken";
import { ToolType } from "@/types/ToolType";

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

    const { ROLE } = tokenData;
    const isSuperAdmin = ROLE === Role.SUPER_ADMIN;

    if (!isSuperAdmin) {
      return NextResponse.json(
        { message: "You are Not the Super Admin 🤨" },
        { status: 403 }
      );
    }
    await connectToDB();
    const tool: ToolType = await req.json();
    const { name, shelf, code } = tool;
    const isExist = await Tool.findOne({ code });
    if (isExist) {
      return NextResponse.json(
        { message: "This code already exist" },
        { status: 500 }
      );
    }
    if (!name || !shelf || !code) {
      return NextResponse.json(
        { message: "Provide all required details." },
        { status: 400 }
      );
    }
    const newTool = await Tool.create(tool);
    if (newTool) {
      return NextResponse.json(
        { newTool, message: "New tool created successfully" },
        { status: 201 }
      );
    } else {
      return NextResponse.json(
        { message: "Error creating tool" },
        { status: 500 }
      );
    }
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      {
        message: "error creating tool",
      },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    await connectToDB();
    const tools = await Tool.find({}).sort({ createdAt: -1 });
    return NextResponse.json(tools);
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      {
        message: "error fetching tools",
      },
      { status: 500 }
    );
  }
}
