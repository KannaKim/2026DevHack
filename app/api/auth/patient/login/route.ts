import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import Patient from "@/models/Patient";

export async function POST(req: Request) {
  try {
    await dbConnect();
    const body = await req.json();

    const patient = await Patient.findOne({ phin: body.phin });

    if (!patient) {
      return NextResponse.json(
        { success: false, message: "Invalid PHIN" },
        { status: 400 },
      );
    }

    // 🔓 Plain text comparison (temporary)
    if (body.password !== patient.password) {
      return NextResponse.json(
        { success: false, message: "Invalid password" },
        { status: 400 },
      );
    }

    const response = NextResponse.json({ success: true });

    response.cookies.set("patientId", patient._id.toString(), {
      httpOnly: true,
      secure: false,
      sameSite: "lax",
      path: "/",
    });

    return response;
  } catch (error) {
    return NextResponse.json(
      { success: false, message: "Login failed" },
      { status: 500 },
    );
  }
}
