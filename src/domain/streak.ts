import { differenceInCalendarDays, format, getDay, subDays } from 'date-fns';
import type { Quest, Recurrence } from './types';

export const DATE_FORMAT = 'yyyy-MM-dd';

export function toDateKey(date: Date): string {
  return format(date, DATE_FORMAT);
}

export function isScheduledOn(recurrence: Recurrence, date: Date): boolean {
  if (recurrence === 'DAILY') return true;
  return recurrence.days.includes(getDay(date));
}

/** The most recent date strictly before `date` on which this quest is scheduled. */
export function previousScheduledDate(recurrence: Recurrence, date: Date): Date {
  let cursor = subDays(date, 1);
  if (recurrence === 'DAILY') return cursor;

  for (let i = 0; i < 7; i++) {
    if (isScheduledOn(recurrence, cursor)) return cursor;
    cursor = subDays(cursor, 1);
  }
  return subDays(date, 1);
}

export function daysSince(lastCompletedDate: string | null, today: Date): number {
  if (!lastCompletedDate) return Infinity;
  return differenceInCalendarDays(today, new Date(`${lastCompletedDate}T00:00:00`));
}

export interface StreakResult {
  streakCount: number;
  longestStreak: number;
  lastCompletedDate: string;
}

/**
 * Registers a completion for `today` and returns the quest's updated streak fields.
 * Idempotent: completing the same quest twice in one day doesn't double-count.
 */
export function registerCompletion(quest: Quest, today: Date): StreakResult {
  const todayKey = toDateKey(today);

  if (quest.lastCompletedDate === todayKey) {
    return {
      streakCount: quest.streakCount,
      longestStreak: quest.longestStreak,
      lastCompletedDate: quest.lastCompletedDate,
    };
  }

  const expectedPreviousKey = toDateKey(previousScheduledDate(quest.recurrence, today));
  const continuesStreak = quest.lastCompletedDate === expectedPreviousKey;
  const streakCount = continuesStreak ? quest.streakCount + 1 : 1;

  return {
    streakCount,
    longestStreak: Math.max(quest.longestStreak, streakCount),
    lastCompletedDate: todayKey,
  };
}
