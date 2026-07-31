import { useState } from 'react';
import { useCharacterStore } from '../../store/characterStore';
import { useQuestStore } from '../../store/questStore';
import { requestNotificationPermission } from '../../store/reminderActions';
import { DOMAINS, DOMAIN_LABEL, type Domain } from '../../domain/types';
import { Card } from '../../components/Card';
import { Button } from '../../components/Button';

export function QuestManagerPage() {
  const character = useCharacterStore((s) => s.character);
  const quests = useQuestStore((s) => s.quests);
  const addQuest = useQuestStore((s) => s.addQuest);
  const setActive = useQuestStore((s) => s.setActive);

  const [title, setTitle] = useState('');
  const [domain, setDomain] = useState<Domain>('EXERCISE');
  const [reminderTime, setReminderTime] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !character) return;
    await addQuest({
      characterId: character.id,
      domain,
      title: title.trim(),
      recurrence: 'DAILY',
      reminderTime: reminderTime || null,
    });
    if (reminderTime) requestNotificationPermission();
    setTitle('');
    setReminderTime('');
  };

  return (
    <div className="space-y-4">
      <Card title="새 퀘스트 등록">
        <form onSubmit={handleSubmit} className="space-y-3">
          <select
            value={domain}
            onChange={(e) => setDomain(e.target.value as Domain)}
            className="w-full rounded-lg bg-slate-900 border border-slate-700 px-3 py-2 text-sm"
          >
            {DOMAINS.map((d) => (
              <option key={d} value={d}>
                {DOMAIN_LABEL[d]}
              </option>
            ))}
          </select>
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="예: 스쿼트 30개, 30분 독서"
            className="w-full rounded-lg bg-slate-900 border border-slate-700 px-3 py-2 text-sm placeholder:text-slate-500"
          />
          <div>
            <label className="block text-xs text-slate-400 mb-1">리마인드 시각 (선택)</label>
            <input
              type="time"
              value={reminderTime}
              onChange={(e) => setReminderTime(e.target.value)}
              className="w-full rounded-lg bg-slate-900 border border-slate-700 px-3 py-2 text-sm"
            />
          </div>
          <Button type="submit" className="w-full">
            매일 루틴으로 등록
          </Button>
        </form>
      </Card>

      <Card title="내 퀘스트 목록">
        {quests.length === 0 && <p className="text-sm text-slate-400">등록된 퀘스트가 없어요.</p>}
        <ul className="space-y-2">
          {quests.map((quest) => (
            <li key={quest.id} className="flex items-center justify-between gap-2">
              <div>
                <p className="text-sm text-slate-100">{quest.title}</p>
                <p className="text-xs text-slate-500">
                  {DOMAIN_LABEL[quest.domain]} · 최고 연속 {quest.longestStreak}일
                  {quest.reminderTime && <> · ⏰ {quest.reminderTime}</>}
                </p>
              </div>
              <Button
                variant="secondary"
                onClick={() => setActive(quest.id, !quest.active)}
              >
                {quest.active ? '비활성화' : '활성화'}
              </Button>
            </li>
          ))}
        </ul>
      </Card>
    </div>
  );
}
