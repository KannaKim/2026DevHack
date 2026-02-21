
import type { Reminder } from "./generate";

export function makeKey(r: Reminder) {
  // 1 reminder per user/vaccine/type/channel/day
  return `${r.userId}:${r.vaccineName}:${r.type}:${r.channel}:${r.createdAt}`;
}

export function dedupe(reminders: Reminder[], sentKeys: Set<string>) {
  const out: Reminder[] = [];
  const newKeys: string[] = [];
  for (const r of reminders) {
    const key = makeKey(r);
    if (!sentKeys.has(key)) {
      out.push(r);
      newKeys.push(key);
      sentKeys.add(key);
    }
  }
  return { out, newKeys };
}