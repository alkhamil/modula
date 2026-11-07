import React, { useState } from 'react';
import type { CanvasComponentNode } from '../../types';
import {
  Button,
  Card,
  InputField,
  Textarea,
  Toggle,
  Badge,
  Alert,
  EmptyState,
} from '../../../../shared/components/ui';
import {
  TrashBinTrash,
  AltArrowUp,
  AltArrowDown,
  WdsIcon,
} from '../../../../shared/components/icons';

interface ComponentRendererProps {
  node: CanvasComponentNode;
  mode: 'edit' | 'preview';
  selectedNodeId: string | null;
  onSelectNode: (id: string) => void;
  onDeleteNode: (id: string) => void;
  onDuplicateNode: (id: string) => void;
  onMoveNode: (id: string, direction: 'up' | 'down') => void;
  onNavigatePage?: (pageKey: string) => void;
  onShowToast?: (message: string, type: string) => void;
}

export default function ComponentRenderer({
  node,
  mode,
  selectedNodeId,
  onSelectNode,
  onDeleteNode,
  onDuplicateNode,
  onMoveNode,
  onNavigatePage,
  onShowToast,
}: ComponentRendererProps) {
  const isSelected = mode === 'edit' && selectedNodeId === node.id;
  const props = node.props || {};

  // Form input local state for preview mode
  const [inputValue, setInputValue] = useState(props.defaultValue || '');
  const [toggleVal, setToggleVal] = useState(Boolean(props.checked));
  const [checkboxVal, setCheckboxVal] = useState(Boolean(props.checked));
  const [tableSearch, setTableSearch] = useState('');

  // Handle Action Trigger
  const handleAction = (e?: React.MouseEvent) => {
    if (mode === 'edit') return;
    if (e) e.preventDefault();

    const action = node.actions;
    if (!action || action.onClick === 'none') return;

    if (action.onClick === 'navigate' && action.targetPageKey && onNavigatePage) {
      onNavigatePage(action.targetPageKey);
    } else if (action.onClick === 'toast' && onShowToast) {
      onShowToast(action.toastMessage || 'Aksi berhasil dijalankan', action.toastType || 'success');
    } else if (action.onClick === 'submit-form' && onShowToast) {
      onShowToast('Formulir berhasil dikirim!', 'success');
    }
  };

  // Convert colSpan prop to grid classes
  const getColSpanClass = (span?: number) => {
    switch (span) {
      case 3:
        return 'col-span-12 md:col-span-3';
      case 4:
        return 'col-span-12 md:col-span-4';
      case 6:
        return 'col-span-12 md:col-span-6';
      case 12:
      default:
        return 'col-span-12';
    }
  };

  const renderContent = () => {
    switch (node.type) {
      // 1. Card Layout
      case 'card':
        return (
          <Card
            title={props.title || 'Card Container'}
            description={props.subtitle}
            className="w-full shadow-xs"
          >
            <div className="grid grid-cols-12 gap-4 mt-2">
              {node.children && node.children.length > 0 ? (
                node.children.map((child) => (
                  <ComponentRenderer
                    key={child.id}
                    node={child}
                    mode={mode}
                    selectedNodeId={selectedNodeId}
                    onSelectNode={onSelectNode}
                    onDeleteNode={onDeleteNode}
                    onDuplicateNode={onDuplicateNode}
                    onMoveNode={onMoveNode}
                    onNavigatePage={onNavigatePage}
                    onShowToast={onShowToast}
                  />
                ))
              ) : (
                <div className="col-span-12 flex flex-col items-center justify-center rounded-xl border border-dashed border-border p-6 text-center text-xs text-muted-foreground bg-surface/30">
                  <span>Kontainer Card ini masih kosong.</span>
                  <span className="text-[11px] text-muted-foreground/80 mt-1">
                    Pilih card ini lalu klik komponen di panel kiri untuk memasukkan elemen ke dalam card.
                  </span>
                </div>
              )}
            </div>
          </Card>
        );

      // 2. Grids
      case 'grid-2':
        return (
          <div className="col-span-12 grid grid-cols-1 md:grid-cols-2 gap-4 w-full">
            {node.children && node.children.length > 0 ? (
              node.children.map((child) => (
                <ComponentRenderer
                  key={child.id}
                  node={child}
                  mode={mode}
                  selectedNodeId={selectedNodeId}
                  onSelectNode={onSelectNode}
                  onDeleteNode={onDeleteNode}
                  onDuplicateNode={onDuplicateNode}
                  onMoveNode={onMoveNode}
                  onNavigatePage={onNavigatePage}
                  onShowToast={onShowToast}
                />
              ))
            ) : (
              <div className="col-span-2 rounded-lg border border-dashed border-border p-4 text-center text-xs text-muted-foreground">
                Baris Grid 2 Kolom Kosong
              </div>
            )}
          </div>
        );

      case 'grid-3':
        return (
          <div className="col-span-12 grid grid-cols-1 md:grid-cols-3 gap-4 w-full">
            {node.children && node.children.length > 0 ? (
              node.children.map((child) => (
                <ComponentRenderer
                  key={child.id}
                  node={child}
                  mode={mode}
                  selectedNodeId={selectedNodeId}
                  onSelectNode={onSelectNode}
                  onDeleteNode={onDeleteNode}
                  onDuplicateNode={onDuplicateNode}
                  onMoveNode={onMoveNode}
                  onNavigatePage={onNavigatePage}
                  onShowToast={onShowToast}
                />
              ))
            ) : (
              <div className="col-span-3 rounded-lg border border-dashed border-border p-4 text-center text-xs text-muted-foreground">
                Baris Grid 3 Kolom Kosong
              </div>
            )}
          </div>
        );

      // 3. Divider
      case 'divider':
        return (
          <div className="py-2 w-full col-span-12">
            <div className="relative flex items-center justify-center">
              <div className="w-full border-t border-border" />
              {props.label && (
                <span className="absolute bg-background px-3 text-xs font-medium text-muted-foreground">
                  {props.label}
                </span>
              )}
            </div>
          </div>
        );

      // 4. Form Fields
      case 'input-field':
        return (
          <div className="flex flex-col gap-1.5 w-full">
            {props.label && (
              <label className="text-xs font-semibold text-foreground">
                {props.label} {props.required && <span className="text-destructive">*</span>}
              </label>
            )}
            <InputField
              placeholder={props.placeholder || 'Ketik di sini...'}
              hint={props.helperText}
              disabled={props.disabled}
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
            />
          </div>
        );

      case 'textarea':
        return (
          <div className="flex flex-col gap-1.5 w-full">
            {props.label && (
              <label className="text-xs font-semibold text-foreground">
                {props.label} {props.required && <span className="text-destructive">*</span>}
              </label>
            )}
            <Textarea
              placeholder={props.placeholder || 'Tuliskan catatan...'}
              hint={props.helperText}
              rows={props.rows || 3}
              disabled={props.disabled}
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
            />
          </div>
        );

      case 'select': {
        const options = Array.isArray(props.options) ? props.options : [];
        return (
          <div className="flex flex-col gap-1.5 w-full">
            {props.label && (
              <label className="text-xs font-semibold text-foreground">
                {props.label} {props.required && <span className="text-destructive">*</span>}
              </label>
            )}
            <div className="relative">
              <select
                disabled={props.disabled}
                defaultValue={props.defaultValue || ''}
                className="w-full rounded-xl border border-border bg-card px-3.5 py-2.5 text-xs text-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary shadow-xs"
              >
                <option value="" disabled>
                  {props.placeholder || 'Pilih opsi...'}
                </option>
                {options.map((opt: any) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>
            {props.helperText && (
              <span className="text-[11px] text-muted-foreground">{props.helperText}</span>
            )}
          </div>
        );
      }

      case 'date-picker':
        return (
          <div className="flex flex-col gap-1.5 w-full">
            {props.label && (
              <label className="text-xs font-semibold text-foreground">
                {props.label} {props.required && <span className="text-destructive">*</span>}
              </label>
            )}
            <div className="relative flex items-center">
              <input
                type="date"
                defaultValue={props.defaultValue || '2026-11-07'}
                disabled={props.disabled}
                className="w-full rounded-xl border border-border bg-card px-3.5 py-2 text-xs text-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary shadow-xs"
              />
            </div>
            {props.helperText && (
              <span className="text-[11px] text-muted-foreground">{props.helperText}</span>
            )}
          </div>
        );

      case 'checkbox':
        return (
          <label className="flex items-center gap-2 cursor-pointer select-none">
            <input
              type="checkbox"
              checked={checkboxVal}
              onChange={(e) => setCheckboxVal(e.target.checked)}
              className="h-4 w-4 rounded border-border text-primary focus:ring-primary"
            />
            <span className="text-xs text-foreground">{props.label || 'Checkbox option'}</span>
          </label>
        );

      case 'toggle':
        return (
          <Toggle
            switchLabel={props.label || 'Toggle Switch'}
            hint={props.description}
            value={toggleVal}
            onChange={(val) => setToggleVal(val)}
          />
        );

      case 'file-upload':
        return (
          <div className="flex flex-col gap-1.5 w-full">
            {props.label && (
              <label className="text-xs font-semibold text-foreground">
                {props.label} {props.required && <span className="text-destructive">*</span>}
              </label>
            )}
            <div className="flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-border bg-surface/30 p-6 text-center hover:bg-surface/60 transition-colors">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary mb-2">
                <WdsIcon name="CloudStorage" className="h-5 w-5" />
              </div>
              <span className="text-xs font-semibold text-foreground">
                Klik untuk unggah atau seret berkas ke sini
              </span>
              <span className="text-[11px] text-muted-foreground mt-1">
                {props.helperText || 'PDF, PNG, JPG hingga 5MB'}
              </span>
            </div>
          </div>
        );

      // 5. Data Table
      case 'data-table': {
        const columns = Array.isArray(props.columns) ? props.columns : [];
        const rawRows = Array.isArray(props.rows) ? props.rows : [];
        const filteredRows = rawRows.filter((r) => {
          if (!tableSearch) return true;
          return Object.values(r).some((val) =>
            String(val).toLowerCase().includes(tableSearch.toLowerCase()),
          );
        });

        return (
          <div className="flex flex-col gap-3 w-full rounded-2xl border border-border bg-card p-4 shadow-xs">
            {/* Header & Search */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
              <div>
                <h4 className="text-sm font-bold text-foreground">{props.title || 'Data Table'}</h4>
                <p className="text-xs text-muted-foreground">Menampilkan {filteredRows.length} data record</p>
              </div>

              {props.showSearch !== false && (
                <div className="w-full sm:w-64">
                  <InputField
                    placeholder="Cari dalam tabel..."
                    value={tableSearch}
                    onChange={(e) => setTableSearch(e.target.value)}
                  />
                </div>
              )}
            </div>

            {/* Table */}
            <div className="overflow-x-auto rounded-xl border border-border">
              <table className="w-full text-left text-xs border-collapse">
                <thead className="bg-surface/70 border-b border-border text-[11px] font-bold text-muted-foreground uppercase tracking-wider">
                  <tr>
                    {columns.map((c: any) => (
                      <th key={c.key} className="px-4 py-3">
                        {c.label}
                      </th>
                    ))}
                    <th className="px-4 py-3 text-right">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {filteredRows.map((row: any, i: number) => (
                    <tr key={row.id || i} className="hover:bg-surface/40 transition-colors">
                      {columns.map((c: any) => (
                        <td key={c.key} className="px-4 py-3 font-medium text-foreground">
                          {c.key === 'status' ? (
                            <Badge
                              variant={
                                row[c.key] === 'ACTIVE'
                                  ? 'success'
                                  : row[c.key] === 'PENDING'
                                    ? 'warning'
                                    : 'neutral'
                              }
                              size="xs"
                            >
                              {row[c.key]}
                            </Badge>
                          ) : (
                            row[c.key] || '-'
                          )}
                        </td>
                      ))}
                      <td className="px-4 py-3 text-right">
                        <Button
                          size="xs"
                          hierarchy="tertiary"
                          onClick={() => handleAction()}
                        >
                          Lihat
                        </Button>
                      </td>
                    </tr>
                  ))}
                  {filteredRows.length === 0 && (
                    <tr>
                      <td colSpan={columns.length + 1} className="py-6 text-center text-xs text-muted-foreground">
                        Tidak ada record data yang cocok.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        );
      }

      // 6. Metric Card
      case 'metric-card':
        return (
          <div className="flex flex-col justify-between rounded-2xl border border-border bg-card p-4 shadow-xs">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-muted-foreground">{props.title}</span>
              {props.change && (
                <Badge
                  variant={props.trend === 'up' ? 'success' : props.trend === 'down' ? 'error' : 'neutral'}
                  size="xs"
                >
                  {props.change}
                </Badge>
              )}
            </div>
            <div className="mt-3 flex flex-col">
              <span className="text-2xl font-bold tracking-tight text-foreground">
                {props.value || '0'}
              </span>
              {props.period && (
                <span className="text-[11px] text-muted-foreground mt-0.5">{props.period}</span>
              )}
            </div>
          </div>
        );

      // 7. Badge
      case 'badge':
        return (
          <div className="flex items-center">
            <Badge variant={props.variant || 'primary'} size={props.size || 'sm'}>
              {props.text || 'Badge Tag'}
            </Badge>
          </div>
        );

      // 8. Empty State
      case 'empty-state':
        return (
          <EmptyState
            title={props.title || 'Belum Ada Data'}
            description={props.description || 'Data modul ini masih kosong.'}
            actions={
              props.buttonText ? (
                <Button size="sm" hierarchy="primary" onClick={handleAction}>
                  {props.buttonText}
                </Button>
              ) : undefined
            }
          />
        );

      // 9. Button Action
      case 'button':
        return (
          <div className="flex items-center">
            <Button
              hierarchy={props.hierarchy || 'primary'}
              size={props.size || 'md'}
              disabled={props.disabled}
              onClick={handleAction}
            >
              {props.label || 'Tombol Aksi'}
            </Button>
          </div>
        );

      // 10. Alert
      case 'alert':
        return (
          <div className="w-full shadow-xs">
            <Alert
              variant={(props.variant as any) || 'info'}
              title={props.title}
              message={props.message || 'Pemberitahuan informasi modul.'}
            />
          </div>
        );

      default:
        return (
          <div className="rounded-lg border border-dashed border-border p-3 text-xs text-muted-foreground">
            Komponen ({node.type})
          </div>
        );
    }
  };

  return (
    <div
      onClick={(e) => {
        if (mode === 'edit') {
          e.stopPropagation();
          onSelectNode(node.id);
        }
      }}
      className={`relative transition-all ${getColSpanClass(props.colSpan)} ${
        mode === 'edit'
          ? isSelected
            ? 'ring-2 ring-primary ring-offset-2 rounded-xl'
            : 'hover:ring-1 hover:ring-primary/40 rounded-xl cursor-pointer'
          : ''
      }`}
    >
      {/* Editor Floating Action Controls when selected */}
      {isSelected && (
        <div className="absolute -top-3.5 right-2 z-20 flex items-center gap-1 rounded-md border border-primary/40 bg-card px-2 py-0.5 shadow-md">
          <span className="text-[10px] font-bold text-primary mr-1">
            {node.name}
          </span>
          <button
            type="button"
            title="Pindah Ke Atas"
            onClick={(e) => {
              e.stopPropagation();
              onMoveNode(node.id, 'up');
            }}
            className="rounded p-0.5 text-muted-foreground hover:bg-surface hover:text-foreground"
          >
            <AltArrowUp className="h-3 w-3" />
          </button>
          <button
            type="button"
            title="Pindah Ke Bawah"
            onClick={(e) => {
              e.stopPropagation();
              onMoveNode(node.id, 'down');
            }}
            className="rounded p-0.5 text-muted-foreground hover:bg-surface hover:text-foreground"
          >
            <AltArrowDown className="h-3 w-3" />
          </button>
          <button
            type="button"
            title="Duplikat"
            onClick={(e) => {
              e.stopPropagation();
              onDuplicateNode(node.id);
            }}
            className="rounded p-0.5 text-muted-foreground hover:bg-surface hover:text-foreground"
          >
            <WdsIcon name="Copy" className="h-3 w-3" />
          </button>
          <button
            type="button"
            title="Hapus"
            onClick={(e) => {
              e.stopPropagation();
              onDeleteNode(node.id);
            }}
            className="rounded p-0.5 text-destructive hover:bg-destructive/10"
          >
            <TrashBinTrash className="h-3 w-3" />
          </button>
        </div>
      )}

      {/* Render Component Content */}
      <div className="w-full">{renderContent()}</div>
    </div>
  );
}
