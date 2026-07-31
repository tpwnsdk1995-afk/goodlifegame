import { DOMAINS, type DomainStat, type Character } from './types';

export const BASE_QUEST_XP = 10;
export const MAX_STREAK_BONUS_DAYS = 10;
export const STREAK_BONUS_PER_DAY = 0.05; // +5% per streak day, capped

/** XP required to advance from `level` to `level + 1`. */
export function xpToNextLevel(level: number): number {
  return 50 + level * 25;
}

/** Multiplier applied to base XP based on the quest's current streak. */
export function streakMultiplier(streakCount: number): number {
  const cappedStreak = Math.min(streakCount, MAX_STREAK_BONUS_DAYS);
  return 1 + cappedStreak * STREAK_BONUS_PER_DAY;
}

export function xpForCompletion(streakCount: number): number {
  return Math.round(BASE_QUEST_XP * streakMultiplier(streakCount));
}

/**
 * Adds XP to a stat, rolling over into level-ups as needed.
 * Returns a new DomainStat; never mutates the input.
 */
export function addXp(stat: DomainStat, amount: number): DomainStat {
  let { level, xp } = stat;
  xp += amount;

  let needed = xpToNextLevel(level);
  while (xp >= needed) {
    xp -= needed;
    level += 1;
    needed = xpToNextLevel(level);
  }

  return { level, xp };
}

/** Average domain level across all 5 stats — drives the character sprite's visual tier. */
export function averageDomainLevel(character: Character): number {
  const total = DOMAINS.reduce((sum, domain) => sum + character.stats[domain].level, 0);
  return total / DOMAINS.length;
}
