import { useState, useEffect, useCallback, useMemo } from 'react';
import type {
  CanvasComponentNode,
  ProjectPageDefinition,
  ViewportMode,
} from './types';
import { getCatalogItem } from './componentRegistry';
import { createDefaultPagesForProject } from './defaultPages';

export interface BuilderState {
  pages: ProjectPageDefinition[];
  activePageId: string;
  selectedNodeId: string | null;
  viewport: ViewportMode;
  mode: 'edit' | 'preview';
  canUndo: boolean;
  canRedo: boolean;
  lastSavedAt: string | null;
}

export function useProjectBuilder(projectSlug: string, projectName: string) {
  const storageKey = `modula_pages_${projectSlug}`;

  // Initialize pages from storage or defaults
  const [pages, setPages] = useState<ProjectPageDefinition[]>(() => {
    try {
      const stored = localStorage.getItem(storageKey);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed;
        }
      }
    } catch {
      // fallback
    }
    return createDefaultPagesForProject(projectSlug, projectName);
  });

  const [activePageId, setActivePageId] = useState<string>(() => {
    return pages[0]?.id || `page-${projectSlug}-list`;
  });

  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null);
  const [viewport, setViewport] = useState<ViewportMode>('desktop');
  const [mode, setMode] = useState<'edit' | 'preview'>('edit');
  const [lastSavedAt, setLastSavedAt] = useState<string | null>(null);

  // Undo/Redo history stacks
  const [history, setHistory] = useState<ProjectPageDefinition[][]>([]);
  const [future, setFuture] = useState<ProjectPageDefinition[][]>([]);

  // Sync to localStorage on page changes
  useEffect(() => {
    try {
      localStorage.setItem(storageKey, JSON.stringify(pages));
      setLastSavedAt(new Date().toLocaleTimeString());
    } catch (err) {
      console.error('Failed to save builder pages:', err);
    }
  }, [pages, storageKey]);

  // Ensure active page is valid
  useEffect(() => {
    if (!pages.some((p) => p.id === activePageId) && pages.length > 0) {
      setActivePageId(pages[0].id);
    }
  }, [pages, activePageId]);

  // Helper to commit state with history tracking
  const pushState = useCallback((newPages: ProjectPageDefinition[]) => {
    setHistory((prev) => [...prev.slice(-20), pages]);
    setFuture([]);
    setPages(newPages);
  }, [pages]);

  const undo = useCallback(() => {
    if (history.length === 0) return;
    const previous = history[history.length - 1];
    setHistory((prev) => prev.slice(0, prev.length - 1));
    setFuture((prev) => [pages, ...prev]);
    setPages(previous);
  }, [history, pages]);

  const redo = useCallback(() => {
    if (future.length === 0) return;
    const next = future[0];
    setFuture((prev) => prev.slice(1));
    setHistory((prev) => [...prev, pages]);
    setPages(next);
  }, [future, pages]);

  // Active page object
  const activePage = useMemo(() => {
    return pages.find((p) => p.id === activePageId) || pages[0];
  }, [pages, activePageId]);

  // Recursive search for a node by ID
  const findNode = useCallback((nodes: CanvasComponentNode[], id: string): CanvasComponentNode | null => {
    for (const node of nodes) {
      if (node.id === id) return node;
      if (node.children && node.children.length > 0) {
        const found = findNode(node.children, id);
        if (found) return found;
      }
    }
    return null;
  }, []);

  const selectedNode = useMemo(() => {
    if (!selectedNodeId || !activePage) return null;
    return findNode(activePage.components, selectedNodeId);
  }, [selectedNodeId, activePage, findNode]);

  // Page Operations
  const addPage = useCallback((newPage: Partial<ProjectPageDefinition>) => {
    const timestamp = new Date().toISOString();
    const id = `page-${projectSlug}-${Date.now().toString(36)}`;
    const created: ProjectPageDefinition = {
      id,
      key: newPage.key || `halaman-${Date.now().toString(36)}`,
      title: newPage.title || 'Halaman Baru',
      type: newPage.type || 'CUSTOM',
      path: newPage.path || `/${projectSlug}/${Date.now().toString(36)}`,
      components: newPage.components || [],
      createdAt: timestamp,
      updatedAt: timestamp,
    };
    pushState([...pages, created]);
    setActivePageId(id);
    setSelectedNodeId(null);
  }, [pages, projectSlug, pushState]);

  const updatePage = useCallback((id: string, updates: Partial<ProjectPageDefinition>) => {
    const updated = pages.map((p) => {
      if (p.id !== id) return p;
      return {
        ...p,
        ...updates,
        updatedAt: new Date().toISOString(),
      };
    });
    pushState(updated);
  }, [pages, pushState]);

  const deletePage = useCallback((id: string) => {
    if (pages.length <= 1) return; // Keep at least one page
    const filtered = pages.filter((p) => p.id !== id);
    pushState(filtered);
    if (activePageId === id) {
      setActivePageId(filtered[0]?.id || '');
      setSelectedNodeId(null);
    }
  }, [pages, activePageId, pushState]);

  const duplicatePage = useCallback((id: string) => {
    const target = pages.find((p) => p.id === id);
    if (!target) return;
    const newId = `page-${projectSlug}-${Date.now().toString(36)}`;
    const clonedComponents = JSON.parse(JSON.stringify(target.components));

    // assign new IDs to cloned components
    const reassignIds = (nodes: CanvasComponentNode[]) => {
      for (const n of nodes) {
        n.id = `comp-${Date.now().toString(36)}-${Math.random().toString(36).substring(2, 6)}`;
        if (n.children) reassignIds(n.children);
      }
    };
    reassignIds(clonedComponents);

    const duplicated: ProjectPageDefinition = {
      ...target,
      id: newId,
      key: `${target.key}-copy`,
      title: `${target.title} (Salinan)`,
      path: `${target.path}-copy`,
      components: clonedComponents,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    pushState([...pages, duplicated]);
    setActivePageId(newId);
  }, [pages, projectSlug, pushState]);

  // Component Node Operations (Nested & Flat)
  const addComponent = useCallback((componentType: string, parentId?: string) => {
    const catalogItem = getCatalogItem(componentType);
    if (!catalogItem || !activePage) return;

    const newNodeId = `comp-${Date.now().toString(36)}-${Math.random().toString(36).substring(2, 6)}`;
    const newNode: CanvasComponentNode = {
      id: newNodeId,
      type: catalogItem.type,
      category: catalogItem.category,
      name: catalogItem.name,
      props: JSON.parse(JSON.stringify(catalogItem.defaultProps)),
      validation: catalogItem.defaultValidation ? JSON.parse(JSON.stringify(catalogItem.defaultValidation)) : undefined,
      actions: catalogItem.defaultActions ? JSON.parse(JSON.stringify(catalogItem.defaultActions)) : undefined,
      children: catalogItem.childrenAllowed ? [] : undefined,
    };

    let updatedComponents: CanvasComponentNode[];

    if (!parentId) {
      // Append to top level
      updatedComponents = [...activePage.components, newNode];
    } else {
      // Recursively insert into parent children
      const insertRecursive = (nodes: CanvasComponentNode[]): CanvasComponentNode[] => {
        return nodes.map((node) => {
          if (node.id === parentId) {
            return {
              ...node,
              children: [...(node.children || []), newNode],
            };
          }
          if (node.children) {
            return {
              ...node,
              children: insertRecursive(node.children),
            };
          }
          return node;
        });
      };
      updatedComponents = insertRecursive(activePage.components);
    }

    const updatedPages = pages.map((p) => {
      if (p.id !== activePage.id) return p;
      return {
        ...p,
        components: updatedComponents,
        updatedAt: new Date().toISOString(),
      };
    });

    pushState(updatedPages);
    setSelectedNodeId(newNodeId);
  }, [activePage, pages, pushState]);

  const updateComponent = useCallback((nodeId: string, updates: Partial<CanvasComponentNode>) => {
    if (!activePage) return;

    const updateRecursive = (nodes: CanvasComponentNode[]): CanvasComponentNode[] => {
      return nodes.map((node) => {
        if (node.id === nodeId) {
          return {
            ...node,
            ...updates,
            props: {
              ...node.props,
              ...updates.props,
            },
            validation: updates.validation ? { ...node.validation, ...updates.validation } : node.validation,
            actions: updates.actions ? { ...node.actions, ...updates.actions } : node.actions,
          };
        }
        if (node.children) {
          return {
            ...node,
            children: updateRecursive(node.children),
          };
        }
        return node;
      });
    };

    const updatedComponents = updateRecursive(activePage.components);
    const updatedPages = pages.map((p) => {
      if (p.id !== activePage.id) return p;
      return {
        ...p,
        components: updatedComponents,
        updatedAt: new Date().toISOString(),
      };
    });

    pushState(updatedPages);
  }, [activePage, pages, pushState]);

  const deleteComponent = useCallback((nodeId: string) => {
    if (!activePage) return;

    const deleteRecursive = (nodes: CanvasComponentNode[]): CanvasComponentNode[] => {
      return nodes
        .filter((n) => n.id !== nodeId)
        .map((n) => {
          if (n.children) {
            return { ...n, children: deleteRecursive(n.children) };
          }
          return n;
        });
    };

    const updatedComponents = deleteRecursive(activePage.components);
    const updatedPages = pages.map((p) => {
      if (p.id !== activePage.id) return p;
      return {
        ...p,
        components: updatedComponents,
        updatedAt: new Date().toISOString(),
      };
    });

    pushState(updatedPages);
    if (selectedNodeId === nodeId) {
      setSelectedNodeId(null);
    }
  }, [activePage, pages, selectedNodeId, pushState]);

  const moveComponent = useCallback((nodeId: string, direction: 'up' | 'down') => {
    if (!activePage) return;

    const moveInArray = (list: CanvasComponentNode[]): CanvasComponentNode[] => {
      const idx = list.findIndex((n) => n.id === nodeId);
      if (idx !== -1) {
        const targetIdx = direction === 'up' ? idx - 1 : idx + 1;
        if (targetIdx < 0 || targetIdx >= list.length) return list;
        const copy = [...list];
        const [moved] = copy.splice(idx, 1);
        copy.splice(targetIdx, 0, moved);
        return copy;
      }
      return list.map((item) => {
        if (item.children) {
          return { ...item, children: moveInArray(item.children) };
        }
        return item;
      });
    };

    const updatedComponents = moveInArray(activePage.components);
    const updatedPages = pages.map((p) => {
      if (p.id !== activePage.id) return p;
      return {
        ...p,
        components: updatedComponents,
        updatedAt: new Date().toISOString(),
      };
    });

    pushState(updatedPages);
  }, [activePage, pages, pushState]);

  const duplicateComponent = useCallback((nodeId: string) => {
    if (!activePage) return;

    const duplicateInArray = (list: CanvasComponentNode[]): CanvasComponentNode[] => {
      const idx = list.findIndex((n) => n.id === nodeId);
      if (idx !== -1) {
        const original = list[idx];
        const cloned: CanvasComponentNode = JSON.parse(JSON.stringify(original));
        const reassign = (n: CanvasComponentNode) => {
          n.id = `comp-${Date.now().toString(36)}-${Math.random().toString(36).substring(2, 6)}`;
          n.name = `${n.name} (Salinan)`;
          if (n.children) n.children.forEach(reassign);
        };
        reassign(cloned);
        const copy = [...list];
        copy.splice(idx + 1, 0, cloned);
        return copy;
      }
      return list.map((item) => {
        if (item.children) {
          return { ...item, children: duplicateInArray(item.children) };
        }
        return item;
      });
    };

    const updatedComponents = duplicateInArray(activePage.components);
    const updatedPages = pages.map((p) => {
      if (p.id !== activePage.id) return p;
      return {
        ...p,
        components: updatedComponents,
        updatedAt: new Date().toISOString(),
      };
    });

    pushState(updatedPages);
  }, [activePage, pages, pushState]);

  return {
    pages,
    activePage,
    activePageId,
    setActivePageId,
    selectedNodeId,
    selectedNode,
    setSelectedNodeId,
    viewport,
    setViewport,
    mode,
    setMode,
    lastSavedAt,
    canUndo: history.length > 0,
    canRedo: future.length > 0,
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
  };
}
