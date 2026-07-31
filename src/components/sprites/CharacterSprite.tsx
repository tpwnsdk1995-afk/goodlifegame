import { levelToTier } from './theme';

interface CharacterSpriteProps {
  averageLevel: number;
  size?: number;
  className?: string;
}

const HAIR_COLOR = '#5b3a29';
const HAIR_HIGHLIGHT = '#7a4f38';
const SKIN = '#ffe0c2';
const EYE = '#3b2a4a';
const SNEAKER = '#f8fafc';

/**
 * A chibi gym-goer avatar (twintails, sportswear, sneakers) that gains a sweatband + dumbbell,
 * then a hoodie tied at the waist, then an energy aura, then a gold medal as average level rises.
 */
export function CharacterSprite({ averageLevel, size = 96, className = '' }: CharacterSpriteProps) {
  const tier = levelToTier(Math.max(1, Math.round(averageLevel)));
  const topColor = tier >= 3 ? '#facc15' : '#f472b6';
  const bottomColor = tier >= 3 ? '#4b5563' : '#334155';
  const auraColor = tier >= 3 ? '#fbbf24' : '#38bdf8';

  return (
    <svg width={size} height={size} viewBox="0 0 100 100" className={className}>
      {tier >= 2 && <circle cx="50" cy="56" r="36" fill={auraColor} opacity="0.18" className="sprite-glow" />}
      <g className="sprite-bob">
        {/* hoodie tied at the waist, behind everything */}
        {tier >= 2 && <polygon points="36,60 24,88 50,80" fill="#475569" opacity="0.95" />}

        {/* twintail hair (behind head, hangs beside body) */}
        <ellipse cx="27" cy="46" rx="8" ry="16" fill={HAIR_COLOR} />
        <ellipse cx="73" cy="46" rx="8" ry="16" fill={HAIR_COLOR} />

        {/* sneakers */}
        <ellipse cx="42" cy="89" rx="6" ry="3" fill={SNEAKER} />
        <ellipse cx="58" cy="89" rx="6" ry="3" fill={SNEAKER} />

        {/* leggings/shorts */}
        <rect x="38" y="70" width="24" height="20" rx="4" fill={bottomColor} />

        {/* crop top */}
        <rect x="38" y="58" width="24" height="14" rx="4" fill={topColor} />

        {/* neck */}
        <rect x="46" y="52" width="8" height="8" fill={SKIN} />

        {/* head */}
        <circle cx="50" cy="38" r="18" fill={SKIN} />

        {/* hair fringe on top of head */}
        <path d="M 32 34 Q 34 14 50 14 Q 66 14 68 34 Q 60 24 50 26 Q 40 24 32 34 Z" fill={HAIR_COLOR} />
        <path d="M 38 20 Q 44 28 50 20" fill="none" stroke={HAIR_HIGHLIGHT} strokeWidth="2" strokeLinecap="round" />

        {/* eyes */}
        <ellipse cx="42" cy="40" rx="4" ry="5.5" fill={EYE} />
        <ellipse cx="58" cy="40" rx="4" ry="5.5" fill={EYE} />
        <circle cx="43.2" cy="37.5" r="1.3" fill="#fff" />
        <circle cx="59.2" cy="37.5" r="1.3" fill="#fff" />

        {/* blush */}
        <circle cx="37" cy="46" r="3" fill="#fda4af" opacity="0.7" />
        <circle cx="63" cy="46" r="3" fill="#fda4af" opacity="0.7" />

        {/* mouth */}
        <path d="M 47 47 Q 50 49 53 47" fill="none" stroke="#b45372" strokeWidth="1.3" strokeLinecap="round" />

        {/* sweatband (tier 1+) */}
        {tier >= 1 && (
          <>
            <rect x="31" y="27" width="38" height="6" rx="3" fill={topColor} />
            <circle cx="50" cy="30" r="1.6" fill="#fff" />
          </>
        )}

        {/* dumbbell (tier 1+) */}
        {tier >= 1 && (
          <g transform="rotate(18 65 60)">
            <rect x="60" y="58" width="14" height="4" fill="#94a3b8" />
            <circle cx="60" cy="60" r="4" fill="#475569" />
            <circle cx="74" cy="60" r="4" fill="#475569" />
          </g>
        )}

        {/* gold medal (tier 4) */}
        {tier >= 4 && (
          <>
            <path d="M 44 52 L 50 66 L 56 52" fill="none" stroke="#ef4444" strokeWidth="3" />
            <circle cx="50" cy="70" r="7" fill="#facc15" stroke="#eab308" strokeWidth="1.5" />
            <path d="M 50 66 L 51.8 69.4 L 55.5 69.9 L 52.8 72.4 L 53.5 76 L 50 74.2 L 46.5 76 L 47.2 72.4 L 44.5 69.9 L 48.2 69.4 Z" fill="#fde68a" />
          </>
        )}
      </g>

      {/* sparkles for the highest tier */}
      {tier >= 3 && (
        <g className="sprite-glow">
          <circle cx="18" cy="60" r="1.6" fill="#fef9c3" />
          <circle cx="84" cy="30" r="1.6" fill="#fef9c3" />
          <circle cx="80" cy="70" r="1.3" fill="#fef9c3" />
        </g>
      )}
    </svg>
  );
}
