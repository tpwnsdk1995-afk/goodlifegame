import { db } from './db';
import type { Character, CompletionLog, Encounter, Quest, Village } from '../domain/types';

export const BACKUP_VERSION = 1;

export interface BackupPayload {
  version: number;
  exportedAt: string;
  characters: Character[];
  villages: Village[];
  quests: Quest[];
  completionLogs: CompletionLog[];
  encounters: Encounter[];
}

export async function exportBackup(): Promise<BackupPayload> {
  const [characters, villages, quests, completionLogs, encounters] = await Promise.all([
    db.characters.toArray(),
    db.villages.toArray(),
    db.quests.toArray(),
    db.completionLogs.toArray(),
    db.encounters.toArray(),
  ]);

  return {
    version: BACKUP_VERSION,
    exportedAt: new Date().toISOString(),
    characters,
    villages,
    quests,
    completionLogs,
    encounters,
  };
}

export function isBackupPayload(value: unknown): value is BackupPayload {
  if (!value || typeof value !== 'object') return false;
  const v = value as Record<string, unknown>;
  return (
    typeof v.version === 'number' &&
    Array.isArray(v.characters) &&
    Array.isArray(v.villages) &&
    Array.isArray(v.quests) &&
    Array.isArray(v.completionLogs) &&
    Array.isArray(v.encounters)
  );
}

/** Replaces all local data with the given backup. Caller is responsible for confirming with the user first. */
export async function importBackup(payload: BackupPayload): Promise<void> {
  await db.transaction(
    'rw',
    db.characters,
    db.villages,
    db.quests,
    db.completionLogs,
    db.encounters,
    async () => {
      await Promise.all([
        db.characters.clear(),
        db.villages.clear(),
        db.quests.clear(),
        db.completionLogs.clear(),
        db.encounters.clear(),
      ]);
      await Promise.all([
        db.characters.bulkPut(payload.characters),
        db.villages.bulkPut(payload.villages),
        db.quests.bulkPut(payload.quests),
        db.completionLogs.bulkPut(payload.completionLogs),
        db.encounters.bulkPut(payload.encounters),
      ]);
    },
  );
}
