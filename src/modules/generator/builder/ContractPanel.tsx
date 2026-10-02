/** Pratinjau + unduh `api.contract.json` dari definisi draft. */
import { useMemo } from 'react';
import { Button } from '../../../shared/components/ui';
import { downloadBlob } from '../../../shared/utils';
import type { ModuleDefinition } from '../definitions';
import { buildApiContract } from '../definitions';

function ContractPanel({ def }: { def: ModuleDefinition }) {
  const json = useMemo(() => JSON.stringify(buildApiContract(def), null, 2), [def]);

  function handleDownload(): void {
    downloadBlob(new Blob([json], { type: 'application/json' }), `${def.apiPlural}.contract.json`);
  }

  async function handleCopy(): Promise<void> {
    try {
      await navigator.clipboard.writeText(json);
    } catch {
      // Abaikan: clipboard tak tersedia (non-HTTPS); unduh sebagai gantinya.
    }
  }

  return (
    <div>
      <div className="mb-2 flex items-center justify-between gap-2">
        <p className="text-sm font-medium text-foreground">
          Kontrak API untuk backend masa depan ({def.apiPlural}.contract.json)
        </p>
        <div className="flex gap-2">
          <Button size="sm" variant="secondary" onClick={() => void handleCopy()}>
            Salin
          </Button>
          <Button size="sm" variant="secondary" onClick={handleDownload}>
            Unduh
          </Button>
        </div>
      </div>
      <pre className="max-h-96 overflow-auto rounded-lg border border-border bg-muted/30 p-4 font-mono text-xs text-foreground">
        {json}
      </pre>
    </div>
  );
}

export default ContractPanel;
