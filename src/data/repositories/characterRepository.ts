import { db } from '../db';
import { DEFAULT_CHARACTER_NAME, LOCAL_CHARACTER_ID } from '../seed';
import { createEmptyStats, type Character } from '../../domain/types';

function createDefaultCharacter(): Character {
  return {
    id: LOCAL_CHARACTER_ID,
    name: DEFAULT_CHARACTER_NAME,
    gold: 0,
    fatigue: 100,
    stats: createEmptyStats(),
    createdAt: new Date().toISOString(),
  };
}

export const characterRepository = {
  async getOrCreate(): Promise<Character> {
    const existing = await db.characters.get(LOCAL_CHARACTER_ID);
    if (existing) return existing;

    const created = createDefaultCharacter();
    await db.characters.put(created); // put, not add: safe if two callers race to create the same id
    return created;
  },

  async save(character: Character): Promise<void> {
    await db.characters.put(character);
  },
};
