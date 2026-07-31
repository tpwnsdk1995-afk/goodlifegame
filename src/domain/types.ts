export type Domain = 'EXERCISE' | 'DIET' | 'STUDY' | 'READING' | 'WORK';

export const DOMAINS: Domain[] = ['EXERCISE', 'DIET', 'STUDY', 'READING', 'WORK'];

export const DOMAIN_LABEL: Record<Domain, string> = {
  EXERCISE: '운동',
  DIET: '식단',
  STUDY: '공부',
  READING: '독서',
  WORK: '업무 능률',
};

export const DOMAIN_BUILDING_LABEL: Record<Domain, string> = {
  EXERCISE: '훈련소',
  DIET: '주방',
  STUDY: '공부방',
  READING: '서재',
  WORK: '사무실',
};

export interface DomainStat {
  level: number;
  xp: number;
}

export interface Character {
  id: string;
  name: string;
  gold: number;
  fatigue: number; // 0-100
  stats: Record<Domain, DomainStat>;
  createdAt: string;
}

export interface Building {
  domain: Domain;
  level: number;
  xp: number;
}

export interface Village {
  id: string;
  characterId: string;
  buildings: Building[];
}

export type Recurrence = 'DAILY' | { type: 'WEEKDAYS'; days: number[] };

export interface Quest {
  id: string;
  characterId: string;
  domain: Domain;
  title: string;
  recurrence: Recurrence;
  active: boolean;
  streakCount: number;
  longestStreak: number;
  lastCompletedDate: string | null; // YYYY-MM-DD
  createdAt: string;
}

export interface CompletionLog {
  id: string;
  questId: string;
  domain: Domain;
  date: string; // YYYY-MM-DD
  completedAt: string; // ISO timestamp
}

export interface Enemy {
  id: string;
  name: string;
  requiredPower: number;
  rewardGold: number;
  rewardXpByDomain?: Partial<Record<Domain, number>>;
}

export type EncounterOutcome = 'WIN' | 'LOSE' | 'PARTIAL';

export interface Encounter {
  id: string;
  characterId: string;
  enemyId: string;
  timestamp: string;
  powerAtTime: number;
  outcome: EncounterOutcome;
  rewardsGranted: { gold: number; xp: Partial<Record<Domain, number>> };
}

export function createEmptyStats(): Record<Domain, DomainStat> {
  return DOMAINS.reduce((acc, domain) => {
    acc[domain] = { level: 1, xp: 0 };
    return acc;
  }, {} as Record<Domain, DomainStat>);
}

export function createDefaultBuildings(): Building[] {
  return DOMAINS.map((domain) => ({ domain, level: 1, xp: 0 }));
}
