import { useVillageStore } from '../../store/villageStore';
import { DOMAIN_BUILDING_LABEL, DOMAIN_LABEL } from '../../domain/types';
import { Card } from '../../components/Card';
import { ProgressBar } from '../../components/ProgressBar';
import { BuildingSprite } from '../../components/sprites/BuildingSprite';
import { xpToNextLevel } from '../../domain/stats';

export function VillagePage() {
  const village = useVillageStore((s) => s.village);
  if (!village) return null;

  return (
    <div className="space-y-4">
      <Card title="내 세력">
        <p className="text-sm text-slate-400 mb-1">
          퀘스트를 완료할 때마다 관련 시설이 함께 성장해요.
        </p>
      </Card>

      <div className="grid grid-cols-2 gap-3">
        {village.buildings.map((building) => (
          <Card key={building.domain} className="flex flex-col items-center text-center gap-2">
            <BuildingSprite domain={building.domain} level={building.level} size={64} />
            <div>
              <p className="text-sm font-medium text-slate-100">{DOMAIN_BUILDING_LABEL[building.domain]}</p>
              <p className="text-xs text-slate-500">{DOMAIN_LABEL[building.domain]} · Lv.{building.level}</p>
            </div>
            <ProgressBar value={building.xp} max={xpToNextLevel(building.level)} colorClass="bg-sky-400" />
          </Card>
        ))}
      </div>
    </div>
  );
}
