interface ProgressBarProps {
  value: number;
  max: number;
  colorClass?: string;
  label?: string;
}

export function ProgressBar({ value, max, colorClass = 'bg-amber-400', label }: ProgressBarProps) {
  const pct = max > 0 ? Math.min(100, Math.max(0, (value / max) * 100)) : 0;
  return (
    <div>
      {label && (
        <div className="flex justify-between text-xs text-slate-400 mb-1">
          <span>{label}</span>
          <span>
            {value} / {max}
          </span>
        </div>
      )}
      <div className="h-2.5 w-full rounded-full bg-slate-700 overflow-hidden">
        <div className={`h-full rounded-full ${colorClass} transition-all`} style={{ width: `${pct}%` }} />
      </div>
    </div>
  );
}
