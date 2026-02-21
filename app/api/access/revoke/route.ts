import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import AccessToken from "@/models/AccessToken";
import { cookies } from "next/headers";

export async function POST(req: Request) {
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

    const body = await req.json();

    await AccessToken.updateOne(
      { token: body.token, patientId },
      { revoked: true },
    );

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: "Revoke failed" },
      { status: 500 },
    );
  }
}
