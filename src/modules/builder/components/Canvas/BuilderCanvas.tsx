import { useState } from 'react';
import type {
  ProjectPageDefinition,
  ViewportMode,
} from '../../types';
import ComponentRenderer from './ComponentRenderer';
import { Alert, Badge } from '../../../../shared/components/ui';
import { WdsIcon } from '../../../../shared/components/icons';

interface BuilderCanvasProps {
  activePage: ProjectPageDefinition;
  viewport: ViewportMode;
  mode: 'edit' | 'preview';
  selectedNodeId: string | null;
  onSelectNode: (id: string | null) => void;
  onDeleteNode: (id: string) => void;
  onDuplicateNode: (id: string) => void;
  onMoveNode: (id: string, direction: 'up' | 'down') => void;
  onNavigatePage: (pageKey: string) => void;
}

export default function BuilderCanvas({
  activePage,
  viewport,
  mode,
  selectedNodeId,
  onSelectNode,
  onDeleteNode,
  onDuplicateNode,
  onMoveNode,
  onNavigatePage,
}: BuilderCanvasProps) {
  const [toastMessage, setToastMessage] = useState<{ text: string; type: string } | null>(null);

  const handleShowToast = (text: string, type: string) => {
    setToastMessage({ text, type });
    setTimeout(() => {
      setToastMessage(null);
    }, 3500);
  };

  // Viewport Container Styles
  const getViewportClasses = () => {
    switch (viewport) {
      case 'tablet':
        return 'w-[768px] mx-auto my-6 shadow-xl border border-border/80 rounded-2xl bg-background min-h-[850px] transition-all overflow-hidden';
      case 'mobile':
        return 'w-[375px] mx-auto my-6 shadow-xl border border-border/80 rounded-2xl bg-background min-h-[700px] transition-all overflow-hidden';
      case 'desktop':
      default:
        return 'w-full min-h-full bg-background transition-all';
    }
  };

  return (
    <div
      onClick={() => {
        if (mode === 'edit') {
          onSelectNode(null);
        }
      }}
      className="relative flex-1 overflow-y-auto bg-surface/30 p-4 sm:p-6"
    >
      {/* Toast Notification for Preview Mode */}
      {toastMessage && (
        <div className="fixed top-20 right-8 z-50 animate-bounce shadow-lg rounded-2xl">
          <Alert
            variant={(toastMessage.type as any) || 'success'}
            title="Notifikasi Sistem"
            message={toastMessage.text}
          />
        </div>
      )}

      {/* Frame Container */}
      <div className={getViewportClasses()}>
        {/* Canvas Header / Title Banner */}
        <div className="border-b border-border bg-card/60 px-6 py-4 flex items-center justify-between">
          <div className="flex flex-col gap-0.5">
            <div className="flex items-center gap-2">
              <h2 className="text-base font-bold text-foreground">
                {activePage.title}
              </h2>
              <Badge variant="primary" size="xs">
                {activePage.type}
              </Badge>
            </div>
            <span className="font-mono text-xs text-muted-foreground">
              Route: {activePage.path}
            </span>
          </div>

          {mode === 'preview' && (
            <Badge variant="success" size="sm">
              Live Preview
            </Badge>
          )}
        </div>

        {/* Content Area */}
        <div className="p-6">
          {activePage.components.length > 0 ? (
            <div className="grid grid-cols-12 gap-4 w-full">
              {activePage.components.map((comp) => (
                <ComponentRenderer
                  key={comp.id}
                  node={comp}
                  mode={mode}
                  selectedNodeId={selectedNodeId}
                  onSelectNode={onSelectNode}
                  onDeleteNode={onDeleteNode}
                  onDuplicateNode={onDuplicateNode}
                  onMoveNode={onMoveNode}
                  onNavigatePage={onNavigatePage}
                  onShowToast={handleShowToast}
                />
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-border py-16 text-center">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10 text-primary mb-3">
                <WdsIcon name="Widget2" className="h-6 w-6" />
              </div>
              <h3 className="text-sm font-bold text-foreground">
                Kanvas Halaman Ini Masih Kosong
              </h3>
              <p className="text-xs text-muted-foreground mt-1 max-w-sm">
                Buka panel <strong>Komponen</strong> di sisi kiri lalu klik atau pilih komponen untuk menyusun halaman ini.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
