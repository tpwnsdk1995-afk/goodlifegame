import { describe, expect, it } from 'vitest';
import { addXp, streakMultiplier, xpForCompletion, xpToNextLevel } from '../../src/domain/stats';

describe('xpToNextLevel', () => {
  it('grows linearly with level', () => {
    expect(xpToNextLevel(1)).toBe(75);
    expect(xpToNextLevel(2)).toBe(100);
  });
});

describe('streakMultiplier', () => {
  it('is 1x with no streak', () => {
    expect(streakMultiplier(0)).toBe(1);
  });

  it('increases with streak days', () => {
    expect(streakMultiplier(5)).toBeCloseTo(1.25);
  });

  it('caps at MAX_STREAK_BONUS_DAYS', () => {
    expect(streakMultiplier(10)).toBeCloseTo(streakMultiplier(100));
  });
});

describe('xpForCompletion', () => {
  it('scales base xp by streak multiplier', () => {
    expect(xpForCompletion(0)).toBe(10);
    expect(xpForCompletion(10)).toBe(15);
  });
});

describe('addXp', () => {
  it('accumulates xp without leveling up', () => {
    const result = addXp({ level: 1, xp: 0 }, 30);
    expect(result).toEqual({ level: 1, xp: 30 });
  });

  it('rolls over into a level-up', () => {
    const result = addXp({ level: 1, xp: 60 }, 20); // needs 75 to level up from 1
    expect(result).toEqual({ level: 2, xp: 5 });
  });

  it('handles multiple level-ups from a single large xp grant', () => {
    const result = addXp({ level: 1, xp: 0 }, 300);
    expect(result.level).toBeGreaterThan(2);
    expect(result.xp).toBeGreaterThanOrEqual(0);
    expect(result.xp).toBeLessThan(xpToNextLevel(result.level));
  });

  it('never mutates the input stat', () => {
    const input = { level: 1, xp: 0 };
    addXp(input, 100);
    expect(input).toEqual({ level: 1, xp: 0 });
  });
});
