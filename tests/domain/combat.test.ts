import { describe, expect, it } from 'vitest';
import { computeTotalPower, resolveEncounter } from '../../src/domain/combat';
import { createEmptyStats, type Character, type Enemy } from '../../src/domain/types';

function makeCharacter(levels: Partial<Record<string, number>> = {}): Character {
  const stats = createEmptyStats();
  for (const [domain, level] of Object.entries(levels)) {
    stats[domain as keyof typeof stats].level = level!;
  }
  return { id: 'c1', name: '주인공', gold: 0, fatigue: 100, stats, createdAt: new Date().toISOString() };
}

describe('computeTotalPower', () => {
  it('sums all domain levels scaled by POWER_PER_LEVEL', () => {
    const character = makeCharacter(); // all level 1
    expect(computeTotalPower(character)).toBe(5 * 10);
  });

  it('reflects individual domain growth', () => {
    const character = makeCharacter({ EXERCISE: 5 });
    expect(computeTotalPower(character)).toBe((5 + 1 + 1 + 1 + 1) * 10);
  });
});

describe('resolveEncounter', () => {
  const enemy: Enemy = { id: 'e1', name: '들개', requiredPower: 100, rewardGold: 20, rewardXpByDomain: { EXERCISE: 10 } };

  it('wins with full rewards when power meets the requirement', () => {
    const result = resolveEncounter(100, enemy);
    expect(result.outcome).toBe('WIN');
    expect(result.rewardsGranted).toEqual({ gold: 20, xp: { EXERCISE: 10 } });
  });

  it('grants partial rewards on a near-miss', () => {
    const result = resolveEncounter(75, enemy); // 75% of required power
    expect(result.outcome).toBe('PARTIAL');
    expect(result.rewardsGranted.gold).toBe(10);
    expect(result.rewardsGranted.xp.EXERCISE).toBe(5);
  });

  it('loses with no rewards when far below the requirement', () => {
    const result = resolveEncounter(50, enemy);
    expect(result.outcome).toBe('LOSE');
    expect(result.rewardsGranted).toEqual({ gold: 0, xp: {} });
  });
});
