const ENEMY_COLORS = ['#94a3b8', '#f97316', '#ef4444', '#a855f7', '#0ea5e9', '#f59e0b'];

interface EnemySpriteProps {
  tierIndex: number;
  size?: number;
  className?: string;
}

/** A simple procedural monster whose size and color intensify with `tierIndex` (roster order = difficulty order). */
export function EnemySprite({ tierIndex, size = 72, className = '' }: EnemySpriteProps) {
  const color = ENEMY_COLORS[Math.min(tierIndex, ENEMY_COLORS.length - 1)];
  const scale = 0.7 + tierIndex * 0.08;

  return (
    <svg width={size} height={size} viewBox="0 0 100 100" className={className}>
      <g transform={`translate(50 55) scale(${scale}) translate(-50 -55)`} className="sprite-bob">
        <ellipse cx="50" cy="60" rx="26" ry="20" fill={color} />
        <circle cx="38" cy="46" r="6" fill="#fff" />
        <circle cx="62" cy="46" r="6" fill="#fff" />
        <circle cx="38" cy="46" r="2.5" fill="#111" />
        <circle cx="62" cy="46" r="2.5" fill="#111" />
        <polygon points="30,36 36,44 24,44" fill={color} />
        <polygon points="70,36 76,44 64,44" fill={color} />
      </g>
    </svg>
  );
}
