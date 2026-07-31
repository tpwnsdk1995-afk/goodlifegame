import type { Encounter } from '../../domain/types';
import { combatRepository } from '../../data/repositories/combatRepository';
import { Card } from '../../components/Card';

const OUTCOME_LABEL: Record<Encounter['outcome'], string> = {
  WIN: '🏆 승리',
  PARTIAL: '⚔️ 아쉬운 접전',
  LOSE: '💀 패배',
};

export function BattleLog({ encounters }: { encounters: Encounter[] }) {
  if (encounters.length === 0) return null;
  const enemies = combatRepository.listEnemies();

  return (
    <Card title="최근 전투 기록">
      <ul className="space-y-2">
        {encounters.slice(0, 5).map((encounter) => {
          const enemy = enemies.find((e) => e.id === encounter.enemyId);
          return (
            <li key={encounter.id} className="text-xs text-slate-400 flex justify-between">
              <span>{enemy?.name ?? encounter.enemyId}</span>
              <span>{OUTCOME_LABEL[encounter.outcome]}</span>
              <span>+{encounter.rewardsGranted.gold}G</span>
            </li>
          );
        })}
      </ul>
    </Card>
  );
}
