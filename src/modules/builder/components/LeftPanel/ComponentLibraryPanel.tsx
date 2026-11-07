import { useState, useMemo } from 'react';
import type { ComponentCategory, CanvasComponentNode } from '../../types';
import { COMPONENT_CATALOG } from '../../componentRegistry';
import { InputField, Badge } from '../../../../shared/components/ui';
import {
  Plus,
  WdsIcon,
} from '../../../../shared/components/icons';

interface ComponentLibraryPanelProps {
  onAddComponent: (type: string, parentId?: string) => void;
  selectedNode: CanvasComponentNode | null;
}

const CATEGORY_CONFIG: Record<ComponentCategory, { label: string; icon: string }> = {
  layout: { label: 'Tata Letak (Layout)', icon: 'LayersMinimalistic' },
  form: { label: 'Formulir & Input', icon: 'Checklist' },
  data: { label: 'Tampilan Data', icon: 'ServerSquare' },
  action: { label: 'Aksi & Tombol', icon: 'BookmarkSquareMinimalistic' },
  feedback: { label: 'Notifikasi & Feedback', icon: 'AirbudsCheck' },
};

function getComponentIcon(type: string): string {
  switch (type) {
    case 'card':
    case 'container':
      return 'LayersMinimalistic';
    case 'data-table':
      return 'ServerSquare';
    case 'metric-card':
      return 'Widget2';
    case 'date-picker':
      return 'CalendarMinimalistic';
    case 'alert':
      return 'AirbudsCheck';
    default:
      return 'DocumentText';
  }
}

export default function ComponentLibraryPanel({
  onAddComponent,
  selectedNode,
}: ComponentLibraryPanelProps) {
  const [search, setSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState<ComponentCategory | 'all'>('all');

  const filteredCatalog = useMemo(() => {
    return COMPONENT_CATALOG.filter((item) => {
      const matchSearch =
        item.name.toLowerCase().includes(search.toLowerCase()) ||
        item.description.toLowerCase().includes(search.toLowerCase());
      const matchCat = activeCategory === 'all' || item.category === activeCategory;
      return matchSearch && matchCat;
    });
  }, [search, activeCategory]);

  const canNestIntoSelected = selectedNode && (selectedNode.type === 'card' || selectedNode.type === 'grid-2' || selectedNode.type === 'grid-3');

  return (
    <div className="flex flex-col gap-3">
      {/* Header Info */}
      <div className="flex flex-col gap-1 px-1">
        <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
          Katalog Komponen WDS
        </h4>
        <p className="text-[11px] text-muted-foreground">
          Klik komponen untuk menambahkan ke halaman.
        </p>
      </div>

      {/* Target Container Banner if a Card/Grid is selected */}
      {canNestIntoSelected && (
        <div className="flex items-center justify-between rounded-lg border border-primary/40 bg-primary/5 p-2 text-xs">
          <div className="flex items-center gap-1.5 min-w-0">
            <span className="h-2 w-2 rounded-full bg-primary shrink-0" />
            <span className="truncate text-foreground font-medium">
              Target: <strong>{selectedNode.name}</strong>
            </span>
          </div>
          <Badge variant="primary" size="xs">
            Nested
          </Badge>
        </div>
      )}

      {/* Search Input */}
      <div className="px-1">
        <InputField
          placeholder="Cari komponen..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {/* Category Pills */}
      <div className="flex items-center gap-1 overflow-x-auto px-1 pb-1">
        <button
          type="button"
          onClick={() => setActiveCategory('all')}
          className={`shrink-0 rounded-lg px-2.5 py-1 text-[11px] font-semibold transition-all ${
            activeCategory === 'all'
              ? 'bg-primary text-primary-foreground'
              : 'text-muted-foreground hover:bg-surface hover:text-foreground'
          }`}
        >
          Semua
        </button>
        {(Object.keys(CATEGORY_CONFIG) as ComponentCategory[]).map((cat) => (
          <button
            key={cat}
            type="button"
            onClick={() => setActiveCategory(cat)}
            className={`shrink-0 rounded-lg px-2.5 py-1 text-[11px] font-semibold transition-all ${
              activeCategory === cat
                ? 'bg-primary text-primary-foreground'
                : 'text-muted-foreground hover:bg-surface hover:text-foreground'
            }`}
          >
            {CATEGORY_CONFIG[cat].label.split(' ')[0]}
          </button>
        ))}
      </div>

      {/* Components List */}
      <div className="flex flex-col gap-2 overflow-y-auto max-h-[calc(100vh-270px)] pr-1">
        {filteredCatalog.map((item) => {
          const iconName = getComponentIcon(item.type);
          return (
            <div
              key={item.type}
              onClick={() => onAddComponent(item.type, canNestIntoSelected ? selectedNode.id : undefined)}
              className="group flex flex-col gap-1.5 rounded-xl border border-border bg-card p-3 cursor-pointer transition-all hover:border-primary/50 hover:bg-surface hover:shadow-xs"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-primary/10 text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                    <WdsIcon name={iconName} className="h-3.5 w-3.5" />
                  </div>
                  <span className="text-xs font-bold text-foreground">
                    {item.name}
                  </span>
                </div>
                <div className="flex items-center gap-1">
                  <Badge variant="neutral" size="xs">
                    {item.category}
                  </Badge>
                  <button
                    type="button"
                    title="Tambah ke kanvas"
                    className="flex h-6 w-6 items-center justify-center rounded-md border border-border text-muted-foreground group-hover:border-primary group-hover:bg-primary group-hover:text-primary-foreground transition-all"
                  >
                    <Plus className="h-3 w-3" />
                  </button>
                </div>
              </div>

              <p className="text-[11px] text-muted-foreground line-clamp-2 pl-9">
                {item.description}
              </p>
            </div>
          );
        })}

        {filteredCatalog.length === 0 && (
          <div className="py-8 text-center text-xs text-muted-foreground">
            Tidak ada komponen yang cocok dengan pencarian "{search}".
          </div>
        )}
      </div>
    </div>
  );
}
