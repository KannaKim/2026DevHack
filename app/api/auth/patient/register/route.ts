import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import Patient from "@/models/Patient";
import bcrypt from "bcryptjs";

export async function POST(req: Request) {
  try {
    await dbConnect();
    const body = await req.json();

    const existing = await Patient.findOne({ phin: body.phin });
    if (existing) {
      return NextResponse.json(
        { success: false, message: "PHIN already registered" },
        { status: 400 },
      );
    }

    const hashedPassword = await bcrypt.hash(body.password, 10);

    const patient = await Patient.create({
      phin: body.phin,
      password: hashedPassword,
      name: body.name,
      dob: new Date(body.dob),
      conditions: body.conditions || [],
      vaccines: [],
      medicalHistory: [],
    });

    return NextResponse.json({ success: true, data: patient });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: "Registration failed" },
      { status: 500 },
    );
  }
}
