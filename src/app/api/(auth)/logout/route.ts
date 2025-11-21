import { NextResponse } from "next/server";

export async function GET() {
  try {
    const response = NextResponse.redirect(
      new URL("/signin", "https://mini-odoo.vercel.app")
    );
    response.cookies.set("miniOdooApp", "", {
      httpOnly: true,
      path: "/",
      expires: new Date(0),
    });

    return response;
  } catch (error) {
    console.log(error);
    return NextResponse.json({
      message: "Logout field.",
      success: false,
    });
  }
}
