import { useQuestStore } from './questStore';
import { questRepository } from '../data/repositories/questRepository';
import { isReminderDue, MAX_REMINDERS_PER_DAY, recordReminderShown } from '../domain/reminder';
import { toDateKey } from '../domain/streak';
import type { Quest } from '../domain/types';

export function requestNotificationPermission(): void {
  if (typeof window === 'undefined' || !('Notification' in window)) return;
  if (Notification.permission === 'default') {
    void Notification.requestPermission();
  }
}

/**
 * Checks all active quests for due reminders. Fires a browser Notification when permission
 * allows it, and always returns the reminded quests so the UI can show an in-app banner too —
 * that fallback must work even when notifications are denied or unsupported.
 */
export async function checkReminders(): Promise<Quest[]> {
  const now = new Date();
  const todayKey = toDateKey(now);
  const quests = useQuestStore.getState().quests;
  const reminded: Quest[] = [];

  for (const quest of quests) {
    if (!isReminderDue(quest, now, todayKey)) continue;

    const counters = recordReminderShown(quest, now, todayKey);
    const updatedQuest: Quest = { ...quest, ...counters };

    if (typeof window !== 'undefined' && 'Notification' in window && Notification.permission === 'granted') {
      new Notification('굿라이프게임', {
        body: `${quest.title} 아직 안 하셨어요! (${counters.reminderCount}/${MAX_REMINDERS_PER_DAY})`,
      });
    }

    useQuestStore.getState().replaceQuest(updatedQuest);
    await questRepository.save(updatedQuest);
    reminded.push(updatedQuest);
  }

  return reminded;
}
