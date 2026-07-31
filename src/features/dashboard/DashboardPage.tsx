import { useEffect, useState } from 'react';
import { useCharacterStore } from '../../store/characterStore';
import { useQuestStore } from '../../store/questStore';
import { completeQuest, getAvailableHuntingAttempts } from '../../store/gameActions';
import { toDateKey } from '../../domain/streak';
import { DOMAINS, DOMAIN_LABEL } from '../../domain/types';
import { Card } from '../../components/Card';
import { Button } from '../../components/Button';
import { ProgressBar } from '../../components/ProgressBar';

export function DashboardPage() {
  const character = useCharacterStore((s) => s.character);
  const quests = useQuestStore((s) => s.quests);
  const [attempts, setAttempts] = useState(0);
  const todayKey = toDateKey(new Date());

  const refreshAttempts = () => {
    getAvailableHuntingAttempts().then(setAttempts);
  };

  useEffect(() => {
    refreshAttempts();
  }, [quests]);

  const handleComplete = async (questId: string) => {
    await completeQuest(questId);
    refreshAttempts();
  };

  const activeQuests = quests.filter((q) => q.active);

  return (
    <div className="space-y-4">
      <Card>
        <div className="flex justify-between items-center">
          <span className="text-sm text-slate-300">피로도</span>
          <span className="text-xs text-slate-400">{character?.fatigue ?? 0} / 100</span>
        </div>
        <ProgressBar value={character?.fatigue ?? 0} max={100} colorClass="bg-emerald-400" />
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
        const domainQuests = activeQuests.filter((q) => q.domain === domain);
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
