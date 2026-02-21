import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import Clinic from "@/models/Clinic";
import bcrypt from "bcryptjs";

export async function POST(req: Request) {
  try {
    await dbConnect();
    const body = await req.json();

    const clinic = await Clinic.findOne({ clinicId: body.clinicId });
    if (!clinic) {
      return NextResponse.json(
        { success: false, message: "Invalid clinic ID" },
        { status: 400 },
      );
    }

    const isMatch = await bcrypt.compare(body.password, clinic.password);
    if (!isMatch) {
      return NextResponse.json(
        { success: false, message: "Invalid password" },
        { status: 400 },
      );
    }

    const response = NextResponse.json({ success: true });

    response.cookies.set("clinicId", clinic._id.toString(), {
      httpOnly: true,
      secure: false,
      sameSite: "lax",
      path: "/",
    });

    return response;
  } catch (error) {
    return NextResponse.json(
      { success: false, message: "Clinic login failed" },
      { status: 500 },
    );
  }
}
