import { contactUsEmailTemplate } from "@/app/lib/EmailTemplates";
import sendEmail from "@/app/lib/sendEmail";
import { NextResponse } from "next/server";

export async function POST(request) {
  try {
    const { firstName, lastName, email, message, phone } = await request.json();

    if (!firstName || !lastName || !email || !message) {
      return NextResponse.json(
        { success: false, message: "All fields are required" },
        { status: 400 }
      );
    }

    const emailTemplate = contactUsEmailTemplate({
      firstName,
      lastName,
      email,
      message,
      phone,
    });

    const res = await sendEmail(
      "dhrumitpanchal789@gmail.com",
      "Contact Form Submission",
      emailTemplate
    );

    if (res.success) {
      return NextResponse.json(
        { success: true, message: "Email sent successfully" },
        { status: 200 }
      );
    } else {
      return NextResponse.json(
        { success: false, message: res.message },
        { status: 500 }
      );
    }
  } catch (err) {
    console.error("POST /subcategory error:", err);
    return NextResponse.json(
      { success: false, message: "Invalid request" },
      { status: 400 }
    );
  }
}
