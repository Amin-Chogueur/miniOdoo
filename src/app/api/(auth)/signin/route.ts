import { NextRequest, NextResponse } from "next/server";
import bcryptjs from "bcryptjs";
import Employee from "@/db/models/employeeModel";
import { connectToDB } from "@/db/connectToDb";
import jwt from "jsonwebtoken";
export async function POST(request: NextRequest) {
  try {
    await connectToDB();
    const reqbody = await request.json();
    const { email, password } = reqbody;
    const user = await Employee.findOne({ email });

    if (!user) {
      return NextResponse.json(
        { message: "Oops! You dont have an account in this app." },
        { status: 404 }
      );
    }
    if (user.password === "") {
      return NextResponse.json(
        { message: "You need to Create your account first, please Sign Up." },
        { status: 400 }
      );
    }
    const validPassword = await bcryptjs.compare(password, user.password);
    if (!validPassword) {
      return NextResponse.json(
        { message: "Incorrect password" },
        { status: 400 }
      );
    }

    const tokenData = {
      id: user._id,
      position: user.position,
      username: user.fullName,
      role: user.role,
    };

    const token = jwt.sign(tokenData, process.env.TOKEN_SECRET!, {
      expiresIn: "12h",
    });

    const response = NextResponse.json({
      message: "Connection successful",
      success: true,
      token,
    });
    response.cookies.set("miniOdooApp", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      path: "/", // this is important for deployment !
    });
    return response;
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { error: "Error while connecting." },
      { status: 500 }
    );
  }
}
