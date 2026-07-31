import type { Character, Domain, Enemy, EncounterOutcome } from './types';
import { DOMAINS } from './types';

export const POWER_PER_LEVEL = 10;
export const PARTIAL_WIN_THRESHOLD = 0.7; // near-miss: 70% of required power still yields partial rewards

/** Total combat power: sum of all domain stat levels, scaled. Equal weighting across domains. */
export function computeTotalPower(character: Character): number {
  return DOMAINS.reduce((sum, domain) => sum + character.stats[domain].level * POWER_PER_LEVEL, 0);
}

export interface EncounterResult {
  outcome: EncounterOutcome;
  rewardsGranted: { gold: number; xp: Partial<Record<Domain, number>> };
}

export function resolveEncounter(power: number, enemy: Enemy): EncounterResult {
  if (power >= enemy.requiredPower) {
    return {
      outcome: 'WIN',
      rewardsGranted: { gold: enemy.rewardGold, xp: enemy.rewardXpByDomain ?? {} },
    };
  }

  if (power >= enemy.requiredPower * PARTIAL_WIN_THRESHOLD) {
    const halvedXp = Object.fromEntries(
      Object.entries(enemy.rewardXpByDomain ?? {}).map(([domain, xp]) => [domain, Math.round((xp ?? 0) / 2)]),
    ) as Partial<Record<Domain, number>>;

    return {
      outcome: 'PARTIAL',
      rewardsGranted: { gold: Math.round(enemy.rewardGold / 2), xp: halvedXp },
    };
  }

  return { outcome: 'LOSE', rewardsGranted: { gold: 0, xp: {} } };
}
