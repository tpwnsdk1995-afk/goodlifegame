const ENEMY_COLORS = ['#94a3b8', '#a78bfa', '#f59e0b', '#7c3aed', '#334155', '#dc2626'];
const ENEMY_KINDS = ['slime', 'ghost', 'blob', 'demon', 'shadow', 'dragon'] as const;
type EnemyKind = (typeof ENEMY_KINDS)[number];

interface EnemySpriteProps {
  tierIndex: number;
  size?: number;
  className?: string;
}

/**
 * A procedural "bad habit" monster — laziness slime, overtime ghost, cheat-day blob, nap demon,
 * burnout shadow, and finally the King of Procrastination — sized/colored by roster tier (difficulty order).
 */
export function EnemySprite({ tierIndex, size = 72, className = '' }: EnemySpriteProps) {
  const clampedIndex = Math.min(tierIndex, ENEMY_COLORS.length - 1);
  const color = ENEMY_COLORS[clampedIndex];
  const kind: EnemyKind = ENEMY_KINDS[clampedIndex] ?? 'slime';
  const scale = 0.75 + tierIndex * 0.09;

  return (
    <svg width={size} height={size} viewBox="0 0 100 100" className={className}>
      <g transform={`translate(50 55) scale(${scale}) translate(-50 -55)`} className="sprite-bob">
        {kind === 'slime' && (
          <>
            <path d="M 24 66 Q 20 38 50 38 Q 80 38 76 66 Q 76 76 50 76 Q 24 76 24 66 Z" fill={color} />
            <ellipse cx="40" cy="46" rx="4" ry="2" fill="#fff" opacity="0.5" />
            <path d="M 34 56 Q 38 60 42 56" stroke="#1e293b" strokeWidth="2" fill="none" strokeLinecap="round" />
            <path d="M 58 56 Q 62 60 66 56" stroke="#1e293b" strokeWidth="2" fill="none" strokeLinecap="round" />
          </>
        )}

        {kind === 'ghost' && (
          <>
            <path
              d="M 26 70 L 26 44 Q 26 20 50 20 Q 74 20 74 44 L 74 70 Q 68 62 62 70 Q 56 62 50 70 Q 44 62 38 70 Q 32 62 26 70 Z"
              fill={color}
              opacity="0.92"
            />
            <circle cx="40" cy="42" r="3.5" fill="#1e293b" />
            <circle cx="60" cy="42" r="3.5" fill="#1e293b" />
            <rect x="46" y="52" width="8" height="14" fill="#1e293b" opacity="0.6" />
          </>
        )}

        {kind === 'blob' && (
          <>
            <circle cx="50" cy="54" r="26" fill={color} />
            <path d="M 66 36 Q 76 40 72 50 Q 64 46 66 36 Z" fill="#1e293b" opacity="0.15" />
            <circle cx="38" cy="46" r="2.2" fill="#fef08a" />
            <circle cx="58" cy="50" r="2.2" fill="#fef08a" />
            <circle cx="46" cy="62" r="2.2" fill="#fef08a" />
            <circle cx="40" cy="50" r="3.5" fill="#fff" />
            <circle cx="60" cy="50" r="3.5" fill="#fff" />
            <circle cx="40" cy="50" r="1.6" fill="#1e293b" />
            <circle cx="60" cy="50" r="1.6" fill="#1e293b" />
          </>
        )}

        {kind === 'demon' && (
          <>
            <polygon points="34,32 40,44 30,42" fill={color} />
            <polygon points="66,32 60,44 70,42" fill={color} />
            <ellipse cx="50" cy="54" rx="24" ry="22" fill={color} />
            <path d="M 38 50 Q 42 46 46 50" stroke="#1e293b" strokeWidth="2" fill="none" strokeLinecap="round" />
            <path d="M 54 50 Q 58 46 62 50" stroke="#1e293b" strokeWidth="2" fill="none" strokeLinecap="round" />
            <text x="70" y="34" fontSize="12" fill="#1e293b" opacity="0.6">Z</text>
          </>
        )}

        {kind === 'shadow' && (
          <>
            <ellipse cx="50" cy="34" rx="3" ry="8" fill={color} opacity="0.4" />
            <path
              d="M 50 24 Q 70 30 68 56 Q 76 66 68 78 L 32 78 Q 24 66 32 56 Q 30 30 50 24 Z"
              fill={color}
            />
            <circle cx="41" cy="48" r="2.6" fill="#f87171" />
            <circle cx="59" cy="48" r="2.6" fill="#f87171" />
          </>
        )}

        {kind === 'dragon' && (
          <>
            <polygon points="16,50 34,42 34,60" fill={color} opacity="0.85" />
            <polygon points="84,50 66,42 66,60" fill={color} opacity="0.85" />
            <ellipse cx="50" cy="56" rx="28" ry="24" fill={color} />
            <polygon points="38,30 44,40 32,40" fill="#facc15" />
            <polygon points="50,26 56,38 44,38" fill="#facc15" />
            <polygon points="62,30 68,40 56,40" fill="#facc15" />
            <circle cx="40" cy="52" r="3.4" fill="#fde047" />
            <circle cx="60" cy="52" r="3.4" fill="#fde047" />
            <circle cx="40" cy="52" r="1.5" fill="#1e293b" />
            <circle cx="60" cy="52" r="1.5" fill="#1e293b" />
            <path d="M 40 66 Q 50 72 60 66" stroke="#1e293b" strokeWidth="2" fill="none" strokeLinecap="round" />
          </>
        )}
      </g>
    </svg>
  );
}
