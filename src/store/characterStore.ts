import { create } from 'zustand';
import { characterRepository } from '../data/repositories/characterRepository';
import type { Character } from '../domain/types';

interface CharacterState {
  character: Character | null;
  load: () => Promise<Character>;
  persist: (character: Character) => Promise<void>;
}

export const useCharacterStore = create<CharacterState>((set) => ({
  character: null,

  load: async () => {
    const character = await characterRepository.getOrCreate();
    set({ character });
    return character;
  },

  persist: async (character) => {
    await characterRepository.save(character);
    set({ character });
  },
}));
