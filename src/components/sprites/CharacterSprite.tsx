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

/**
 * A cute chibi-style avatar (twintails, big eyes, blush) that gains a hair ribbon + wand,
 * then a cape, then a sparkling aura, then a tiara as the character's average level rises.
 */
export function CharacterSprite({ averageLevel, size = 96, className = '' }: CharacterSpriteProps) {
  const tier = levelToTier(Math.max(1, Math.round(averageLevel)));
  const dressColor = tier >= 3 ? '#facc15' : tier >= 1 ? '#f472b6' : '#fb7185';
  const dressTrim = tier >= 3 ? '#fde68a' : '#fecdd3';
  const auraColor = tier >= 3 ? '#fbbf24' : '#f9a8d4';

  return (
    <svg width={size} height={size} viewBox="0 0 100 100" className={className}>
      {tier >= 2 && <circle cx="50" cy="56" r="36" fill={auraColor} opacity="0.18" className="sprite-glow" />}
      <g className="sprite-bob">
        {/* cape, behind everything */}
        {tier >= 2 && <polygon points="36,44 24,86 50,76" fill="#334155" opacity="0.9" />}

        {/* twintail hair (behind head, hangs beside body) */}
        <ellipse cx="27" cy="46" rx="8" ry="16" fill={HAIR_COLOR} />
        <ellipse cx="73" cy="46" rx="8" ry="16" fill={HAIR_COLOR} />

        {/* dress */}
        <polygon points="40,58 60,58 70,88 30,88" fill={dressColor} />
        <polygon points="40,58 60,58 64,66 36,66" fill={dressTrim} />

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

        {/* hair ribbon (tier 1+) */}
        {tier >= 1 && (
          <>
            <polygon points="20,36 27,40 20,44" fill={dressColor} />
            <polygon points="34,36 27,40 34,44" fill={dressColor} />
            <circle cx="27" cy="40" r="2.4" fill={dressTrim} />
          </>
        )}

        {/* wand (tier 1+) */}
        {tier >= 1 && (
          <>
            <rect x="70" y="58" width="3" height="24" fill="#e2e8f0" transform="rotate(18 70 58)" />
            <polygon
              points="68,52 71,58 74,52 71,46"
              fill={tier >= 3 ? '#fde047' : '#93c5fd'}
              transform="rotate(18 71 58)"
            />
          </>
        )}

        {/* tiara (tier 4) */}
        {tier >= 4 && (
          <>
            <polygon points="40,20 50,10 60,20" fill="#fde047" />
            <circle cx="50" cy="13" r="2.4" fill="#f43f5e" />
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
