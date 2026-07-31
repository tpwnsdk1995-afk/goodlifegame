import { useState } from 'react';
import { useCharacterStore } from '../../store/characterStore';
import { useQuestStore } from '../../store/questStore';
import { requestNotificationPermission } from '../../store/reminderActions';
import { DOMAINS, DOMAIN_LABEL, type Domain, type Quest, type Recurrence } from '../../domain/types';
import { Card } from '../../components/Card';
import { Button } from '../../components/Button';

const WEEKDAY_LABELS = ['일', '월', '화', '수', '목', '금', '토'];

function recurrenceLabel(recurrence: Recurrence): string {
  if (recurrence === 'DAILY') return '매일';
  return recurrence.days
    .slice()
    .sort((a, b) => a - b)
    .map((d) => WEEKDAY_LABELS[d])
    .join('·');
}

export function QuestManagerPage() {
  const character = useCharacterStore((s) => s.character);
  const quests = useQuestStore((s) => s.quests);
  const addQuest = useQuestStore((s) => s.addQuest);
  const updateQuest = useQuestStore((s) => s.updateQuest);
  const removeQuest = useQuestStore((s) => s.removeQuest);
  const setActive = useQuestStore((s) => s.setActive);

  const [editingQuestId, setEditingQuestId] = useState<string | null>(null);
  const [title, setTitle] = useState('');
  const [domain, setDomain] = useState<Domain>('EXERCISE');
  const [reminderTime, setReminderTime] = useState('');
  const [recurrenceType, setRecurrenceType] = useState<'DAILY' | 'WEEKDAYS'>('DAILY');
  const [selectedDays, setSelectedDays] = useState<number[]>([]);

  const resetForm = () => {
    setEditingQuestId(null);
    setTitle('');
    setDomain('EXERCISE');
    setReminderTime('');
    setRecurrenceType('DAILY');
    setSelectedDays([]);
  };

  const startEditing = (quest: Quest) => {
    setEditingQuestId(quest.id);
    setTitle(quest.title);
    setDomain(quest.domain);
    setReminderTime(quest.reminderTime ?? '');
    if (quest.recurrence === 'DAILY') {
      setRecurrenceType('DAILY');
      setSelectedDays([]);
    } else {
      setRecurrenceType('WEEKDAYS');
      setSelectedDays(quest.recurrence.days);
    }
  };

  const toggleDay = (day: number) => {
    setSelectedDays((prev) => (prev.includes(day) ? prev.filter((d) => d !== day) : [...prev, day].sort((a, b) => a - b)));
  };

  const handleDelete = async (quest: Quest) => {
    if (!window.confirm(`"${quest.title}" 퀘스트를 삭제할까요? 되돌릴 수 없어요.`)) return;
    await removeQuest(quest.id);
    if (editingQuestId === quest.id) resetForm();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !character) return;
    if (recurrenceType === 'WEEKDAYS' && selectedDays.length === 0) return;

    const recurrence: Recurrence = recurrenceType === 'DAILY' ? 'DAILY' : { type: 'WEEKDAYS', days: selectedDays };

    if (editingQuestId) {
      const existing = quests.find((q) => q.id === editingQuestId);
      if (existing) {
        await updateQuest({
          ...existing,
          title: title.trim(),
          domain,
          recurrence,
          reminderTime: reminderTime || null,
        });
      }
    } else {
      await addQuest({
        characterId: character.id,
        domain,
        title: title.trim(),
        recurrence,
        reminderTime: reminderTime || null,
      });
    }

    if (reminderTime) requestNotificationPermission();
    resetForm();
  };

  return (
    <div className="space-y-4">
      <Card title={editingQuestId ? '퀘스트 수정' : '새 퀘스트 등록'}>
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
            <label className="block text-xs text-slate-400 mb-1">반복 주기</label>
            <div className="flex gap-2 mb-2">
              <button
                type="button"
                onClick={() => setRecurrenceType('DAILY')}
                className={`flex-1 rounded-lg px-3 py-2 text-sm ${recurrenceType === 'DAILY' ? 'bg-amber-500 text-slate-900 font-semibold' : 'bg-slate-900 border border-slate-700 text-slate-300'}`}
              >
                매일
              </button>
              <button
                type="button"
                onClick={() => setRecurrenceType('WEEKDAYS')}
                className={`flex-1 rounded-lg px-3 py-2 text-sm ${recurrenceType === 'WEEKDAYS' ? 'bg-amber-500 text-slate-900 font-semibold' : 'bg-slate-900 border border-slate-700 text-slate-300'}`}
              >
                특정 요일
              </button>
            </div>
            {recurrenceType === 'WEEKDAYS' && (
              <div className="flex gap-1.5 flex-wrap">
                {WEEKDAY_LABELS.map((label, day) => (
                  <button
                    key={day}
                    type="button"
                    onClick={() => toggleDay(day)}
                    className={`w-9 h-9 rounded-full text-xs ${selectedDays.includes(day) ? 'bg-amber-500 text-slate-900 font-semibold' : 'bg-slate-900 border border-slate-700 text-slate-400'}`}
                  >
                    {label}
                  </button>
                ))}
              </div>
            )}
          </div>

          <div>
            <label className="block text-xs text-slate-400 mb-1">리마인드 시각 (선택)</label>
            <input
              type="time"
              value={reminderTime}
              onChange={(e) => setReminderTime(e.target.value)}
              className="w-full rounded-lg bg-slate-900 border border-slate-700 px-3 py-2 text-sm"
            />
          </div>

          <div className="flex gap-2">
            <Button
              type="submit"
              className="flex-1"
              disabled={recurrenceType === 'WEEKDAYS' && selectedDays.length === 0}
            >
              {editingQuestId ? '수정 완료' : '루틴으로 등록'}
            </Button>
            {editingQuestId && (
              <Button type="button" variant="secondary" onClick={resetForm}>
                수정 취소
              </Button>
            )}
          </div>
        </form>
      </Card>

      <Card title="내 퀘스트 목록">
        {quests.length === 0 && <p className="text-sm text-slate-400">등록된 퀘스트가 없어요.</p>}
        <ul className="space-y-2">
          {quests.map((quest) => (
            <li key={quest.id} className="flex flex-col gap-2 border-b border-slate-800 pb-2 last:border-0 last:pb-0">
              <div className="min-w-0">
                <p className="text-sm text-slate-100 break-words">{quest.title}</p>
                <p className="text-xs text-slate-500">
                  {DOMAIN_LABEL[quest.domain]} · {recurrenceLabel(quest.recurrence)} · 최고 연속 {quest.longestStreak}일
                  {quest.reminderTime && <> · ⏰ {quest.reminderTime}</>}
                </p>
              </div>
              <div className="flex gap-1.5 flex-wrap">
                <Button variant="secondary" onClick={() => startEditing(quest)}>
                  수정
                </Button>
                <Button variant="secondary" onClick={() => setActive(quest.id, !quest.active)}>
                  {quest.active ? '비활성화' : '활성화'}
                </Button>
                <Button variant="danger" onClick={() => handleDelete(quest)}>
                  삭제
                </Button>
              </div>
            </li>
          ))}
        </ul>
      </Card>
    </div>
  );
}
