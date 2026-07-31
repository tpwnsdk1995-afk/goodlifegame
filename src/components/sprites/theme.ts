import type { Domain } from '../../domain/types';

export interface DomainPalette {
  primary: string;
  secondary: string;
  accent: string;
}

export const DOMAIN_COLOR: Record<Domain, DomainPalette> = {
  EXERCISE: { primary: '#f97316', secondary: '#7c2d12', accent: '#fed7aa' },
  DIET: { primary: '#22c55e', secondary: '#14532d', accent: '#bbf7d0' },
  STUDY: { primary: '#3b82f6', secondary: '#1e3a8a', accent: '#bfdbfe' },
  READING: { primary: '#a855f7', secondary: '#581c87', accent: '#e9d5ff' },
  WORK: { primary: '#eab308', secondary: '#713f12', accent: '#fef08a' },
};

/** Maps a level to a 0-4 visual tier. Growth slows as levels rise, so tiers space out accordingly. */
export function levelToTier(level: number): number {
  return Math.min(4, Math.floor((level - 1) / 4));
}
