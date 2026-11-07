import { useNavigate } from 'react-router';
import type { ViewportMode, ProjectPageDefinition } from '../../types';
import { Button, Badge } from '../../../../shared/components/ui';
import {
  Eye,
  Pen2,
  WdsIcon,
} from '../../../../shared/components/icons';

interface CanvasToolbarProps {
  projectName: string;
  projectSlug: string;
  activePage: ProjectPageDefinition;
  viewport: ViewportMode;
  mode: 'edit' | 'preview';
  canUndo: boolean;
  canRedo: boolean;
  lastSavedAt: string | null;
  onSetViewport: (v: ViewportMode) => void;
  onSetMode: (m: 'edit' | 'preview') => void;
  onUndo: () => void;
  onRedo: () => void;
}

export default function CanvasToolbar({
  projectName,
  projectSlug,
  activePage,
  viewport,
  mode,
  canUndo,
  canRedo,
  lastSavedAt,
  onSetViewport,
  onSetMode,
  onUndo,
  onRedo,
}: CanvasToolbarProps) {
  const navigate = useNavigate();

  return (
    <header className="flex h-14 w-full shrink-0 items-center justify-between border-b border-border bg-card px-4 shadow-xs">
      {/* Left: Back button & Breadcrumbs */}
      <div className="flex items-center gap-3 min-w-0">
        <Button
          size="sm"
          hierarchy="tertiary"
          onClick={() => navigate('/')}
          className="shrink-0 text-muted-foreground hover:text-foreground"
        >
          ← Workspace
        </Button>

        <div className="h-4 w-px bg-border shrink-0" />

        <div className="flex items-center gap-2 min-w-0">
          <span className="truncate text-xs font-semibold text-muted-foreground">
            {projectName || projectSlug}
          </span>
          <span className="text-muted-foreground/60 text-xs">/</span>
          <span className="truncate text-xs font-bold text-foreground">
            {activePage.title}
          </span>
          <Badge variant="primary" size="xs">
            {activePage.type}
          </Badge>
        </div>
      </div>

      {/* Center: Viewport Switcher & Undo/Redo */}
      <div className="flex items-center gap-2">
        {/* Viewport switchers */}
        <div className="flex items-center rounded-lg border border-border bg-surface/50 p-0.5">
          <button
            type="button"
            title="Desktop (100%)"
            onClick={() => onSetViewport('desktop')}
            className={`flex items-center gap-1.5 rounded-md px-2.5 py-1 text-xs font-semibold transition-all ${
              viewport === 'desktop'
                ? 'bg-card text-primary shadow-xs'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            <WdsIcon name="Monitor" className="h-3.5 w-3.5" fallback="Database" />
            <span className="hidden sm:inline">Desktop</span>
          </button>

          <button
            type="button"
            title="Tablet (768px)"
            onClick={() => onSetViewport('tablet')}
            className={`flex items-center gap-1.5 rounded-md px-2.5 py-1 text-xs font-semibold transition-all ${
              viewport === 'tablet'
                ? 'bg-card text-primary shadow-xs'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            <WdsIcon name="Tablet" className="h-3.5 w-3.5" fallback="Database" />
            <span className="hidden sm:inline">Tablet</span>
          </button>

          <button
            type="button"
            title="Mobile (375px)"
            onClick={() => onSetViewport('mobile')}
            className={`flex items-center gap-1.5 rounded-md px-2.5 py-1 text-xs font-semibold transition-all ${
              viewport === 'mobile'
                ? 'bg-card text-primary shadow-xs'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            <WdsIcon name="Smartphone" className="h-3.5 w-3.5" fallback="Database" />
            <span className="hidden sm:inline">Mobile</span>
          </button>
        </div>

        {/* Undo / Redo */}
        <div className="flex items-center gap-0.5 border-l border-border pl-2">
          <button
            type="button"
            title="Undo (Ctrl+Z)"
            disabled={!canUndo}
            onClick={onUndo}
            className="rounded-lg p-1.5 text-muted-foreground hover:bg-surface hover:text-foreground disabled:opacity-40 disabled:hover:bg-transparent"
          >
            <WdsIcon name="UndoLeftRound" className="h-3.5 w-3.5" fallback="Restart" />
          </button>
          <button
            type="button"
            title="Redo (Ctrl+Y)"
            disabled={!canRedo}
            onClick={onRedo}
            className="rounded-lg p-1.5 text-muted-foreground hover:bg-surface hover:text-foreground disabled:opacity-40 disabled:hover:bg-transparent"
          >
            <WdsIcon name="UndoRightRound" className="h-3.5 w-3.5" fallback="Restart" />
          </button>
        </div>
      </div>

      {/* Right: Auto-saved indicator & Mode Switcher */}
      <div className="flex items-center gap-3">
        {lastSavedAt && (
          <div className="hidden md:flex items-center gap-1.5 text-[11px] text-muted-foreground">
            <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>Tersimpan {lastSavedAt}</span>
          </div>
        )}

        <div className="flex items-center rounded-lg border border-border bg-surface/50 p-0.5">
          <button
            type="button"
            onClick={() => onSetMode('edit')}
            className={`flex items-center gap-1.5 rounded-md px-3 py-1 text-xs font-semibold transition-all ${
              mode === 'edit'
                ? 'bg-primary text-primary-foreground shadow-xs'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            <Pen2 className="h-3 w-3" />
            <span>Editor</span>
          </button>

          <button
            type="button"
            onClick={() => onSetMode('preview')}
            className={`flex items-center gap-1.5 rounded-md px-3 py-1 text-xs font-semibold transition-all ${
              mode === 'preview'
                ? 'bg-primary text-primary-foreground shadow-xs'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            <Eye className="h-3 w-3" />
            <span>Preview</span>
          </button>
        </div>
      </div>
    </header>
  );
}
