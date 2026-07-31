import { useCharacterStore } from './characterStore';
import { useVillageStore } from './villageStore';
import { useQuestStore } from './questStore';
import { useCombatStore } from './combatStore';
import { completionLogRepository } from '../data/repositories/completionLogRepository';
import { combatRepository } from '../data/repositories/combatRepository';
import { questRepository } from '../data/repositories/questRepository';
import { MAX_HUNTING_ATTEMPTS_PER_DAY } from '../data/seed';
import { addXp } from '../domain/stats';
import { applyFatigueDecay, applyStatDecay, recoverFatigueOnComplete } from '../domain/decay';
import { xpForCompletion } from '../domain/stats';
import { computeTotalPower, resolveEncounter } from '../domain/combat';
import { daysSince, registerCompletion, toDateKey } from '../domain/streak';
import { DOMAINS, type Domain, type Quest } from '../domain/types';

/** Most recent lastCompletedDate across all quests in a domain, or null if never completed. */
function lastActivityForDomain(quests: Quest[], domain: Domain): string | null {
  return quests
    .filter((q) => q.domain === domain && q.lastCompletedDate)
    .reduce<string | null>((latest, q) => {
      const date = q.lastCompletedDate!;
      return !latest || date > latest ? date : latest;
    }, null);
}

/**
 * Loads character/village/quests, then applies gentle decay for time that has
 * passed since each domain was last touched. Call once on app startup.
 */
export async function initializeGame(): Promise<void> {
  const character = await useCharacterStore.getState().load();
  const village = await useVillageStore.getState().load(character.id);
  const quests = await useQuestStore.getState().load(character.id);
  await useCombatStore.getState().loadRecent(character.id);

  const today = new Date();

  // A domain/character with no completion history yet has nothing to decay from —
  // treat "never active" as zero elapsed days rather than feeding Infinity into the decay formula.
  const decayedStats = { ...character.stats };
  const decayedBuildings = village.buildings.map((building) => {
    const lastActivity = lastActivityForDomain(quests, building.domain);
    const days = lastActivity ? daysSince(lastActivity, today) : 0;
    decayedStats[building.domain] = applyStatDecay(character.stats[building.domain], days);
    return { ...building, ...applyStatDecay({ level: building.level, xp: building.xp }, days) };
  });

  const overallLastActivity = DOMAINS.reduce<string | null>((latest, domain) => {
    const d = lastActivityForDomain(quests, domain);
    return !latest || (d && d > latest) ? d ?? latest : latest;
  }, null);
  const fatigueDays = overallLastActivity ? daysSince(overallLastActivity, today) : 0;
  const fatigue = applyFatigueDecay(character.fatigue, fatigueDays);

  await useCharacterStore.getState().persist({ ...character, stats: decayedStats, fatigue });
  await useVillageStore.getState().persist({ ...village, buildings: decayedBuildings });
}

export interface CompleteQuestResult {
  statLeveledUp: boolean;
  buildingLeveledUp: boolean;
}

/** Marks a quest complete for today: updates streak, grants XP to the character stat and matching building. */
export async function completeQuest(questId: string): Promise<CompleteQuestResult | undefined> {
  const quest = useQuestStore.getState().quests.find((q) => q.id === questId);
  if (!quest) return undefined;

  const today = new Date();
  const todayKey = toDateKey(today);
  if (quest.lastCompletedDate === todayKey) return undefined; // already completed today

  const streakResult = registerCompletion(quest, today);
  const updatedQuest: Quest = { ...quest, ...streakResult };
  useQuestStore.getState().replaceQuest(updatedQuest);
  await completionLogRepository.create(quest.id, quest.domain, todayKey);
  await questRepository.save(updatedQuest); // replaceQuest above only updates in-memory state

  const xpGain = xpForCompletion(streakResult.streakCount);
  let statLeveledUp = false;
  let buildingLeveledUp = false;

  const character = useCharacterStore.getState().character;
  if (character) {
    const newStat = addXp(character.stats[quest.domain], xpGain);
    statLeveledUp = newStat.level > character.stats[quest.domain].level;
    const newFatigue = recoverFatigueOnComplete(character.fatigue);
    await useCharacterStore.getState().persist({
      ...character,
      stats: { ...character.stats, [quest.domain]: newStat },
      fatigue: newFatigue,
    });
  }

  const village = useVillageStore.getState().village;
  if (village) {
    const buildings = village.buildings.map((building) => {
      if (building.domain !== quest.domain) return building;
      const upgraded = addXp(building, xpGain);
      buildingLeveledUp = upgraded.level > building.level;
      return { ...building, ...upgraded };
    });
    await useVillageStore.getState().persist({ ...village, buildings });
  }

  return { statLeveledUp, buildingLeveledUp };
}

export async function getAvailableHuntingAttempts(): Promise<number> {
  const character = useCharacterStore.getState().character;
  if (!character) return 0;

  const todayKey = toDateKey(new Date());
  const completionsToday = await completionLogRepository.countForDate(todayKey);
  const encountersToday = await combatRepository.countEncountersOnDate(character.id, todayKey);
  const earned = Math.min(completionsToday, MAX_HUNTING_ATTEMPTS_PER_DAY);
  return Math.max(0, earned - encountersToday);
}

/** Spends one hunting attempt against the given enemy. Throws if no attempts remain. */
export async function attemptHunt(enemyId: string) {
  const character = useCharacterStore.getState().character;
  if (!character) throw new Error('캐릭터가 아직 로드되지 않았어요.');

  const available = await getAvailableHuntingAttempts();
  if (available <= 0) throw new Error('오늘 사용 가능한 사냥 시도가 없어요. 퀘스트를 더 완료해보세요!');

  const enemy = combatRepository.listEnemies().find((e) => e.id === enemyId);
  if (!enemy) throw new Error('알 수 없는 적입니다.');

  const power = computeTotalPower(character);
  const result = resolveEncounter(power, enemy);
  const encounter = await combatRepository.create({
    characterId: character.id,
    enemyId,
    powerAtTime: power,
    outcome: result.outcome,
    rewardsGranted: result.rewardsGranted,
  });
  useCombatStore.getState().prepend(encounter);

  let newStats = character.stats;
  for (const [domain, xp] of Object.entries(result.rewardsGranted.xp)) {
    if (!xp) continue;
    newStats = { ...newStats, [domain]: addXp(newStats[domain as Domain], xp) };
  }
  await useCharacterStore.getState().persist({
    ...character,
    gold: character.gold + result.rewardsGranted.gold,
    stats: newStats,
  });

  return encounter;
}
