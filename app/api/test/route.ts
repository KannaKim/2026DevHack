import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import Patient from "@/models/Patient";

// post request
export async function POST(request: Request) {
  try {
    await dbConnect();

    const body = await request.json();

    const patient = await Patient.create({
      name: body.name,
      dob: new Date(body.dob),
      conditions: body.conditions || [],
      vaccines: body.vaccines || [],
      medicalHistory: body.medicalHistory || [],
    });

    return NextResponse.json({ success: true, data: patient });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { success: false, message: "Failed to create patient" },
      { status: 500 },
    );
  }
}

// get request

export async function GET(request: Request) {
  try {
    await dbConnect();

    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json(
        { success: false, message: "Patient ID required" },
        { status: 400 },
      );
    }

    const patient = await Patient.findById(id);

    if (!patient) {
      return NextResponse.json(
        { success: false, message: "Patient not found" },
        { status: 404 },
      );
    }

    return NextResponse.json({ success: true, data: patient });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { success: false, message: "Error fetching patient" },
      { status: 500 },
    );
  }
}
