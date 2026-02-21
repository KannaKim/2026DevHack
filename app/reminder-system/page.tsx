
"use client";

import * as React from "react";
import users from "@/lib/mock/users";
import NotificationPrefsDropdown, { NotificationPrefs } from "@/components/ui/NotificationPrefsDropdown";
import { prefsToChannels, prefsToTypes } from "@/lib/reminders/prefsMap";

import { evaluateUserVaccinesFromCatalog } from "@/lib/reminders/eligibility";
import { generateReminders } from "@/lib/reminders/generate";
import { dedupe } from "@/lib/reminders/sentLog";
import { iso } from "@/lib/date";
import { send } from "process";


async function sendEmail(to: string, message: string) {
    await fetch("/api/send-email", {
        method: "POST",
        body: JSON.stringify({ to, message }),
    });
}
async function sendSMS(to: string, body: string) {
    await fetch("/api/send-sms", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ to, body }),
    });
}

export default function DashboardPage() {
    const [userId, setUserId] = React.useState(users[0].id);
    const [prefs, setPrefs] = React.useState<NotificationPrefs | null>(null);
    const [reminders, setReminders] = React.useState<any[]>([]);


    React.useEffect(() => {
        if (!prefs) return;

        const user = users.find((u) => u.id === userId)!;
        const today = new Date();
        const todayIso = iso(today);

        const results = evaluateUserVaccinesFromCatalog(user, today);

        const allowedTypes = new Set(prefsToTypes(prefs));
        const channels = prefsToChannels(prefs);

        const raw = generateReminders(
            results.filter((r) => r.status === "dueSoon" || r.status === "overdue" || r.status === "eligibleNow"),
            { leadDays: 7, channels, todayIso }
        );

        const sentRaw = localStorage.getItem("sentReminderKeys");
        const sentKeys = new Set<string>(sentRaw ? JSON.parse(sentRaw) : []);

        const { out } = dedupe(raw, sentKeys);
        localStorage.setItem("sentReminderKeys", JSON.stringify([...sentKeys]));

        setReminders(out);
    }, [userId, prefs]);



    return (
        <main className="p-6 max-w-4xl mx-auto space-y-6">
            <button
                className="border rounded-lg px-3 py-2"
                onClick={() => sendSMS("+12045905405", "Test SMS")}
            >
                Send test SMS
            </button>
            <div className="flex items-center justify-between gap-4">
                <select
                    className="border rounded-lg px-3 py-2"
                    value={userId}
                    onChange={(e) => setUserId(Number(e.target.value))}
                >
                    {users.map((u) => (
                        <option key={u.id} value={u.id}>
                            {u.name}
                        </option>
                    ))}
                </select>

                <NotificationPrefsDropdown
                    unreadCount={reminders.length}
                    onPrefsChange={(p) => setPrefs(p)}
                />
            </div>

            <section className="rounded-xl border p-4">
                <h2 className="font-semibold mb-2">In-App Notification Center (demo)</h2>
                {reminders.length === 0 ? (
                    <p className="text-sm text-muted-foreground">No reminders based on current preferences.</p>
                ) : (
                    <div className="space-y-2">
                        {reminders.map((r) => (
                            <div key={r.id} className="border rounded-lg p-3">
                                <div className="flex justify-between">
                                    <p className="font-medium">{r.title}</p>
                                    <span className="text-xs text-muted-foreground">{r.channel}</span>
                                </div>
                                <p className="text-sm">{r.body}</p>
                            </div>
                        ))}
                    </div>
                )}
            </section>
        </main>
    );
}