import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";
import crypto from "crypto";
import { connectToDB } from "@/db/connectToDb";
import Employee from "@/db/models/employeeModel";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request: NextRequest) {
  await connectToDB();
  const { email } = await request.json();

  const user = await Employee.findOne({ email });
  if (!user) {
    return NextResponse.json(
      { message: "Oups ! Your are not the super admin." },
      { status: 404 }
    );
  }
  const resetToken = crypto.randomBytes(32).toString("hex");

  user.verifyToken = resetToken;
  user.verifyTokenExpiry = Date.now() + 3600000; // Token valid for 1 hour
  await user.save();

  const resetUrl = `https://mini-odoo.vercel.app/reset-password?token=${resetToken}`;

  ///

  await resend.emails.send({
    from: "Mini Odoo <onboarding@resend.dev>", // replace with your sender email
    to: email, // form input email
    subject: "Message from  Mini Odoo App",
    html: `<p>Click <a href="${resetUrl}">here</a> to reset your password.</p>`,
  });

  return NextResponse.json({ message: "E-mail de réinitialisation envoyé." });
}
