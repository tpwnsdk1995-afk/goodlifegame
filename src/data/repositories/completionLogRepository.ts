import { db } from '../db';
import type { CompletionLog, Domain } from '../../domain/types';

export const completionLogRepository = {
  async hasCompletedOn(questId: string, date: string): Promise<boolean> {
    const match = await db.completionLogs.where({ questId, date }).first();
    return Boolean(match);
  },

  async create(questId: string, domain: Domain, date: string): Promise<CompletionLog> {
    const log: CompletionLog = {
      id: crypto.randomUUID(),
      questId,
      domain,
      date,
      completedAt: new Date().toISOString(),
    };
    await db.completionLogs.add(log);
    return log;
  },

  async countForDate(date: string): Promise<number> {
    return db.completionLogs.where('date').equals(date).count();
  },
};
