/** Canvas Test Data — isi form draft, simpan baris contoh untuk pratinjau list/detail. */
import { useMemo, useState } from 'react';
import { Button, Card } from '../../../shared/components/ui';
import type { ModuleDefinition } from '../definitions';
import type { DynamicFormValues } from '../runtime/validation';
import { formDefaultValue } from '../runtime/validation';
import DynamicForm from '../runtime/DynamicForm';
import DynamicTable from '../runtime/DynamicTable';
import { makeOptionsLoader, makeRelationOptionsLoader } from '../runtime/recordsApi';
import type { DynamicListItem } from '../runtime/types';
import type { SubmitResult } from '../../../shared/types';

interface TestDataPanelProps {
  def: ModuleDefinition;
  sampleRows: DynamicListItem[];
  onAddRow: (values: DynamicFormValues) => void;
  onClearRows: () => void;
}

const PAGE_SIZE = 10;

function TestDataPanel({ def, sampleRows, onAddRow, onClearRows }: TestDataPanelProps) {
  const [page, setPage] = useState(1);
  const defaults: DynamicFormValues = useMemo(() => {
    const values: DynamicFormValues = {};
    for (const field of def.fields) values[field.name] = formDefaultValue(field);
    return values;
  }, [def.fields]);

  async function handleSubmit(data: DynamicFormValues): Promise<SubmitResult> {
    onAddRow(data);
    return { success: true };
  }

  const pageCount = Math.max(1, Math.ceil(sampleRows.length / PAGE_SIZE));
  const safePage = Math.min(page, pageCount);
  const pageRows = sampleRows.slice((safePage - 1) * PAGE_SIZE, safePage * PAGE_SIZE);

  if (def.fields.length === 0) {
    return <p className="text-sm text-muted-foreground">Tambahkan field di kanvas form dulu.</p>;
  }

  return (
    <div className="flex flex-col stack-gap">
      <p className="text-sm text-muted-foreground">
        Isi form lalu Create — baris tersimpan sebagai data contoh (bukan ke mock store) dan
        dipakai pratinjau List & Detail.
      </p>
      <DynamicForm
        key={sampleRows.length}
        def={def}
        defaultValues={defaults}
        onSubmit={handleSubmit}
        onCancel={() => {}}
        optionsOf={(field) => (field.options ?? []).map((option) => ({ ...option }))}
        loaderOf={(field) =>
          field.source === 'mockPagingInfinityScroll'
            ? makeOptionsLoader(def, field)
            : field.source === 'relation'
              ? makeRelationOptionsLoader(field)
              : undefined
        }
      />
      <Card
        title={`Data contoh (${sampleRows.length})`}
        actions={
          sampleRows.length > 0 ? (
            <Button
              size="sm"
              variant="secondary"
              onClick={() => {
                onClearRows();
                setPage(1);
              }}
            >
              Hapus semua
            </Button>
          ) : undefined
        }
      >
        {sampleRows.length === 0 ? (
          <p className="text-sm text-muted-foreground">Belum ada baris contoh.</p>
        ) : (
          <DynamicTable
            def={def}
            data={pageRows}
            totalRecords={sampleRows.length}
            page={safePage}
            pageSize={PAGE_SIZE}
            onPageChange={setPage}
            onPageSizeChange={() => {}}
            isEmptyState={false}
          />
        )}
      </Card>
    </div>
  );
}

export default TestDataPanel;
