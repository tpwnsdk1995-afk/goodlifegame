import { useEffect, useState } from 'react';
import { useCharacterStore } from '../../store/characterStore';
import { useQuestStore } from '../../store/questStore';
import { completeQuest, getAvailableHuntingAttempts } from '../../store/gameActions';
import { isScheduledOn, toDateKey } from '../../domain/streak';
import { DOMAINS, DOMAIN_LABEL } from '../../domain/types';
import { averageDomainLevel } from '../../domain/stats';
import { pickCoachMessage } from '../../domain/coach';
import { Card } from '../../components/Card';
import { Button } from '../../components/Button';
import { ProgressBar } from '../../components/ProgressBar';
import { CharacterSprite } from '../../components/sprites/CharacterSprite';

export function DashboardPage() {
  const character = useCharacterStore((s) => s.character);
  const quests = useQuestStore((s) => s.quests);
  const [attempts, setAttempts] = useState(0);
  const [celebration, setCelebration] = useState<{ id: number; text: string } | null>(null);
  const [dismissedReminderCounts, setDismissedReminderCounts] = useState<Record<string, number>>({});
  const today = new Date();
  const todayKey = toDateKey(today);

  const refreshAttempts = () => {
    getAvailableHuntingAttempts().then(setAttempts);
  };

  useEffect(() => {
    refreshAttempts();
  }, [quests]);

  const handleComplete = async (questId: string) => {
    const result = await completeQuest(questId);
    refreshAttempts();

    if (result?.statLeveledUp || result?.buildingLeveledUp) {
      const text =
        result.statLeveledUp && result.buildingLeveledUp
          ? '🎉 레벨업! 캐릭터와 세력이 함께 성장했어요!'
          : result.statLeveledUp
            ? '🎉 캐릭터 레벨업!'
            : '🎉 시설 레벨업!';
      setCelebration({ id: Date.now(), text });
    }
  };

  const activeQuests = quests.filter((q) => q.active);
  const todaysQuests = activeQuests.filter((q) => isScheduledOn(q.recurrence, today));

  const overdueReminders = todaysQuests.filter(
    (q) =>
      q.reminderDate === todayKey &&
      q.reminderCount > (dismissedReminderCounts[q.id] ?? 0) &&
      q.lastCompletedDate !== todayKey,
  );

  const dismissReminders = () => {
    setDismissedReminderCounts((prev) => {
      const next = { ...prev };
      for (const q of overdueReminders) next[q.id] = q.reminderCount;
      return next;
    });
  };

  const coachMessage = pickCoachMessage({
    hasQuests: activeQuests.length > 0,
    totalActive: todaysQuests.length,
    completedToday: todaysQuests.filter((q) => q.lastCompletedDate === todayKey).length,
    maxStreak: todaysQuests.reduce((max, q) => Math.max(max, q.streakCount), 0),
    fatigue: character?.fatigue ?? 100,
    hour: new Date().getHours(),
  });

  return (
    <div className="space-y-4 relative">
      {celebration && (
        <div
          key={celebration.id}
          onAnimationEnd={() => setCelebration(null)}
          className="level-up-toast pointer-events-none absolute left-1/2 top-2 z-10 -translate-x-1/2 rounded-full bg-amber-500 px-4 py-1.5 text-sm font-bold text-slate-900 shadow-lg"
        >
          {celebration.text}
        </div>
      )}

      {overdueReminders.length > 0 && (
        <Card className="border-amber-500/60 bg-amber-500/10">
          <div className="flex items-start justify-between gap-2">
            <div>
              <p className="text-sm font-semibold text-amber-300">⏰ 아직 안 하셨어요!</p>
              <ul className="mt-1 text-xs text-amber-200/90 space-y-0.5">
                {overdueReminders.map((q) => (
                  <li key={q.id}>{q.title}</li>
                ))}
              </ul>
            </div>
            <button
              onClick={dismissReminders}
              className="text-amber-300 text-xs px-2 py-1 rounded hover:bg-amber-500/20"
            >
              닫기
            </button>
          </div>
        </Card>
      )}

      <Card>
        <div className="rounded-2xl rounded-bl-sm bg-slate-700/80 px-3 py-2 text-xs text-slate-100 mb-3">
          {coachMessage}
        </div>
        <div className="flex items-center gap-3">
          <CharacterSprite averageLevel={character ? averageDomainLevel(character) : 1} size={56} />
          <div className="flex-1">
            <div className="flex justify-between items-center">
              <span className="text-sm text-slate-300">피로도</span>
              <span className="text-xs text-slate-400">{character?.fatigue ?? 0} / 100</span>
            </div>
            <ProgressBar value={character?.fatigue ?? 0} max={100} colorClass="bg-emerald-400" />
          </div>
        </div>
        <p className="mt-2 text-xs text-slate-500">
          오늘 사냥 가능 횟수: <span className="text-amber-400 font-semibold">{attempts}</span>
        </p>
      </Card>

      {activeQuests.length === 0 && (
        <Card>
          <p className="text-sm text-slate-400">
            아직 등록된 퀘스트가 없어요. 퀘스트 탭에서 나만의 루틴을 추가해보세요!
          </p>
        </Card>
      )}

      {DOMAINS.map((domain) => {
        const domainQuests = todaysQuests.filter((q) => q.domain === domain);
        if (domainQuests.length === 0) return null;

        return (
          <Card key={domain} title={DOMAIN_LABEL[domain]}>
            <ul className="space-y-2">
              {domainQuests.map((quest) => {
                const doneToday = quest.lastCompletedDate === todayKey;
                return (
                  <li key={quest.id} className="flex items-center justify-between gap-2">
                    <div>
                      <p className={`text-sm ${doneToday ? 'text-slate-500 line-through' : 'text-slate-100'}`}>
                        {quest.title}
                      </p>
                      <p className="text-xs text-slate-500">🔥 {quest.streakCount}일 연속</p>
                    </div>
                    <Button
                      variant={doneToday ? 'secondary' : 'primary'}
                      disabled={doneToday}
                      onClick={() => handleComplete(quest.id)}
                    >
                      {doneToday ? '완료됨' : '완료'}
                    </Button>
                  </li>
                );
              })}
            </ul>
          </Card>
        );
      })}
    </div>
  );
}
