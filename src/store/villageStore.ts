import { create } from 'zustand';
import { villageRepository } from '../data/repositories/villageRepository';
import type { Village } from '../domain/types';

interface VillageState {
  village: Village | null;
  load: (characterId: string) => Promise<Village>;
  persist: (village: Village) => Promise<void>;
}

export const useVillageStore = create<VillageState>((set) => ({
  village: null,

  load: async (characterId) => {
    const village = await villageRepository.getOrCreate(characterId);
    set({ village });
    return village;
  },

  persist: async (village) => {
    await villageRepository.save(village);
    set({ village });
  },
}));
