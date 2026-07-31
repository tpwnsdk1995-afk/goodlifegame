import { useCharacterStore } from '../../store/characterStore';
import { DOMAINS, DOMAIN_LABEL } from '../../domain/types';
import { averageDomainLevel } from '../../domain/stats';
import { Card } from '../../components/Card';
import { StatBadge } from '../../components/StatBadge';
import { CharacterSprite } from '../../components/sprites/CharacterSprite';

export function CharacterSheetPage() {
  const character = useCharacterStore((s) => s.character);
  if (!character) return null;

  return (
    <div className="space-y-4">
      <Card>
        <div className="flex items-center gap-3">
          <div className="w-20 h-20 flex items-center justify-center">
            <CharacterSprite averageLevel={averageDomainLevel(character)} size={80} />
          </div>
          <div>
            <p className="font-semibold text-slate-100">{character.name}</p>
            <p className="text-xs text-slate-400">골드 {character.gold}</p>
          </div>
        </div>
      </Card>

      <Card title="스탯">
        <div className="space-y-3">
          {DOMAINS.map((domain) => (
            <StatBadge
              key={domain}
              label={DOMAIN_LABEL[domain]}
              level={character.stats[domain].level}
              xp={character.stats[domain].xp}
            />
          ))}
        </div>
      </Card>
    </div>
  );
}
