import { create } from 'zustand';
import { combatRepository } from '../data/repositories/combatRepository';
import type { Encounter } from '../domain/types';

interface CombatState {
  encounters: Encounter[];
  loadRecent: (characterId: string) => Promise<void>;
  prepend: (encounter: Encounter) => void;
}

export const useCombatStore = create<CombatState>((set) => ({
  encounters: [],

  loadRecent: async (characterId) => {
    const encounters = await combatRepository.listRecent(characterId);
    set({ encounters });
  },

  prepend: (encounter) => {
    set((state) => ({ encounters: [encounter, ...state.encounters] }));
  },
}));
