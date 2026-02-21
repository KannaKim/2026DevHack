import { NextResponse } from "next/server"
import { mockVaccineNotifications } from "@/lib/mock/VaccineNotifications"

export async function GET(request: Request) {
  return NextResponse.json(mockVaccineNotifications)
}