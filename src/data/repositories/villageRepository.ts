import { db } from '../db';
import { createDefaultBuildings, type Village } from '../../domain/types';

function createDefaultVillage(characterId: string): Village {
  return {
    id: `village-${characterId}`,
    characterId,
    buildings: createDefaultBuildings(),
  };
}

export const villageRepository = {
  async getOrCreate(characterId: string): Promise<Village> {
    const existing = await db.villages.where('characterId').equals(characterId).first();
    if (existing) return existing;

    const created = createDefaultVillage(characterId);
    await db.villages.put(created); // put, not add: safe if two callers race to create the same id
    return created;
  },

  async save(village: Village): Promise<void> {
    await db.villages.put(village);
  },
};
