import { NextResponse } from "next/server";

export async function GET() {
  try {
    const response = NextResponse.redirect(
      new URL("/signin", "http://localhost:3000")
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
      message: "La déconnexion a échoué.",
      success: false,
    });
  }
}
