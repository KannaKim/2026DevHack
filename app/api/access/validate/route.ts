import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import AccessToken from "@/models/AccessToken";
import "@/models/Patient"; // 👈 IMPORTANT: force model registration
export async function POST(req: Request) {
  try {
    await dbConnect();
    const body = await req.json();

    console.log("Incoming token:", body.token);

    const access = await AccessToken.findOne({
      token: body.token,
      revoked: false,
    }).populate("patientId");

    console.log("Access result:", access);

    if (!access) {
      return NextResponse.json(
        { success: false, message: "Invalid token" },
        { status: 400 },
      );
    }

    if (new Date(access.expiresAt) < new Date()) {
      return NextResponse.json(
        { success: false, message: "Token expired" },
        { status: 400 },
      );
    }

    return NextResponse.json({
      success: true,
      data: access.patientId,
    });
  } catch (error) {
    console.error("VALIDATE ERROR:", error);
    return NextResponse.json(
      { success: false, message: "Validation failed" },
      { status: 500 },
    );
  }
}
