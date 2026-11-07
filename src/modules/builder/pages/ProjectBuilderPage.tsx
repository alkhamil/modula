import { useEffect, useState, useCallback } from 'react';
import { useParams } from 'react-router';
import { getWorkspaceProject } from '../../workspace/workspaceApi';
import type { WorkspaceProject } from '../../workspace/types';
import { useProjectBuilder } from '../builderStore';
import CanvasToolbar from '../components/Canvas/CanvasToolbar';
import LeftSidebar from '../components/LeftPanel/LeftSidebar';
import BuilderCanvas from '../components/Canvas/BuilderCanvas';
import PropertiesInspectorPanel from '../components/RightPanel/PropertiesInspectorPanel';

export default function ProjectBuilderPage() {
  const { slug = 'default-project' } = useParams<{ slug: string }>();

  const [project, setProject] = useState<WorkspaceProject | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    getWorkspaceProject(slug).then((res) => {
      if (active) {
        setProject(res);
        setLoading(false);
      }
    });
    return () => {
      active = false;
    };
  }, [slug]);

  const projectName = project?.name || slug;

  const {
    pages,
    activePage,
    setActivePageId,
    selectedNodeId,
    selectedNode,
    setSelectedNodeId,
    viewport,
    setViewport,
    mode,
    setMode,
    lastSavedAt,
    canUndo,
    canRedo,
    undo,
    redo,
    addPage,
    updatePage,
    deletePage,
    duplicatePage,
    addComponent,
    updateComponent,
    deleteComponent,
    moveComponent,
    duplicateComponent,
  } = useProjectBuilder(slug, projectName);

  // Keyboard Shortcuts (Undo, Redo, Escape)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const isInput = ['INPUT', 'TEXTAREA', 'SELECT'].includes(
        (document.activeElement?.tagName || '').toUpperCase(),
      );

      // Undo: Ctrl+Z or Cmd+Z
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'z' && !e.shiftKey) {
        if (!isInput) {
          e.preventDefault();
          undo();
        }
      }
      // Redo: Ctrl+Y or Cmd+Shift+Z
      else if (
        ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'y') ||
        ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key.toLowerCase() === 'z')
      ) {
        if (!isInput) {
          e.preventDefault();
          redo();
        }
      }
      // Deselect on Escape
      else if (e.key === 'Escape') {
        setSelectedNodeId(null);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [undo, redo, setSelectedNodeId]);

  // Navigate between pages when triggered by action in Preview Mode
  const handleNavigatePage = useCallback(
    (pageKey: string) => {
      const target = pages.find((p) => p.key === pageKey);
      if (target) {
        setActivePageId(target.id);
        setSelectedNodeId(null);
      }
    },
    [pages, setActivePageId, setSelectedNodeId],
  );

  if (loading) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-3">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
          <span className="text-xs font-semibold text-muted-foreground">
            Memuat Modula Page Builder...
          </span>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen w-full flex-col overflow-hidden bg-background">
      {/* Top Toolbar */}
      <CanvasToolbar
        projectName={projectName}
        projectSlug={slug}
        activePage={activePage}
        viewport={viewport}
        mode={mode}
        canUndo={canUndo}
        canRedo={canRedo}
        lastSavedAt={lastSavedAt}
        onSetViewport={setViewport}
        onSetMode={setMode}
        onUndo={undo}
        onRedo={redo}
      />

      {/* 3-Panel Main Workspace */}
      <div className="flex flex-1 overflow-hidden">
        {/* Left Panel: Pages, Components, Outline */}
        <LeftSidebar
          pages={pages}
          activePage={activePage}
          projectSlug={slug}
          selectedNode={selectedNode}
          onSelectPage={(id) => {
            setActivePageId(id);
            setSelectedNodeId(null);
          }}
          onAddPage={addPage}
          onUpdatePage={updatePage}
          onDeletePage={deletePage}
          onDuplicatePage={duplicatePage}
          onAddComponent={addComponent}
          onSelectNode={setSelectedNodeId}
          onDeleteNode={deleteComponent}
          onMoveNode={moveComponent}
        />

        {/* Center Panel: Visual Canvas */}
        <BuilderCanvas
          activePage={activePage}
          viewport={viewport}
          mode={mode}
          selectedNodeId={selectedNodeId}
          onSelectNode={setSelectedNodeId}
          onDeleteNode={deleteComponent}
          onDuplicateNode={duplicateComponent}
          onMoveNode={moveComponent}
          onNavigatePage={handleNavigatePage}
        />

        {/* Right Panel: Properties Inspector */}
        <PropertiesInspectorPanel
          selectedNode={selectedNode}
          activePage={activePage}
          pages={pages}
          onUpdateComponent={updateComponent}
          onDeleteComponent={deleteComponent}
          onDuplicateComponent={duplicateComponent}
          onDeselect={() => setSelectedNodeId(null)}
          onUpdatePage={(id, updates) => updatePage(id, updates)}
          onDeletePage={deletePage}
          onDuplicatePage={duplicatePage}
        />
      </div>
    </div>
  );
}
