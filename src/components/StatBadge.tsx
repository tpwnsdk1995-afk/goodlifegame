import { xpToNextLevel } from '../domain/stats';
import { ProgressBar } from './ProgressBar';

interface StatBadgeProps {
  label: string;
  level: number;
  xp: number;
  colorClass?: string;
}

export function StatBadge({ label, level, xp, colorClass }: StatBadgeProps) {
  return (
    <div className="space-y-1">
      <div className="flex items-baseline justify-between">
        <span className="text-sm font-medium text-slate-200">{label}</span>
        <span className="text-xs text-slate-400">Lv.{level}</span>
      </div>
      <ProgressBar value={xp} max={xpToNextLevel(level)} colorClass={colorClass} />
    </div>
  );
}
