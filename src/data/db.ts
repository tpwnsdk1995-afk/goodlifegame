import Dexie, { type EntityTable } from 'dexie';
import type { Character, CompletionLog, Encounter, Quest, Village } from '../domain/types';

export class GoodLifeDB extends Dexie {
  characters!: EntityTable<Character, 'id'>;
  villages!: EntityTable<Village, 'id'>;
  quests!: EntityTable<Quest, 'id'>;
  completionLogs!: EntityTable<CompletionLog, 'id'>;
  encounters!: EntityTable<Encounter, 'id'>;

  constructor() {
    super('goodlifegame');
    this.version(1).stores({
      characters: 'id',
      villages: 'id, characterId',
      quests: 'id, characterId, domain, active',
      completionLogs: 'id, questId, domain, date',
      encounters: 'id, characterId, timestamp',
    });
  }
}

export const db = new GoodLifeDB();
