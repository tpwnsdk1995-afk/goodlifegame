import { create } from 'zustand';
import { questRepository, type NewQuestInput } from '../data/repositories/questRepository';
import type { Quest } from '../domain/types';

interface QuestState {
  quests: Quest[];
  load: (characterId: string) => Promise<Quest[]>;
  addQuest: (input: NewQuestInput) => Promise<Quest>;
  updateQuest: (quest: Quest) => Promise<void>;
  removeQuest: (id: string) => Promise<void>;
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

  updateQuest: async (quest) => {
    await questRepository.save(quest);
    set({ quests: get().quests.map((q) => (q.id === quest.id ? quest : q)) });
  },

  removeQuest: async (id) => {
    await questRepository.remove(id);
    set({ quests: get().quests.filter((q) => q.id !== id) });
  },

  setActive: async (id, active) => {
    await questRepository.setActive(id, active);
    set({ quests: get().quests.map((q) => (q.id === id ? { ...q, active } : q)) });
  },

  replaceQuest: (quest) => {
    set({ quests: get().quests.map((q) => (q.id === quest.id ? quest : q)) });
  },
}));
