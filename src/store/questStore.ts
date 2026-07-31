import { create } from 'zustand';
import { questRepository, type NewQuestInput } from '../data/repositories/questRepository';
import type { Quest } from '../domain/types';

interface QuestState {
  quests: Quest[];
  load: (characterId: string) => Promise<Quest[]>;
  addQuest: (input: NewQuestInput) => Promise<Quest>;
  setActive: (id: string, active: boolean) => Promise<void>;
  replaceQuest: (quest: Quest) => void;
}

export const useQuestStore = create<QuestState>((set, get) => ({
  quests: [],

  load: async (characterId) => {
    const quests = await questRepository.listByCharacter(characterId);
    set({ quests });
    return quests;
  },

  addQuest: async (input) => {
    const quest = await questRepository.create(input);
    set({ quests: [...get().quests, quest] });
    return quest;
  },

  setActive: async (id, active) => {
    await questRepository.setActive(id, active);
    set({ quests: get().quests.map((q) => (q.id === id ? { ...q, active } : q)) });
  },

  replaceQuest: (quest) => {
    set({ quests: get().quests.map((q) => (q.id === quest.id ? quest : q)) });
  },
}));
