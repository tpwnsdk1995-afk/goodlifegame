import type { DomainStat } from './types';

export const GRACE_DAYS = 2;
export const DECAY_RATE_PER_DAY = 0.02;
export const MAX_DECAY_CAP = 0.2;

export const FATIGUE_DROP_PER_MISSED_DAY = 5;
export const FATIGUE_FLOOR = 20;
export const FATIGUE_RECOVER_ON_COMPLETE = 10;
export const FATIGUE_MAX = 100;

/** Days past the grace period — the only days that count toward any penalty. */
export function missedDaysBeyondGrace(daysSinceLastCompletion: number): number {
  return Math.max(0, daysSinceLastCompletion - GRACE_DAYS);
}

export function decayPercent(daysSinceLastCompletion: number): number {
  const missed = missedDaysBeyondGrace(daysSinceLastCompletion);
  return Math.min(MAX_DECAY_CAP, missed * DECAY_RATE_PER_DAY);
}

/**
 * Applies gentle decay to a stat's progress toward its next level.
 * The level itself is a floor and can never drop — only `xp` (in-progress) shrinks.
 */
export function applyStatDecay(stat: DomainStat, daysSinceLastCompletion: number): DomainStat {
  const pct = decayPercent(daysSinceLastCompletion);
  if (pct === 0) return stat;
  return { level: stat.level, xp: Math.floor(stat.xp * (1 - pct)) };
}

/**
 * Fatigue drops gently while away (never below FATIGUE_FLOOR), and recovers
 * quickly on the next completion — coming back should feel rewarding, not punishing.
 */
export function applyFatigueDecay(fatigue: number, daysSinceLastCompletion: number): number {
  const missed = missedDaysBeyondGrace(daysSinceLastCompletion);
  const dropped = fatigue - missed * FATIGUE_DROP_PER_MISSED_DAY;
  return Math.max(FATIGUE_FLOOR, dropped);
}

export function recoverFatigueOnComplete(fatigue: number): number {
  return Math.min(FATIGUE_MAX, fatigue + FATIGUE_RECOVER_ON_COMPLETE);
}
