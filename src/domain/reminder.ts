import { format } from 'date-fns';
import type { Quest } from './types';

export const MAX_REMINDERS_PER_DAY = 3;
export const REMINDER_REPEAT_MINUTES = 30; // 반복 알림 사이 최소 간격 — 너무 잦지 않게

function currentTimeKey(now: Date): string {
  return format(now, 'HH:mm');
}

function countToday(quest: Quest, todayKey: string): number {
  return quest.reminderDate === todayKey ? quest.reminderCount : 0;
}

/** True if `quest` should fire a reminder right now: due time reached, not yet completed today, under the daily cap, and enough time since the last reminder. */
export function isReminderDue(quest: Quest, now: Date, todayKey: string): boolean {
  if (!quest.active || !quest.reminderTime) return false;
  if (quest.lastCompletedDate === todayKey) return false;
  if (countToday(quest, todayKey) >= MAX_REMINDERS_PER_DAY) return false;
  if (currentTimeKey(now) < quest.reminderTime) return false;

  if (quest.reminderDate !== todayKey || !quest.lastReminderAt) return true;

  const minutesSinceLast = (now.getTime() - new Date(quest.lastReminderAt).getTime()) / 60_000;
  return minutesSinceLast >= REMINDER_REPEAT_MINUTES;
}

/** Updates a quest's reminder counters after a reminder has just been shown. Resets the count when the day rolls over. */
export function recordReminderShown(
  quest: Quest,
  now: Date,
  todayKey: string,
): Pick<Quest, 'reminderDate' | 'reminderCount' | 'lastReminderAt'> {
  const nextCount = quest.reminderDate === todayKey ? quest.reminderCount + 1 : 1;
  return {
    reminderDate: todayKey,
    reminderCount: nextCount,
    lastReminderAt: now.toISOString(),
  };
}
