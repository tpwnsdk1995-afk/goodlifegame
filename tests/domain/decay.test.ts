import { describe, expect, it } from 'vitest';
import {
  applyFatigueDecay,
  applyStatDecay,
  decayPercent,
  FATIGUE_FLOOR,
  MAX_DECAY_CAP,
  recoverFatigueOnComplete,
} from '../../src/domain/decay';

describe('decayPercent', () => {
  it('is zero within the grace period', () => {
    expect(decayPercent(0)).toBe(0);
    expect(decayPercent(1)).toBe(0);
    expect(decayPercent(2)).toBe(0);
  });

  it('grows with days missed beyond grace', () => {
    expect(decayPercent(3)).toBeCloseTo(0.02);
    expect(decayPercent(5)).toBeCloseTo(0.06);
  });

  it('never exceeds the cap even after a long absence', () => {
    expect(decayPercent(365)).toBe(MAX_DECAY_CAP);
  });
});

describe('applyStatDecay', () => {
  it('leaves stat untouched within grace period', () => {
    expect(applyStatDecay({ level: 3, xp: 40 }, 1)).toEqual({ level: 3, xp: 40 });
  });

  it('reduces only xp progress, never the level (floor protection)', () => {
    const result = applyStatDecay({ level: 5, xp: 100 }, 365);
    expect(result.level).toBe(5);
    expect(result.xp).toBe(80); // 20% cap
  });
});

describe('fatigue decay/recovery', () => {
  it('never drops below the floor', () => {
    expect(applyFatigueDecay(30, 100)).toBe(FATIGUE_FLOOR);
  });

  it('drops gently within a few missed days', () => {
    expect(applyFatigueDecay(80, 4)).toBe(70); // 2 days beyond grace * 5
  });

  it('recovers quickly on the next completion', () => {
    expect(recoverFatigueOnComplete(50)).toBe(60);
  });

  it('caps recovery at 100', () => {
    expect(recoverFatigueOnComplete(95)).toBe(100);
  });
});
