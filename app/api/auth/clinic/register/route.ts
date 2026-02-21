import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import Clinic from "@/models/Clinic";
import bcrypt from "bcryptjs";

export async function POST(req: Request) {
  try {
    await dbConnect();
    const body = await req.json();

    const existing = await Clinic.findOne({ clinicId: body.clinicId });
    if (existing) {
      return NextResponse.json(
        { success: false, message: "Clinic already registered" },
        { status: 400 },
      );
    }

    const hashedPassword = await bcrypt.hash(body.password, 10);

    const clinic = await Clinic.create({
      clinicId: body.clinicId,
      province: body.province,
      password: hashedPassword,
      name: body.name,
    });

    return NextResponse.json({ success: true, data: clinic });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: "Clinic registration failed" },
      { status: 500 },
    );
  }
}
