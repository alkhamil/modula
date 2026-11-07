import { useState } from 'react';
import type {
  ProjectPageDefinition,
  CanvasComponentNode,
} from '../../types';
import PageManagerPanel from './PageManagerPanel';
import ComponentLibraryPanel from './ComponentLibraryPanel';
import OutlineTreePanel from './OutlineTreePanel';
import { WdsIcon } from '../../../../shared/components/icons';

interface LeftSidebarProps {
  pages: ProjectPageDefinition[];
  activePage: ProjectPageDefinition;
  projectSlug: string;
  selectedNode: CanvasComponentNode | null;
  onSelectPage: (id: string) => void;
  onAddPage: (page: Partial<ProjectPageDefinition>) => void;
  onUpdatePage: (id: string, updates: Partial<ProjectPageDefinition>) => void;
  onDeletePage: (id: string) => void;
  onDuplicatePage: (id: string) => void;
  onAddComponent: (type: string, parentId?: string) => void;
  onSelectNode: (id: string | null) => void;
  onDeleteNode: (id: string) => void;
  onMoveNode: (id: string, direction: 'up' | 'down') => void;
}

export default function LeftSidebar({
  pages,
  activePage,
  projectSlug,
  selectedNode,
  onSelectPage,
  onAddPage,
  onUpdatePage,
  onDeletePage,
  onDuplicatePage,
  onAddComponent,
  onSelectNode,
  onDeleteNode,
  onMoveNode,
}: LeftSidebarProps) {
  const [activeTab, setActiveTab] = useState<'pages' | 'components' | 'outline'>('components');

  return (
    <aside className="flex h-full w-80 shrink-0 flex-col border-r border-border bg-card shadow-xs">
      {/* Tab Switcher at the Top */}
      <div className="grid grid-cols-3 border-b border-border bg-surface/50 p-1.5">
        <button
          type="button"
          onClick={() => setActiveTab('pages')}
          className={`flex items-center justify-center gap-1.5 rounded-lg py-2 text-xs font-semibold transition-all ${
            activeTab === 'pages'
              ? 'bg-card text-primary shadow-xs'
              : 'text-muted-foreground hover:text-foreground'
          }`}
        >
          <WdsIcon name="DocumentText" className="h-3.5 w-3.5" />
          <span>Halaman</span>
          <span className="rounded-full bg-surface px-1.5 py-0.2 text-[10px] font-mono text-muted-foreground">
            {pages.length}
          </span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('components')}
          className={`flex items-center justify-center gap-1.5 rounded-lg py-2 text-xs font-semibold transition-all ${
            activeTab === 'components'
              ? 'bg-card text-primary shadow-xs'
              : 'text-muted-foreground hover:text-foreground'
          }`}
        >
          <WdsIcon name="Widget2" className="h-3.5 w-3.5" />
          <span>Komponen</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('outline')}
          className={`flex items-center justify-center gap-1.5 rounded-lg py-2 text-xs font-semibold transition-all ${
            activeTab === 'outline'
              ? 'bg-card text-primary shadow-xs'
              : 'text-muted-foreground hover:text-foreground'
          }`}
        >
          <WdsIcon name="LayersMinimalistic" className="h-3.5 w-3.5" />
          <span>Struktur</span>
        </button>
      </div>

      {/* Tab Content Container */}
      <div className="flex-1 overflow-hidden p-3">
        {activeTab === 'pages' && (
          <PageManagerPanel
            pages={pages}
            activePageId={activePage.id}
            projectSlug={projectSlug}
            onSelectPage={onSelectPage}
            onAddPage={onAddPage}
            onUpdatePage={onUpdatePage}
            onDeletePage={onDeletePage}
            onDuplicatePage={onDuplicatePage}
          />
        )}

        {activeTab === 'components' && (
          <ComponentLibraryPanel
            onAddComponent={onAddComponent}
            selectedNode={selectedNode}
          />
        )}

        {activeTab === 'outline' && (
          <OutlineTreePanel
            components={activePage.components}
            selectedNodeId={selectedNode ? selectedNode.id : null}
            onSelectNode={onSelectNode}
            onDeleteNode={onDeleteNode}
            onMoveNode={onMoveNode}
          />
        )}
      </div>
    </aside>
  );
}
