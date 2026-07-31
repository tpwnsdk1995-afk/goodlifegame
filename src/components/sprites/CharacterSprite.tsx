import { levelToTier } from './theme';

interface CharacterSpriteProps {
  averageLevel: number;
  size?: number;
  className?: string;
}

/** A procedural avatar that gains a weapon, cape, aura, and crown as the character's average level rises. */
export function CharacterSprite({ averageLevel, size = 96, className = '' }: CharacterSpriteProps) {
  const tier = levelToTier(Math.max(1, Math.round(averageLevel)));
  const bodyColor = tier >= 3 ? '#facc15' : '#64748b';
  const auraColor = tier >= 3 ? '#fbbf24' : '#38bdf8';

  return (
    <svg width={size} height={size} viewBox="0 0 100 100" className={className}>
      {tier >= 2 && <circle cx="50" cy="55" r="34" fill={auraColor} opacity="0.18" className="sprite-glow" />}
      <g className="sprite-bob">
        {tier >= 2 && <polygon points="38,42 28,82 50,72" fill="#1e293b" />}
        <circle cx="50" cy="34" r="14" fill="#fcd9b8" />
        <rect x="38" y="46" width="24" height="30" rx="6" fill={bodyColor} />
        {tier >= 4 && <polygon points="42,20 50,9 58,20" fill="#fbbf24" />}
        {tier >= 1 && <rect x="64" y="48" width="4" height="26" fill="#a3a3a3" />}
        {tier >= 2 && <polygon points="60,44 69,44 64,33" fill="#e2e8f0" />}
      </g>
    </svg>
  );
}
