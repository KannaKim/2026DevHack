// import Link from "next/link";
// import NotificationButton from "@/components/examples/popover/standard/popover-standard-12";
// import NotificationSettings from "@/components/examples/dropdown-menu/settings/dropdown-menu-settings-4";

// //Used the template from the dashboard page to test reminder-system
// export default function DashboardPage() {
//     return (
//         <div className="flex min-h-screen flex-col bg-zinc-50 font-sans dark:bg-black">
//             <header className="border-b border-zinc-200 bg-white px-6 py-4 dark:border-zinc-800 dark:bg-zinc-950">
//                 <nav className="flex items-center justify-between">
//                     <h1 className="text-lg font-semibold text-black dark:text-zinc-50">
//                         Dashboard
//                     </h1>
//                     <div className="flex gap-4">
//                         <NotificationButton />
//                     </div>
//                 </nav>
//             </header>
//             <main className="flex flex-1 items-center justify-center p-8">
//                 <p className="text-zinc-500 dark:text-zinc-400">Dashboard content</p>
//                 <NotificationSettings />
//             </main>
//         </div>
//     );
// }
// "use client";

// import * as React from "react";
// import users from "@/lib/mock/user";
// import { evaluateUserVaccines } from "@/lib/reminders/eligibility";
// import { generateReminders } from "@/lib/reminders/generate";
// import { dedupe } from "@/lib/reminders/sentLog";
// import { iso } from "@/lib/date";

// export default function PatientDemo() {
//   const [userId, setUserId] = React.useState(users[0].id);
//   const [reminders, setReminders] = React.useState<any[]>([]);

//   React.useEffect(() => {
//     const user = users.find(u => u.id === userId)!;

//     const today = new Date();
//     const todayIso = iso(today);

//     const results = evaluateUserVaccines(user, today);

//     const raw = generateReminders(results, {
//       leadDays: 7,
//       channels: ["inApp", "email"], // simulate
//       todayIso,
//     });

//     const sentRaw = localStorage.getItem("sentReminderKeys");
//     const sentKeys = new Set<string>(sentRaw ? JSON.parse(sentRaw) : []);

//     const { out, newKeys } = dedupe(raw, sentKeys);
//     localStorage.setItem("sentReminderKeys", JSON.stringify([...sentKeys]));

//     setReminders(out);
//   }, [userId]);

//   return (
//     <main className="p-6 max-w-3xl mx-auto space-y-4">
//       <div className="flex items-center gap-3">
//         <select
//           className="border rounded-lg px-3 py-2"
//           value={userId}
//           onChange={(e) => setUserId(Number(e.target.value))}
//         >
//           {users.map(u => <option key={u.id} value={u.id}>{u.name}</option>)}
//         </select>

//         <button
//           className="border rounded-lg px-3 py-2"
//           onClick={() => localStorage.removeItem("sentReminderKeys")}
//         >
//           Reset Sent Log
//         </button>
//       </div>

//       <section className="border rounded-xl p-4">
//         <h2 className="font-semibold mb-2">Reminders sent “today”</h2>
//         {reminders.length === 0 ? (
//           <p className="text-sm text-gray-600">No new reminders.</p>
//         ) : (
//           <div className="space-y-2">
//             {reminders.map((r) => (
//               <div key={r.id} className="border rounded-lg p-3">
//                 <div className="flex justify-between">
//                   <p className="font-medium">{r.title}</p>
//                   <span className="text-xs text-gray-500">{r.channel}</span>
//                 </div>
//                 <p className="text-sm text-gray-700">{r.body}</p>
//               </div>
//             ))}
//           </div>
//         )}
//       </section>
//     </main>
//   );
// }
"use client";

import * as React from "react";
import users from "@/lib/mock/users";
import NotificationPrefsDropdown, { NotificationPrefs } from "@/components/ui/NotificationPrefsDropdown";
import { prefsToChannels, prefsToTypes } from "@/lib/reminders/prefsMap";

// these are your existing functions from earlier
import { evaluateUserVaccines } from "@/lib/reminders/eligibility";
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
async function sendSMS(to: string, message: string) {
    await fetch("/api/send-sms", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ to, message }),
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

        const results = evaluateUserVaccines(user, today);

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