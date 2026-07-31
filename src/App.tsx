import { useEffect, useState } from 'react';
import { AppShell, type TabKey } from './app/layout/AppShell';
import { initializeGame } from './store/gameActions';
import { checkReminders } from './store/reminderActions';
import { DashboardPage } from './features/dashboard/DashboardPage';
import { QuestManagerPage } from './features/quests/QuestManagerPage';
import { CharacterSheetPage } from './features/character/CharacterSheetPage';
import { VillagePage } from './features/village/VillagePage';
import { HuntingPage } from './features/hunting/HuntingPage';

const PAGES: Record<TabKey, () => JSX.Element | null> = {
  dashboard: DashboardPage,
  quests: QuestManagerPage,
  character: CharacterSheetPage,
  village: VillagePage,
  hunting: HuntingPage,
};

export default function App() {
  const [ready, setReady] = useState(false);
  const [activeTab, setActiveTab] = useState<TabKey>('dashboard');

  useEffect(() => {
    initializeGame().then(() => {
      setReady(true);
      checkReminders();
    });

    const interval = setInterval(checkReminders, 60_000);
    return () => clearInterval(interval);
  }, []);

  if (!ready) {
    return (
      <div className="min-h-screen flex items-center justify-center text-slate-400">
        불러오는 중...
      </div>
    );
  }

  const ActivePage = PAGES[activeTab];

  return (
    <AppShell activeTab={activeTab} onTabChange={setActiveTab}>
      <ActivePage />
    </AppShell>
  );
}
