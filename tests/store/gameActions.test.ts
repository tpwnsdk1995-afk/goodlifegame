import { describe, expect, it } from 'vitest';
import { attemptHunt, completeQuest, getAvailableHuntingAttempts, initializeGame } from '../../src/store/gameActions';
import { useCharacterStore } from '../../src/store/characterStore';
import { useVillageStore } from '../../src/store/villageStore';
import { useQuestStore } from '../../src/store/questStore';
import { characterRepository } from '../../src/data/repositories/characterRepository';
import { MAX_HUNTING_ATTEMPTS_PER_DAY } from '../../src/data/seed';

describe('initializeGame', () => {
  it('does not decay a brand-new character (regression: fatigue used to drop to the floor immediately)', async () => {
    await initializeGame();
    const character = useCharacterStore.getState().character;
    expect(character?.fatigue).toBe(100);
    expect(character?.stats.EXERCISE).toEqual({ level: 1, xp: 0 });
  });

  it('loads character/village/quests into their stores', async () => {
    await initializeGame();
    expect(useCharacterStore.getState().character).not.toBeNull();
    expect(useVillageStore.getState().village).not.toBeNull();
    expect(useQuestStore.getState().quests).toEqual([]);
  });
});

async function setupQuest(domain: 'EXERCISE' = 'EXERCISE') {
  await initializeGame();
  const character = useCharacterStore.getState().character!;
  const quest = await useQuestStore.getState().addQuest({
    characterId: character.id,
    domain,
    title: '스쿼트 30개',
    recurrence: 'DAILY',
  });
  return { character, quest };
}

describe('completeQuest', () => {
  it('increments the streak and grants xp to the matching stat and building', async () => {
    const { quest } = await setupQuest();
    const result = await completeQuest(quest.id);

    expect(result).toEqual({ statLeveledUp: false, buildingLeveledUp: false });
    const updatedQuest = useQuestStore.getState().quests.find((q) => q.id === quest.id)!;
    expect(updatedQuest.streakCount).toBe(1);
    expect(useCharacterStore.getState().character!.stats.EXERCISE.xp).toBeGreaterThan(0);
    expect(useVillageStore.getState().village!.buildings.find((b) => b.domain === 'EXERCISE')!.xp).toBeGreaterThan(0);
  });

  it('is idempotent when completed twice in the same day', async () => {
    const { quest } = await setupQuest();
    await completeQuest(quest.id);
    const xpAfterFirst = useCharacterStore.getState().character!.stats.EXERCISE.xp;
    await completeQuest(quest.id);
    expect(useCharacterStore.getState().character!.stats.EXERCISE.xp).toBe(xpAfterFirst);
  });

  it('reports a level-up on both the stat and the building when xp crosses the threshold', async () => {
    const { character, quest } = await setupQuest();
    // xpToNextLevel(1) = 75; push the stat and building right to the edge first.
    await characterRepository.save({ ...character, stats: { ...character.stats, EXERCISE: { level: 1, xp: 70 } } });
    const village = useVillageStore.getState().village!;
    await useVillageStore.getState().persist({
      ...village,
      buildings: village.buildings.map((b) => (b.domain === 'EXERCISE' ? { ...b, xp: 70 } : b)),
    });
    // reload character/village into the store since we edited the repository directly
    await useCharacterStore.getState().load();
    await useVillageStore.getState().load(character.id);

    const result = await completeQuest(quest.id);
    expect(result).toEqual({ statLeveledUp: true, buildingLeveledUp: true });
    expect(useCharacterStore.getState().character!.stats.EXERCISE.level).toBe(2);
  });
});

describe('hunting attempts', () => {
  it('earns zero attempts with zero completions', async () => {
    await initializeGame();
    expect(await getAvailableHuntingAttempts()).toBe(0);
  });

  it('earns one attempt per completion, capped at the daily max', async () => {
    await initializeGame();
    const character = useCharacterStore.getState().character!;
    for (let i = 0; i < MAX_HUNTING_ATTEMPTS_PER_DAY + 2; i++) {
      const quest = await useQuestStore.getState().addQuest({
        characterId: character.id,
        domain: 'EXERCISE',
        title: `루틴 ${i}`,
        recurrence: 'DAILY',
      });
      await completeQuest(quest.id);
    }
    expect(await getAvailableHuntingAttempts()).toBe(MAX_HUNTING_ATTEMPTS_PER_DAY);
  });

  it('attemptHunt spends one attempt and refuses once none remain', async () => {
    const { quest } = await setupQuest();
    await completeQuest(quest.id);
    expect(await getAvailableHuntingAttempts()).toBe(1);

    await attemptHunt('wild-dog');
    expect(await getAvailableHuntingAttempts()).toBe(0);
    await expect(attemptHunt('wild-dog')).rejects.toThrow();
  });
});
