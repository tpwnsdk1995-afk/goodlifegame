import type { Enemy } from '../domain/types';

export const LOCAL_CHARACTER_ID = 'local-character';
export const DEFAULT_CHARACTER_NAME = '주인공';
export const MAX_HUNTING_ATTEMPTS_PER_DAY = 3;

/** Static enemy roster for the hunting mini-game — content, not user data, so no DB table needed. */
export const ENEMY_ROSTER: Enemy[] = [
  { id: 'wild-dog', name: '들개', requiredPower: 60, rewardGold: 15, rewardXpByDomain: { EXERCISE: 5 } },
  { id: 'goblin', name: '고블린', requiredPower: 90, rewardGold: 25, rewardXpByDomain: { WORK: 8 } },
  { id: 'wolf-pack', name: '늑대 무리', requiredPower: 130, rewardGold: 40, rewardXpByDomain: { EXERCISE: 8, DIET: 4 } },
  { id: 'rogue-scholar', name: '사이비 학자', requiredPower: 170, rewardGold: 55, rewardXpByDomain: { STUDY: 10, READING: 6 } },
  { id: 'shadow-knight', name: '그림자 기사', requiredPower: 220, rewardGold: 80, rewardXpByDomain: { EXERCISE: 10, WORK: 10 } },
  { id: 'ancient-dragon', name: '고룡', requiredPower: 300, rewardGold: 150, rewardXpByDomain: { EXERCISE: 15, DIET: 15, STUDY: 15, READING: 15, WORK: 15 } },
];
