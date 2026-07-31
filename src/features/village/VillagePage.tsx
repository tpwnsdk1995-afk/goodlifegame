import { useVillageStore } from '../../store/villageStore';
import { DOMAIN_BUILDING_LABEL, DOMAIN_LABEL } from '../../domain/types';
import { Card } from '../../components/Card';
import { StatBadge } from '../../components/StatBadge';

export function VillagePage() {
  const village = useVillageStore((s) => s.village);
  if (!village) return null;

  return (
    <div className="space-y-4">
      <Card title="내 세력">
        <p className="text-sm text-slate-400 mb-3">
          퀘스트를 완료할 때마다 관련 시설이 함께 성장해요.
        </p>
        <div className="space-y-3">
          {village.buildings.map((building) => (
            <StatBadge
              key={building.domain}
              label={`${DOMAIN_BUILDING_LABEL[building.domain]} (${DOMAIN_LABEL[building.domain]})`}
              level={building.level}
              xp={building.xp}
              colorClass="bg-sky-400"
            />
          ))}
        </div>
      </Card>
    </div>
  );
}
