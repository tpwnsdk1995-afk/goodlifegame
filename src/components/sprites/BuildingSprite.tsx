import type { Domain } from '../../domain/types';
import { DOMAIN_COLOR, levelToTier } from './theme';

interface BuildingSpriteProps {
  domain: Domain;
  level: number;
  size?: number;
}

/** A small procedural building that visibly grows grander through 5 tiers as `level` rises. */
export function BuildingSprite({ domain, level, size = 72 }: BuildingSpriteProps) {
  const tier = levelToTier(level);
  const { primary, secondary, accent } = DOMAIN_COLOR[domain];

  return (
    <svg width={size} height={size} viewBox="0 0 100 100" style={{ overflow: 'visible' }}>
      <ellipse cx="50" cy="92" rx="34" ry="6" fill="#00000055" />
      <g className="sprite-bob">
        {tier === 0 && (
          <>
            <polygon points="50,40 25,62 75,62" fill={secondary} />
            <rect x="32" y="62" width="36" height="26" fill={primary} />
            <rect x="45" y="72" width="10" height="16" fill={accent} />
          </>
        )}
        {tier === 1 && (
          <>
            <polygon points="50,30 20,58 80,58" fill={secondary} />
            <rect x="26" y="58" width="48" height="32" fill={primary} />
            <rect x="33" y="66" width="10" height="10" fill={accent} />
            <rect x="57" y="66" width="10" height="10" fill={accent} />
            <rect x="45" y="78" width="10" height="12" fill={accent} />
          </>
        )}
        {tier === 2 && (
          <>
            <rect x="60" y="18" width="14" height="28" fill={secondary} />
            <polygon points="67,10 60,18 74,18" fill={primary} />
            <polygon points="50,26 18,56 82,56" fill={secondary} />
            <rect x="22" y="56" width="56" height="34" fill={primary} />
            <rect x="30" y="64" width="10" height="10" fill={accent} />
            <rect x="60" y="64" width="10" height="10" fill={accent} />
            <rect x="44" y="78" width="12" height="12" fill={accent} />
          </>
        )}
        {tier === 3 && (
          <>
            <rect x="58" y="10" width="14" height="36" fill={secondary} />
            <polygon points="65,2 58,10 72,10" fill={primary} />
            <polygon points="50,22 14,54 86,54" fill={secondary} />
            <rect x="18" y="54" width="64" height="36" fill={primary} />
            <rect x="26" y="62" width="10" height="10" fill={accent} />
            <rect x="45" y="62" width="10" height="10" fill={accent} />
            <rect x="64" y="62" width="10" height="10" fill={accent} />
            <rect x="42" y="78" width="16" height="12" fill={accent} />
          </>
        )}
        {tier === 4 && (
          <>
            <circle cx="50" cy="30" r="26" fill={primary} opacity="0.18" className="sprite-glow" />
            <rect x="56" y="4" width="14" height="42" fill={secondary} />
            <polygon points="63,-4 56,4 70,4" fill={primary} />
            <polygon points="50,18 10,52 90,52" fill={secondary} />
            <rect x="14" y="52" width="72" height="38" fill={primary} />
            <rect x="22" y="60" width="10" height="10" fill={accent} />
            <rect x="45" y="60" width="10" height="10" fill={accent} />
            <rect x="68" y="60" width="10" height="10" fill={accent} />
            <rect x="42" y="76" width="16" height="14" fill={accent} />
          </>
        )}
      </g>
    </svg>
  );
}
