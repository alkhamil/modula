import type { CanvasComponentNode } from '../../types';
import {
  TrashBinTrash,
  AltArrowUp,
  AltArrowDown,
  WdsIcon,
} from '../../../../shared/components/icons';

interface OutlineTreePanelProps {
  components: CanvasComponentNode[];
  selectedNodeId: string | null;
  onSelectNode: (id: string | null) => void;
  onDeleteNode: (id: string) => void;
  onMoveNode: (id: string, direction: 'up' | 'down') => void;
}

export default function OutlineTreePanel({
  components,
  selectedNodeId,
  onSelectNode,
  onDeleteNode,
  onMoveNode,
}: OutlineTreePanelProps) {
  const renderNode = (node: CanvasComponentNode, depth = 0) => {
    const isSelected = node.id === selectedNodeId;
    const isContainer = Boolean(node.children && node.children.length >= 0);

    return (
      <div key={node.id} className="flex flex-col">
        <div
          onClick={() => onSelectNode(node.id)}
          style={{ paddingLeft: `${depth * 14 + 8}px` }}
          className={`group flex items-center justify-between rounded-lg py-1.5 pr-2 cursor-pointer transition-all ${
            isSelected
              ? 'bg-primary/10 text-primary font-semibold ring-1 ring-primary/40'
              : 'hover:bg-surface text-foreground'
          }`}
        >
          <div className="flex items-center gap-1.5 min-w-0">
            {isContainer ? (
              <WdsIcon name="LayersMinimalistic" className="h-3.5 w-3.5 text-primary shrink-0" />
            ) : (
              <WdsIcon name="DocumentText" className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
            )}
            <span className="truncate text-xs">{node.name}</span>
            <span className="text-[10px] text-muted-foreground font-mono">({node.type})</span>
          </div>

          <div className="flex items-center gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity">
            <button
              type="button"
              title="Pindah Atas"
              onClick={(e) => {
                e.stopPropagation();
                onMoveNode(node.id, 'up');
              }}
              className="p-1 text-muted-foreground hover:text-foreground"
            >
              <AltArrowUp className="h-3 w-3" />
            </button>
            <button
              type="button"
              title="Pindah Bawah"
              onClick={(e) => {
                e.stopPropagation();
                onMoveNode(node.id, 'down');
              }}
              className="p-1 text-muted-foreground hover:text-foreground"
            >
              <AltArrowDown className="h-3 w-3" />
            </button>
            <button
              type="button"
              title="Hapus Elemen"
              onClick={(e) => {
                e.stopPropagation();
                onDeleteNode(node.id);
              }}
              className="p-1 text-destructive hover:bg-destructive/10 rounded"
            >
              <TrashBinTrash className="h-3 w-3" />
            </button>
          </div>
        </div>

        {/* Render Children if any */}
        {node.children && node.children.length > 0 && (
          <div className="flex flex-col border-l border-border/60 ml-3">
            {node.children.map((child) => renderNode(child, depth + 1))}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center justify-between px-1">
        <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
          Struktur Elemen Halaman
        </h4>
        <span className="text-[11px] text-muted-foreground">
          {components.length} elemen root
        </span>
      </div>

      <div className="flex flex-col gap-1 overflow-y-auto max-h-[calc(100vh-250px)] pr-1">
        {components.map((comp) => renderNode(comp, 0))}

        {components.length === 0 && (
          <div className="py-8 text-center text-xs text-muted-foreground">
            Kanvas halaman masih kosong.
          </div>
        )}
      </div>
    </div>
  );
}
