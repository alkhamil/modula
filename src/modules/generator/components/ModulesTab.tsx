import { useState } from 'react';
import { useNavigate } from 'react-router';
import { useQueryClient } from '@tanstack/react-query';
import { Badge, Button, Dialog, Table, useToast } from '../../../shared/components/ui';
import { TrashIcon } from '../../../shared/components/icons';
import type { ModuleDefinition } from '../definitions';
import { deleteDefinition, deleteModuleRecords } from '../runtime';
import GenerateDialog from './GenerateDialog';

interface ModulesTabProps {
  definitions: ModuleDefinition[];
  isLoading: boolean;
  onEdit: (def: ModuleDefinition) => void;
}

function ModulesTab({ definitions, isLoading, onEdit }: ModulesTabProps) {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { showToast } = useToast();
  const [deleteTarget, setDeleteTarget] = useState<ModuleDefinition | null>(null);
  const [generateTarget, setGenerateTarget] = useState<ModuleDefinition | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  async function handleDelete(): Promise<void> {
    if (!deleteTarget) return;
    setIsDeleting(true);
    try {
      await deleteDefinition(deleteTarget.key);
      await deleteModuleRecords(deleteTarget.apiPlural);
      await queryClient.invalidateQueries({ queryKey: ['dynamic-definitions'] });
      await queryClient.invalidateQueries({ queryKey: ['dynamic-definition'] });
      await queryClient.invalidateQueries({ queryKey: ['dynamic-records'] });
      await queryClient.invalidateQueries({ queryKey: ['dynamic-record'] });
      showToast({ variant: 'success', message: `Modul "${deleteTarget.key}" dihapus.` });
      setDeleteTarget(null);
    } catch (err) {
      showToast({
        variant: 'error',
        message: err instanceof Error ? err.message : 'Gagal menghapus modul.',
      });
    } finally {
      setIsDeleting(false);
    }
  }

  const sorted = [...definitions].sort((a, b) => a.label.localeCompare(b.label));

  return (
    <div className="flex flex-col stack-gap">
      <p className="text-sm text-muted-foreground">
        {definitions.length} modul pernah dibuat. Edit memuat definisi ke Builder; Generate ke
        repo menulis source statis (hanya di `npm run dev`).
      </p>
      <Table<ModuleDefinition>
        testId="modules-table"
        rowKey={(def) => def.key}
        columns={[
          {
            key: 'label',
            header: 'Modul',
            render: (def) => (
              <span>
                <span className="font-medium text-foreground">{def.label}</span>{' '}
                <span className="font-mono text-xs text-muted-foreground">{def.key}</span>
              </span>
            ),
          },
          {
            key: 'parent',
            header: 'Parent',
            render: (def) => (
              <span className="font-mono text-xs text-foreground">{def.parent ?? '(root)'}</span>
            ),
          },
          {
            key: 'status',
            header: 'Status',
            sortable: false,
            render: (def) => (
              <Badge variant={def.status === 'published' ? 'success' : 'secondary'}>
                {def.status === 'published' ? 'Published' : 'Draft'}
              </Badge>
            ),
          },
          {
            key: 'fields',
            header: 'Fields',
            sortable: false,
            render: (def) => (
              <span className="text-foreground">{def.fields.length} field(s)</span>
            ),
          },
        ]}
        data={sorted}
        totalRecords={sorted.length}
        page={1}
        pageSize={sorted.length === 0 ? 10 : sorted.length}
        onPageChange={() => {}}
        onPageSizeChange={() => {}}
        hidePagination
        loading={isLoading}
        isEmptyState={!isLoading && sorted.length === 0}
        emptyStateTitle="Belum ada modul"
        emptyStateDescription="Buat modul pertama lewat Builder, lalu publish."
        renderAction={(def) => (
          <div className="flex flex-wrap justify-end gap-1">
            <Button
              size="sm"
              variant="secondary"
              onClick={() => navigate(`/preview/${encodeURIComponent(def.key)}`)}
            >
              Pratinjau
            </Button>
            <Button size="sm" variant="secondary" onClick={() => onEdit(def)}>
              Edit
            </Button>
            <Button size="sm" variant="secondary" onClick={() => setGenerateTarget(def)}>
              Generate ke repo
            </Button>
            <Button size="sm" variant="danger" onClick={() => setDeleteTarget(def)} icon={<TrashIcon className="h-4 w-4" />}>
              Hapus
            </Button>
          </div>
        )}
      />
      <Dialog
        testId="modules-delete-dialog"
        open={deleteTarget !== null}
        onClose={() => setDeleteTarget(null)}
        title="Hapus modul"
        maxWidth="md"
        closeOnEscape
        closeOnBackdropClick
        footer={
          <>
            <Button variant="secondary" onClick={() => setDeleteTarget(null)}>
              Batal
            </Button>
            <Button variant="danger" disabled={isDeleting} onClick={() => void handleDelete()} icon={<TrashIcon className="h-4 w-4" />}>
              {isDeleting ? 'Menghapus…' : 'Hapus modul'}
            </Button>
          </>
        }
      >
        <p className="text-sm text-foreground">
          Hapus modul "{deleteTarget?.label}" ({deleteTarget?.key})? Definisi + seluruh record
          mock-nya ikut terhapus dan tidak bisa dikembalikan.
        </p>
      </Dialog>
      {generateTarget && (
        <GenerateDialog def={generateTarget} onClose={() => setGenerateTarget(null)} />
      )}
    </div>
  );
}

export default ModulesTab;
