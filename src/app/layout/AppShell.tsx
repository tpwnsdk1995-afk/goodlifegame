import type { PropsWithChildren } from 'react';

export type TabKey = 'dashboard' | 'quests' | 'character' | 'village' | 'hunting';

const TABS: { key: TabKey; label: string; icon: string }[] = [
  { key: 'dashboard', label: '홈', icon: '🏠' },
  { key: 'quests', label: '퀘스트', icon: '📋' },
  { key: 'character', label: '캐릭터', icon: '🧙' },
  { key: 'village', label: '세력', icon: '🏰' },
  { key: 'hunting', label: '사냥', icon: '⚔️' },
];

interface AppShellProps {
  activeTab: TabKey;
  onTabChange: (tab: TabKey) => void;
}

export function AppShell({ activeTab, onTabChange, children }: PropsWithChildren<AppShellProps>) {
  return (
    <div className="min-h-screen flex flex-col max-w-md mx-auto">
      <header className="px-4 py-3 border-b border-slate-800">
        <h1 className="text-lg font-bold text-amber-400">굿라이프게임</h1>
      </header>

      <main className="flex-1 overflow-y-auto px-4 py-4 pb-24">{children}</main>

      <nav className="fixed bottom-0 left-0 right-0 max-w-md mx-auto bg-slate-800 border-t border-slate-700 flex">
        {TABS.map((tab) => (
          <button
            key={tab.key}
            onClick={() => onTabChange(tab.key)}
            className={`flex-1 py-3 flex flex-col items-center gap-0.5 text-xs ${
              activeTab === tab.key ? 'text-amber-400' : 'text-slate-400'
            }`}
          >
            <span className="text-lg leading-none">{tab.icon}</span>
            {tab.label}
          </button>
        ))}
      </nav>
    </div>
  );
}
