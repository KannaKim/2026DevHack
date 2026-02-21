import { NextResponse } from "next/server"
import rule from "@/lib/rule.js"
import { hasNotificationBeenSent, markNotificationSent } from "@/lib/server-store"
import users from "@/data/user"

export async function GET(request: Request) {
  const url = new URL(request.url)
  const origin = url.origin

  let sentCount = 0

  for (const user of users) {
    const { timeline } = rule([user])

    const missedVaccines: string[] = []
    const dueSoonVaccines: string[] = []
    const completedVaccines: string[] = []

    for (const res of timeline) {
      if (res.status === "completed") {
        completedVaccines.push(res.name)
        continue
      }

      // Check if we've already sent a notification about this specific vaccine status today
      if (hasNotificationBeenSent(user.id, res.name, res.status)) {
        continue
      }

      if (res.status === "missed") missedVaccines.push(res.name)
      else if (res.status === "upcoming") dueSoonVaccines.push(res.name)
    }

    if (missedVaccines.length === 0 && dueSoonVaccines.length === 0) {
      continue
    }

    const email = user.email || process.env.EMAIL_ADDRESS
    const phone = user.phone || process.env.PHONE_NUMBER

    // Construct a comprehensive clinic visit message
    let messageBody = `Hello ${user.name},\n\nWe noticed you might be visiting the clinic soon or need to update your records. `

    if (missedVaccines.length > 0) {
      messageBody += `\n\n🚨 You are OVERDUE for: ${missedVaccines.join(", ")}.`
    }
    if (dueSoonVaccines.length > 0) {
      messageBody += `\n\n📅 You are DUE SOON for: ${dueSoonVaccines.join(", ")}.`
    }

    messageBody += `\n\nPlease speak with your healthcare provider during your visit to get these sorted out!`

    const title = "Your Clinic Visit Vaccine Update"

    // Send Email
    try {
      await fetch(`${origin}/api/send-email`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          to: email,
          message: `Vaccine Alert: ${title}\n\n${messageBody}`,
        }),
      })
    } catch (e) {
      console.error("Email error:", e)
    }

    // Send SMS
    try {
      await fetch(`${origin}/api/send-sms`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          to: phone.startsWith("+") ? phone : `+${phone}`,
          body: `Vaccine Alert: ${title}\n\n${messageBody}`,
        }),
      })
    } catch (e) {
      console.error("SMS error:", e)
    }

    // Mark as sent to prevent duplicates
    for (const v of missedVaccines) markNotificationSent(user.id, v, "missed")
    for (const v of dueSoonVaccines) markNotificationSent(user.id, v, "upcoming")

    sentCount++
  }

  return NextResponse.json({ success: true, sentCount })
}