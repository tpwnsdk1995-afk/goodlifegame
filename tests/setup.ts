import 'fake-indexeddb/auto';
import { afterEach } from 'vitest';
import { db } from '../src/data/db';
import { useCharacterStore } from '../src/store/characterStore';
import { useVillageStore } from '../src/store/villageStore';
import { useQuestStore } from '../src/store/questStore';
import { useCombatStore } from '../src/store/combatStore';

/** Clears every IndexedDB table and resets all Zustand stores to their initial state. */
export async function resetGameState(): Promise<void> {
  await db.transaction('rw', db.characters, db.villages, db.quests, db.completionLogs, db.encounters, async () => {
    await Promise.all([
      db.characters.clear(),
      db.villages.clear(),
      db.quests.clear(),
      db.completionLogs.clear(),
      db.encounters.clear(),
    ]);
  });

  useCharacterStore.setState({ character: null });
  useVillageStore.setState({ village: null });
  useQuestStore.setState({ quests: [] });
  useCombatStore.setState({ encounters: [] });
}

afterEach(async () => {
  await resetGameState();
});
