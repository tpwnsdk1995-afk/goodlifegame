export interface CoachContext {
  hasQuests: boolean;   // true if the user has ever registered any active quest
  totalActive: number;  // quests scheduled for *today* specifically (weekday-filtered)
  completedToday: number;
  maxStreak: number;
  fatigue: number;
  hour: number; // 0-23, local hour
}

const STREAK_PRAISE_THRESHOLD = 7;
const EVENING_HOUR = 20;
const LOW_FATIGUE_THRESHOLD = 40;

/**
 * Picks a single PT-coach line for the dashboard speech bubble, rule-based (no AI/backend needed).
 * Priority: no routines yet > fully done today > nothing done yet > partially done.
 */
export function pickCoachMessage(ctx: CoachContext): string {
  if (!ctx.hasQuests) {
    return '아직 등록된 루틴이 없어요! 퀘스트 탭에서 첫 루틴을 만들어볼까요?';
  }

  if (ctx.totalActive === 0) {
    return '오늘은 예정된 루틴이 없어요! 푹 쉬는 날이에요 😊';
  }

  if (ctx.completedToday === ctx.totalActive) {
    return ctx.maxStreak >= STREAK_PRAISE_THRESHOLD
      ? '일주일 넘게 개근 중이에요! 완전 물올랐어요 🔥'
      : '오늘 할 일 다 끝냈어요! 최고예요 💪';
  }

  if (ctx.completedToday === 0) {
    if (ctx.hour >= EVENING_HOUR) {
      return '오늘 아직 하나도 못 했어요! 지금이라도 가볍게 하나만 해볼까요?';
    }
    if (ctx.fatigue < LOW_FATIGUE_THRESHOLD) {
      return '요즘 좀 쉬었죠? 무리하지 말고 딱 하나만 가볍게 해봐요';
    }
    return '오늘 할 일이 기다리고 있어요, 하나부터 시작해볼까요?';
  }

  const remaining = ctx.totalActive - ctx.completedToday;
  return `좋아요! 남은 ${remaining}개도 마저 끝내볼까요?`;
}
