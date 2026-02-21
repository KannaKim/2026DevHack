import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import AccessToken from "@/models/AccessToken";
import { cookies } from "next/headers";

export async function POST() {
  try {
    await dbConnect();

    const cookieStore = await cookies();
    const patientId = cookieStore.get("patientId")?.value;

    if (!patientId) {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 },
      );
    }

    const token = "MED-" + crypto.randomUUID().slice(0, 8).toUpperCase();

    const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000);

    const access = await AccessToken.create({
      token,
      patientId,
      expiresAt,
    });

    return NextResponse.json({
      success: true,
      data: access,
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: "Token generation failed" },
      { status: 500 },
    );
  }
}
