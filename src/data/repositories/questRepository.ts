import { db } from '../db';
import type { Domain, Quest, Recurrence } from '../../domain/types';

export interface NewQuestInput {
  characterId: string;
  domain: Domain;
  title: string;
  recurrence: Recurrence;
}

export const questRepository = {
  async listByCharacter(characterId: string): Promise<Quest[]> {
    return db.quests.where('characterId').equals(characterId).toArray();
  },

  async create(input: NewQuestInput): Promise<Quest> {
    const quest: Quest = {
      id: crypto.randomUUID(),
      characterId: input.characterId,
      domain: input.domain,
      title: input.title,
      recurrence: input.recurrence,
      active: true,
      streakCount: 0,
      longestStreak: 0,
      lastCompletedDate: null,
      createdAt: new Date().toISOString(),
    };
    await db.quests.add(quest);
    return quest;
  },

  async save(quest: Quest): Promise<void> {
    await db.quests.put(quest);
  },

  async setActive(id: string, active: boolean): Promise<void> {
    await db.quests.update(id, { active });
  },
};
