import { useState } from 'react';
import { Button, Dialog, TextAreaField, TextField } from '../../../shared/components/ui';
import { SvgIcon, TrashIcon } from '../../../shared/components/icons';
import { sanitizeSvg } from '../../../shared/utils';
import type { MenuIcon } from '../types';

interface MenuIconDialogProps {
  open: boolean;
  initial: MenuIcon | null;
  /** Nama parent efektif ('' = root) untuk info tempel ikon. */
  parentName: string;
  /** Nama modul untuk info tempel ikon. */
  moduleName: string;
  onClose: () => void;
  onSave: (icon: MenuIcon | null) => void;
}

/** Pratinjau selalu dari hasil sanitasi; kode invalid tampil sebagai strip. */
function SvgPreview({ code }: { code: string }) {
  try {
    return <SvgIcon svg={sanitizeSvg(code)} className="h-6 w-6" />;
  } catch {
    return <span className="px-1 text-center text-[10px] text-danger">SVG invalid</span>;
  }
}

function MenuIconDialog({ open, initial, parentName, moduleName, onClose, onSave }: MenuIconDialogProps) {
  const [name, setName] = useState(initial?.name ?? '');
  const [svg, setSvg] = useState(initial?.svg ?? '');
  const [error, setError] = useState<string | null>(null);
  const target = parentName ? `grup parent "${parentName}"` : `menu "${moduleName || 'modul ini'}"`;

  function handleSave(): void {
    try {
      if (name.trim() === '' && svg.trim() === '') {
        onSave(null);
        onClose();
        return;
      }
      if (!name.trim()) throw new Error('Nama ikon wajib diisi.');
      onSave({ name: name.trim(), svg: sanitizeSvg(svg) });
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Kode SVG tidak valid.');
    }
  }

  return (
    <Dialog
      open={open}
      onClose={onClose}
      title="Ikon Menu"
      maxWidth="lg"
      testId="menu-icon-dialog"
      footer={
        <>
          <Button variant="secondary" onClick={onClose}>
            Batal
          </Button>
          <Button onClick={handleSave}>Simpan ikon</Button>
        </>
      }
    >
      <div className="flex flex-col stack-gap">
        {error && (
          <p className="text-sm text-danger" role="alert">
            {error}
          </p>
        )}
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-md bg-muted">
            {svg.trim() !== '' ? (
              <SvgPreview code={svg} />
            ) : (
              <span className="text-xs text-muted-foreground">—</span>
            )}
          </div>
          <p className="text-xs text-muted-foreground">
            Ikon otomatis menempel di {target}. Kosongkan keduanya untuk memakai ikon bawaan.
          </p>
          {(name !== '' || svg !== '') && (
            <Button
              size="sm"
              variant="danger"
              onClick={() => {
                setName('');
                setSvg('');
                setError(null);
              }}
              icon={<TrashIcon className="h-4 w-4" />}
            >
              Hapus
            </Button>
          )}
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium text-foreground">Nama ikon</label>
          <TextField
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="orders-box"
            maxLength={50}
            data-testid="menu-icon-name"
          />
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium text-foreground">
            Kode SVG (paste dari Figma)
          </label>
          <TextAreaField
            value={svg}
            onChange={(e) => setSvg(e.target.value)}
            placeholder="<svg …>…</svg>"
            rows={6}
            className="font-mono text-xs"
            data-testid="menu-icon-svg"
          />
        </div>
      </div>
    </Dialog>
  );
}

export default MenuIconDialog;
