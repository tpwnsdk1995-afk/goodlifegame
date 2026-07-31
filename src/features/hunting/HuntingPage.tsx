import { useEffect, useState } from 'react';
import { useCharacterStore } from '../../store/characterStore';
import { useCombatStore } from '../../store/combatStore';
import { attemptHunt, getAvailableHuntingAttempts } from '../../store/gameActions';
import { computeTotalPower } from '../../domain/combat';
import { averageDomainLevel } from '../../domain/stats';
import { combatRepository } from '../../data/repositories/combatRepository';
import { Card } from '../../components/Card';
import { Button } from '../../components/Button';
import { CharacterSprite } from '../../components/sprites/CharacterSprite';
import { EnemySprite } from '../../components/sprites/EnemySprite';
import { BattleLog } from './BattleLog';
import type { Enemy, EncounterOutcome } from '../../domain/types';

type Phase = 'idle' | 'attacking' | 'result';

const OUTCOME_MESSAGE: Record<EncounterOutcome, string> = {
  WIN: '승리했어요! 보상을 획득했습니다.',
  PARTIAL: '아쉽게 접전이었어요. 절반의 보상을 얻었습니다.',
  LOSE: '패배했어요... 전투력을 더 키워보세요.',
};

const OUTCOME_COLOR: Record<EncounterOutcome, string> = {
  WIN: 'text-emerald-400',
  PARTIAL: 'text-amber-400',
  LOSE: 'text-rose-400',
};

export function HuntingPage() {
  const character = useCharacterStore((s) => s.character);
  const encounters = useCombatStore((s) => s.encounters);
  const [attempts, setAttempts] = useState(0);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [phase, setPhase] = useState<Phase>('idle');
  const [activeEnemy, setActiveEnemy] = useState<Enemy | null>(null);
  const [lastOutcome, setLastOutcome] = useState<EncounterOutcome | null>(null);

  const enemies = combatRepository.listEnemies();
  const power = character ? computeTotalPower(character) : 0;

  const refresh = () => getAvailableHuntingAttempts().then(setAttempts);

  useEffect(() => {
    refresh();
  }, []);

  const handleHunt = (enemy: Enemy) => {
    if (phase !== 'idle') return;
    setActiveEnemy(enemy);
    setErrorMessage(null);
    setLastOutcome(null);
    setPhase('attacking');

    setTimeout(async () => {
      try {
        const encounter = await attemptHunt(enemy.id);
        setLastOutcome(encounter.outcome);
        setPhase('result');
        await refresh();
      } catch (err) {
        setPhase('idle');
        setActiveEnemy(null);
        setErrorMessage(err instanceof Error ? err.message : '알 수 없는 오류가 발생했어요.');
        return;
      }
      setTimeout(() => setPhase('idle'), 900);
    }, 350);
  };

  const enemyTierIndex = activeEnemy ? enemies.findIndex((e) => e.id === activeEnemy.id) : -1;

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

      <Card>
        <div className="flex items-center justify-between px-2">
          <div className={`battle-character ${phase === 'attacking' ? 'attacking' : ''}`}>
            <CharacterSprite averageLevel={character ? averageDomainLevel(character) : 1} size={72} />
          </div>
          <span className="text-slate-500 font-bold text-sm">VS</span>
          <div className={`battle-enemy ${phase === 'result' ? 'hit' : ''}`}>
            {activeEnemy ? (
              <EnemySprite tierIndex={Math.max(0, enemyTierIndex)} size={72} />
            ) : (
              <div className="w-[72px] h-[72px] flex items-center justify-center text-slate-600 text-xs text-center">
                적을 선택하세요
              </div>
            )}
          </div>
        </div>
        {phase === 'result' && lastOutcome && (
          <p className={`mt-3 text-sm text-center font-medium ${OUTCOME_COLOR[lastOutcome]}`}>
            {OUTCOME_MESSAGE[lastOutcome]}
          </p>
        )}
        {errorMessage && <p className="mt-3 text-sm text-center text-rose-400">{errorMessage}</p>}
      </Card>

      <Card title="사냥터">
        <ul className="space-y-2">
          {enemies.map((enemy, idx) => (
            <li key={enemy.id} className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <EnemySprite tierIndex={idx} size={36} />
                <div>
                  <p className="text-sm text-slate-100">{enemy.name}</p>
                  <p className="text-xs text-slate-500">필요 전투력 {enemy.requiredPower}</p>
                </div>
              </div>
              <Button
                variant="secondary"
                disabled={attempts <= 0 || phase !== 'idle'}
                onClick={() => handleHunt(enemy)}
              >
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
