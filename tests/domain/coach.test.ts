import { describe, expect, it } from 'vitest';
import { pickCoachMessage } from '../../src/domain/coach';

function ctx(overrides: Partial<Parameters<typeof pickCoachMessage>[0]> = {}) {
  return {
    hasQuests: true,
    totalActive: 3,
    completedToday: 0,
    maxStreak: 0,
    fatigue: 100,
    hour: 10,
    ...overrides,
  };
}

describe('pickCoachMessage', () => {
  it('prompts to create a routine when none exist', () => {
    expect(pickCoachMessage(ctx({ hasQuests: false }))).toMatch(/등록된 루틴이 없어요/);
  });

  it('celebrates when everything is done today', () => {
    expect(pickCoachMessage(ctx({ completedToday: 3, totalActive: 3 }))).toMatch(/최고예요/);
  });

  it('gives special praise for a long streak once everything is done', () => {
    const result = pickCoachMessage(ctx({ completedToday: 3, totalActive: 3, maxStreak: 7 }));
    expect(result).toMatch(/개근/);
  });

  it('nudges gently in the evening when nothing is done yet', () => {
    expect(pickCoachMessage(ctx({ completedToday: 0, hour: 21 }))).toMatch(/지금이라도/);
  });

  it('is gentle about low fatigue when nothing is done yet (daytime)', () => {
    expect(pickCoachMessage(ctx({ completedToday: 0, hour: 10, fatigue: 30 }))).toMatch(/무리하지 말고/);
  });

  it('gives a plain start prompt when nothing is done and fatigue/time are fine', () => {
    expect(pickCoachMessage(ctx({ completedToday: 0, hour: 10, fatigue: 90 }))).toMatch(/시작해볼까요/);
  });

  it('encourages finishing the rest when partially done', () => {
    expect(pickCoachMessage(ctx({ completedToday: 1, totalActive: 3 }))).toBe('좋아요! 남은 2개도 마저 끝내볼까요?');
  });
});
