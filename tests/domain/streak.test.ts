import { describe, expect, it } from 'vitest';
import { daysSince, registerCompletion, toDateKey } from '../../src/domain/streak';
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
    ...overrides,
  };
}

describe('daysSince', () => {
  it('returns Infinity when never completed', () => {
    expect(daysSince(null, new Date('2026-07-31'))).toBe(Infinity);
  });

  it('computes calendar day difference', () => {
    expect(daysSince('2026-07-28', new Date('2026-07-31'))).toBe(3);
  });
});

describe('registerCompletion (DAILY)', () => {
  it('starts a streak at 1 on first completion', () => {
    const quest = makeQuest();
    const result = registerCompletion(quest, new Date('2026-07-31'));
    expect(result).toEqual({ streakCount: 1, longestStreak: 1, lastCompletedDate: '2026-07-31' });
  });

  it('continues the streak when completed the day after the last completion', () => {
    const quest = makeQuest({ streakCount: 4, longestStreak: 4, lastCompletedDate: '2026-07-30' });
    const result = registerCompletion(quest, new Date('2026-07-31'));
    expect(result.streakCount).toBe(5);
    expect(result.longestStreak).toBe(5);
  });

  it('resets the streak when a day was skipped', () => {
    const quest = makeQuest({ streakCount: 4, longestStreak: 4, lastCompletedDate: '2026-07-25' });
    const result = registerCompletion(quest, new Date('2026-07-31'));
    expect(result.streakCount).toBe(1);
    expect(result.longestStreak).toBe(4); // longest streak record is preserved
  });

  it('is idempotent when already completed today', () => {
    const quest = makeQuest({ streakCount: 3, longestStreak: 3, lastCompletedDate: '2026-07-31' });
    const result = registerCompletion(quest, new Date('2026-07-31'));
    expect(result).toEqual({ streakCount: 3, longestStreak: 3, lastCompletedDate: '2026-07-31' });
  });
});

describe('registerCompletion (WEEKDAYS)', () => {
  it('continues the streak across the recurrence schedule, skipping non-scheduled days', () => {
    // 2026-07-31 is a Friday (day 5). Schedule: Mon/Wed/Fri (1,3,5).
    // Previous scheduled day before Friday is Wednesday 2026-07-29.
    const quest = makeQuest({
      recurrence: { type: 'WEEKDAYS', days: [1, 3, 5] },
      streakCount: 2,
      longestStreak: 2,
      lastCompletedDate: '2026-07-29',
    });
    const result = registerCompletion(quest, new Date('2026-07-31'));
    expect(result.streakCount).toBe(3);
  });
});

describe('toDateKey', () => {
  it('formats as yyyy-MM-dd', () => {
    expect(toDateKey(new Date('2026-07-31'))).toBe('2026-07-31');
  });
});
