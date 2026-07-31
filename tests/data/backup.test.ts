import { describe, expect, it } from 'vitest';
import { exportBackup, importBackup, isBackupPayload } from '../../src/data/backup';
import { characterRepository } from '../../src/data/repositories/characterRepository';
import { questRepository } from '../../src/data/repositories/questRepository';

describe('backup export/import', () => {
  it('round-trips character and quest data', async () => {
    const character = await characterRepository.getOrCreate();
    await characterRepository.save({ ...character, gold: 250 });
    await questRepository.create({
      characterId: character.id,
      domain: 'READING',
      title: '독서 30분',
      recurrence: 'DAILY',
    });

    const backup = await exportBackup();
    expect(backup.characters[0].gold).toBe(250);
    expect(backup.quests).toHaveLength(1);

    // simulate data loss, then restore
    await characterRepository.save({ ...character, gold: 0 });
    await importBackup(backup);

    const restored = await characterRepository.getOrCreate();
    expect(restored.gold).toBe(250);
    const restoredQuests = await questRepository.listByCharacter(character.id);
    expect(restoredQuests).toHaveLength(1);
    expect(restoredQuests[0].title).toBe('독서 30분');
  });

  it('isBackupPayload rejects malformed input', () => {
    expect(isBackupPayload(null)).toBe(false);
    expect(isBackupPayload({})).toBe(false);
    expect(isBackupPayload({ version: 1, characters: [] })).toBe(false); // missing arrays
    expect(
      isBackupPayload({ version: 1, characters: [], villages: [], quests: [], completionLogs: [], encounters: [] }),
    ).toBe(true);
  });
});
