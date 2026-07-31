import { describe, expect, it } from 'vitest';
import { characterRepository } from '../../src/data/repositories/characterRepository';
import { villageRepository } from '../../src/data/repositories/villageRepository';
import { questRepository } from '../../src/data/repositories/questRepository';
import { completionLogRepository } from '../../src/data/repositories/completionLogRepository';
import { combatRepository } from '../../src/data/repositories/combatRepository';
import { LOCAL_CHARACTER_ID } from '../../src/data/seed';

describe('characterRepository', () => {
  it('creates a default character on first call', async () => {
    const character = await characterRepository.getOrCreate();
    expect(character.id).toBe(LOCAL_CHARACTER_ID);
    expect(character.fatigue).toBe(100);
    expect(character.gold).toBe(0);
  });

  it('returns the same character on subsequent calls instead of recreating it', async () => {
    const first = await characterRepository.getOrCreate();
    await characterRepository.save({ ...first, gold: 50 });
    const second = await characterRepository.getOrCreate();
    expect(second.gold).toBe(50);
  });

  it('is safe to call getOrCreate concurrently without a duplicate-key error', async () => {
    const [a, b] = await Promise.all([characterRepository.getOrCreate(), characterRepository.getOrCreate()]);
    expect(a.id).toBe(b.id);
  });
});

describe('villageRepository', () => {
  it('creates a village with all 5 domain buildings at level 1', async () => {
    const village = await villageRepository.getOrCreate('char-1');
    expect(village.buildings).toHaveLength(5);
    expect(village.buildings.every((b) => b.level === 1)).toBe(true);
  });

  it('persists changes via save', async () => {
    const village = await villageRepository.getOrCreate('char-1');
    const updated = { ...village, buildings: village.buildings.map((b) => ({ ...b, level: 2 })) };
    await villageRepository.save(updated);
    const reloaded = await villageRepository.getOrCreate('char-1');
    expect(reloaded.buildings.every((b) => b.level === 2)).toBe(true);
  });
});

describe('questRepository', () => {
  it('creates a quest with sensible defaults', async () => {
    const quest = await questRepository.create({
      characterId: 'char-1',
      domain: 'EXERCISE',
      title: '스쿼트 30개',
      recurrence: 'DAILY',
    });
    expect(quest.active).toBe(true);
    expect(quest.streakCount).toBe(0);
    expect(quest.reminderTime).toBeNull();
  });

  it('lists only quests for the given character', async () => {
    await questRepository.create({ characterId: 'char-1', domain: 'EXERCISE', title: 'A', recurrence: 'DAILY' });
    await questRepository.create({ characterId: 'char-2', domain: 'STUDY', title: 'B', recurrence: 'DAILY' });
    const quests = await questRepository.listByCharacter('char-1');
    expect(quests).toHaveLength(1);
    expect(quests[0].title).toBe('A');
  });

  it('save() persists edits', async () => {
    const quest = await questRepository.create({ characterId: 'char-1', domain: 'EXERCISE', title: 'A', recurrence: 'DAILY' });
    await questRepository.save({ ...quest, title: 'B' });
    const [reloaded] = await questRepository.listByCharacter('char-1');
    expect(reloaded.title).toBe('B');
  });

  it('setActive() toggles the active flag', async () => {
    const quest = await questRepository.create({ characterId: 'char-1', domain: 'EXERCISE', title: 'A', recurrence: 'DAILY' });
    await questRepository.setActive(quest.id, false);
    const [reloaded] = await questRepository.listByCharacter('char-1');
    expect(reloaded.active).toBe(false);
  });

  it('remove() deletes the quest', async () => {
    const quest = await questRepository.create({ characterId: 'char-1', domain: 'EXERCISE', title: 'A', recurrence: 'DAILY' });
    await questRepository.remove(quest.id);
    const quests = await questRepository.listByCharacter('char-1');
    expect(quests).toHaveLength(0);
  });
});

describe('completionLogRepository', () => {
  it('hasCompletedOn is false until a log is created for that date', async () => {
    expect(await completionLogRepository.hasCompletedOn('q1', '2026-07-31')).toBe(false);
    await completionLogRepository.create('q1', 'EXERCISE', '2026-07-31');
    expect(await completionLogRepository.hasCompletedOn('q1', '2026-07-31')).toBe(true);
  });

  it('countForDate counts logs across quests on the same date', async () => {
    await completionLogRepository.create('q1', 'EXERCISE', '2026-07-31');
    await completionLogRepository.create('q2', 'DIET', '2026-07-31');
    await completionLogRepository.create('q3', 'STUDY', '2026-07-30');
    expect(await completionLogRepository.countForDate('2026-07-31')).toBe(2);
  });
});

describe('combatRepository', () => {
  it('listEnemies returns the static roster', () => {
    expect(combatRepository.listEnemies().length).toBeGreaterThan(0);
  });

  it('countEncountersOnDate only counts encounters for that character and date', async () => {
    await combatRepository.create({
      characterId: 'char-1',
      enemyId: 'wild-dog',
      powerAtTime: 50,
      outcome: 'WIN',
      rewardsGranted: { gold: 10, xp: {} },
    });
    const todayKey = new Date().toISOString().slice(0, 10);
    expect(await combatRepository.countEncountersOnDate('char-1', todayKey)).toBe(1);
    expect(await combatRepository.countEncountersOnDate('char-2', todayKey)).toBe(0);
  });

  it('listRecent returns newest-first, limited', async () => {
    for (let i = 0; i < 3; i++) {
      await combatRepository.create({
        characterId: 'char-1',
        enemyId: 'wild-dog',
        powerAtTime: 50,
        outcome: 'WIN',
        rewardsGranted: { gold: 10, xp: {} },
      });
    }
    const recent = await combatRepository.listRecent('char-1', 2);
    expect(recent).toHaveLength(2);
  });
});
