import { db } from '../db';
import { ENEMY_ROSTER } from '../seed';
import type { Domain, Encounter, EncounterOutcome } from '../../domain/types';

export interface NewEncounterInput {
  characterId: string;
  enemyId: string;
  powerAtTime: number;
  outcome: EncounterOutcome;
  rewardsGranted: { gold: number; xp: Partial<Record<Domain, number>> };
}

export const combatRepository = {
  listEnemies() {
    return ENEMY_ROSTER;
  },

  async countEncountersOnDate(characterId: string, dateKey: string): Promise<number> {
    const encounters = await db.encounters.where('characterId').equals(characterId).toArray();
    return encounters.filter((e) => e.timestamp.startsWith(dateKey)).length;
  },

  async create(input: NewEncounterInput): Promise<Encounter> {
    const encounter: Encounter = {
      id: crypto.randomUUID(),
      characterId: input.characterId,
      enemyId: input.enemyId,
      timestamp: new Date().toISOString(),
      powerAtTime: input.powerAtTime,
      outcome: input.outcome,
      rewardsGranted: input.rewardsGranted,
    };
    await db.encounters.add(encounter);
    return encounter;
  },

  async listRecent(characterId: string, limit = 10): Promise<Encounter[]> {
    const encounters = await db.encounters.where('characterId').equals(characterId).toArray();
    return encounters.sort((a, b) => b.timestamp.localeCompare(a.timestamp)).slice(0, limit);
  },
};
