import type { Domain } from '../../domain/types';
import { DOMAIN_COLOR, levelToTier } from './theme';

interface BuildingSpriteProps {
  domain: Domain;
  level: number;
  size?: number;
}

/** A small badge icon identifying the facility type (gym/kitchen/study/library/office), drawn at a fixed spot on the building face across all tiers. */
function DomainIcon({ domain, color }: { domain: Domain; color: string }) {
  return (
    <g>
      <circle cx="38" cy="74" r="8" fill="#f8fafc" />
      {domain === 'EXERCISE' && (
        <g stroke={color} strokeWidth="2" strokeLinecap="round">
          <circle cx="33" cy="74" r="2" fill={color} stroke="none" />
          <circle cx="43" cy="74" r="2" fill={color} stroke="none" />
          <line x1="35" y1="74" x2="41" y2="74" />
        </g>
      )}
      {domain === 'DIET' && (
        <g fill={color}>
          <circle cx="38" cy="76" r="4.5" />
          <rect x="37.2" y="68.5" width="1.6" height="3" />
          <ellipse cx="40.5" cy="70" rx="2" ry="1" transform="rotate(30 40.5 70)" />
        </g>
      )}
      {domain === 'STUDY' && (
        <g fill={color}>
          <polygon points="38,68.5 46,73 38,77.5 30,73" />
          <line x1="38" y1="77.5" x2="38" y2="81" stroke={color} strokeWidth="1.4" />
        </g>
      )}
      {domain === 'READING' && (
        <g fill={color}>
          <rect x="31" y="76.5" width="14" height="2.4" />
          <rect x="32" y="73.5" width="12" height="2.4" />
          <rect x="33" y="70.5" width="10" height="2.4" />
        </g>
      )}
      {domain === 'WORK' && (
        <g fill={color}>
          <rect x="32" y="72" width="12" height="8" rx="1" />
          <rect x="35.5" y="69.5" width="5" height="3" rx="1" fill="none" stroke={color} strokeWidth="1.4" />
        </g>
      )}
    </g>
  );
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
        <DomainIcon domain={domain} color={secondary} />
      </g>
    </svg>
  );
}
