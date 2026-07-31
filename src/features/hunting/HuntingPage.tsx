import { useEffect, useState } from 'react';
import { useCharacterStore } from '../../store/characterStore';
import { useCombatStore } from '../../store/combatStore';
import { attemptHunt, getAvailableHuntingAttempts } from '../../store/gameActions';
import { computeTotalPower } from '../../domain/combat';
import { combatRepository } from '../../data/repositories/combatRepository';
import { Card } from '../../components/Card';
import { Button } from '../../components/Button';
import { BattleLog } from './BattleLog';

export function HuntingPage() {
  const character = useCharacterStore((s) => s.character);
  const encounters = useCombatStore((s) => s.encounters);
  const [attempts, setAttempts] = useState(0);
  const [message, setMessage] = useState<string | null>(null);

  const enemies = combatRepository.listEnemies();
  const power = character ? computeTotalPower(character) : 0;

  const refresh = () => getAvailableHuntingAttempts().then(setAttempts);

  useEffect(() => {
    refresh();
  }, []);

  const handleHunt = async (enemyId: string) => {
    try {
      const encounter = await attemptHunt(enemyId);
      setMessage(
        encounter.outcome === 'WIN'
          ? '승리했어요! 보상을 획득했습니다.'
          : encounter.outcome === 'PARTIAL'
            ? '아쉽게 접전이었어요. 절반의 보상을 얻었습니다.'
            : '패배했어요... 전투력을 더 키워보세요.',
      );
      await refresh();
    } catch (err) {
      setMessage(err instanceof Error ? err.message : '알 수 없는 오류가 발생했어요.');
    }
  };

  return (
    <div className="space-y-4">
      <Card>
        <div className="flex justify-between items-center">
          <span className="text-sm text-slate-300">내 전투력</span>
          <span className="text-lg font-bold text-amber-400">{power}</span>
        </div>
        <p className="mt-1 text-xs text-slate-500">
          오늘 사냥 가능 횟수: <span className="text-amber-400 font-semibold">{attempts}</span>
        </p>
      </Card>

      {message && (
        <Card className="border-amber-500/50">
          <p className="text-sm text-slate-200">{message}</p>
        </Card>
      )}

      <Card title="사냥터">
        <ul className="space-y-2">
          {enemies.map((enemy) => (
            <li key={enemy.id} className="flex items-center justify-between gap-2">
              <div>
                <p className="text-sm text-slate-100">{enemy.name}</p>
                <p className="text-xs text-slate-500">필요 전투력 {enemy.requiredPower}</p>
              </div>
              <Button variant="secondary" disabled={attempts <= 0} onClick={() => handleHunt(enemy.id)}>
                도전
              </Button>
            </li>
          ))}
        </ul>
      </Card>

      <BattleLog encounters={encounters} />
    </div>
  );
}
