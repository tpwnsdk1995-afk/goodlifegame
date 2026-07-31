import { useRef, useState } from 'react';
import { useCharacterStore } from '../../store/characterStore';
import { DOMAINS, DOMAIN_LABEL } from '../../domain/types';
import { averageDomainLevel } from '../../domain/stats';
import { exportBackup, importBackup, isBackupPayload } from '../../data/backup';
import { Card } from '../../components/Card';
import { Button } from '../../components/Button';
import { StatBadge } from '../../components/StatBadge';
import { CharacterSprite } from '../../components/sprites/CharacterSprite';

export function CharacterSheetPage() {
  const character = useCharacterStore((s) => s.character);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [backupMessage, setBackupMessage] = useState<string | null>(null);

  if (!character) return null;

  const handleExport = async () => {
    const backup = await exportBackup();
    const blob = new Blob([JSON.stringify(backup, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `goodlifegame-backup-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleImportClick = () => fileInputRef.current?.click();

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = ''; // allow re-selecting the same file later
    if (!file) return;

    try {
      const parsed = JSON.parse(await file.text());
      if (!isBackupPayload(parsed)) {
        setBackupMessage('올바른 백업 파일이 아니에요.');
        return;
      }
      if (!window.confirm('현재 데이터를 이 백업으로 덮어씁니다. 계속할까요?')) return;
      await importBackup(parsed);
      window.location.reload();
    } catch {
      setBackupMessage('백업 파일을 읽는 중 오류가 발생했어요.');
    }
  };

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

      <Card title="데이터 관리">
        <p className="text-xs text-slate-400 mb-3">
          이 기기에만 저장되는 데이터예요. 기기를 바꾸기 전에 내보내기로 백업해두세요.
        </p>
        <div className="flex gap-2">
          <Button variant="secondary" className="flex-1" onClick={handleExport}>
            내보내기
          </Button>
          <Button variant="secondary" className="flex-1" onClick={handleImportClick}>
            가져오기
          </Button>
        </div>
        <input
          ref={fileInputRef}
          type="file"
          accept="application/json"
          className="hidden"
          onChange={handleFileChange}
        />
        {backupMessage && <p className="mt-2 text-xs text-rose-400">{backupMessage}</p>}
      </Card>
    </div>
  );
}
