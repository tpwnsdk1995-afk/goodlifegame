import { describe, expect, it } from 'vitest';
import { isReminderDue, MAX_REMINDERS_PER_DAY, recordReminderShown } from '../../src/domain/reminder';
import type { Quest } from '../../src/domain/types';

function makeQuest(overrides: Partial<Quest> = {}): Quest {
  return {
    id: 'q1',
    characterId: 'c1',
    domain: 'EXERCISE',
    title: '스쿼트 30개',
    recurrence: 'DAILY',
    active: true,
    streakCount: 0,
    longestStreak: 0,
    lastCompletedDate: null,
    createdAt: new Date('2026-01-01').toISOString(),
    reminderTime: '20:00',
    reminderDate: null,
    reminderCount: 0,
    lastReminderAt: null,
    ...overrides,
  };
}

const TODAY = '2026-07-31';
const BEFORE_TIME = new Date('2026-07-31T19:59:00');
const AT_TIME = new Date('2026-07-31T20:00:00');

describe('isReminderDue', () => {
  it('is false when no reminderTime is set', () => {
    expect(isReminderDue(makeQuest({ reminderTime: null }), AT_TIME, TODAY)).toBe(false);
  });

  it('is false for an inactive quest', () => {
    expect(isReminderDue(makeQuest({ active: false }), AT_TIME, TODAY)).toBe(false);
  });

  it('is false before the scheduled time', () => {
    expect(isReminderDue(makeQuest(), BEFORE_TIME, TODAY)).toBe(false);
  });

  it('is true once the scheduled time is reached', () => {
    expect(isReminderDue(makeQuest(), AT_TIME, TODAY)).toBe(true);
  });

  it('is false once the quest is already completed today', () => {
    expect(isReminderDue(makeQuest({ lastCompletedDate: TODAY }), AT_TIME, TODAY)).toBe(false);
  });

  it('is false once the daily cap is reached', () => {
    const quest = makeQuest({ reminderDate: TODAY, reminderCount: MAX_REMINDERS_PER_DAY });
    expect(isReminderDue(quest, AT_TIME, TODAY)).toBe(false);
  });

  it('is false if a reminder was shown recently (within the repeat interval)', () => {
    const quest = makeQuest({
      reminderDate: TODAY,
      reminderCount: 1,
      lastReminderAt: new Date('2026-07-31T20:10:00').toISOString(),
    });
    expect(isReminderDue(quest, new Date('2026-07-31T20:20:00'), TODAY)).toBe(false);
  });

  it('is true again after the repeat interval has passed', () => {
    const quest = makeQuest({
      reminderDate: TODAY,
      reminderCount: 1,
      lastReminderAt: new Date('2026-07-31T20:10:00').toISOString(),
    });
    expect(isReminderDue(quest, new Date('2026-07-31T20:40:00'), TODAY)).toBe(true);
  });

  it('ignores a stale count/timestamp from a previous day', () => {
    const quest = makeQuest({
      reminderDate: '2026-07-30',
      reminderCount: MAX_REMINDERS_PER_DAY,
      lastReminderAt: new Date('2026-07-30T20:05:00').toISOString(),
    });
    expect(isReminderDue(quest, AT_TIME, TODAY)).toBe(true);
  });
});

describe('recordReminderShown', () => {
  it('starts the count at 1 on the first reminder of the day', () => {
    const result = recordReminderShown(makeQuest(), AT_TIME, TODAY);
    expect(result.reminderDate).toBe(TODAY);
    expect(result.reminderCount).toBe(1);
    expect(result.lastReminderAt).toBe(AT_TIME.toISOString());
  });

  it('increments the count for a later reminder on the same day', () => {
    const quest = makeQuest({ reminderDate: TODAY, reminderCount: 1 });
    const result = recordReminderShown(quest, new Date('2026-07-31T20:40:00'), TODAY);
    expect(result.reminderCount).toBe(2);
  });

  it('resets the count when the day has rolled over', () => {
    const quest = makeQuest({ reminderDate: '2026-07-30', reminderCount: MAX_REMINDERS_PER_DAY });
    const result = recordReminderShown(quest, AT_TIME, TODAY);
    expect(result.reminderCount).toBe(1);
    expect(result.reminderDate).toBe(TODAY);
  });
});
