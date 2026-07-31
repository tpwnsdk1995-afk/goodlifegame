import { useCharacterStore } from '../../store/characterStore';
import { DOMAINS, DOMAIN_LABEL } from '../../domain/types';
import { Card } from '../../components/Card';
import { StatBadge } from '../../components/StatBadge';

export function CharacterSheetPage() {
  const character = useCharacterStore((s) => s.character);
  if (!character) return null;

  return (
    <div className="space-y-4">
      <Card>
        <div className="flex items-center gap-3">
          <div className="w-14 h-14 rounded-full bg-amber-500/20 flex items-center justify-center text-2xl">
            🧙
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
