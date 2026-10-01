/** Route dinamis dari definisi published + halaman preview satu definisi. */
import { useMemo } from 'react';
import { useParams, useRoutes, type RouteObject } from 'react-router';
import { ErrorStatePage, LoadingOverlay } from '../../../shared/components/ui';
import type { ModuleDefinition } from '../definitions';
import { definitionPermissions } from './types';
import { useDynamicDefinition, useDynamicDefinitions } from './hooks';
import DynamicListPage from './DynamicListPage';
import { DynamicCreatePage, DynamicDetailPage, DynamicEditPage } from './DynamicFormPages';

function routesForDefinition(def: ModuleDefinition): RouteObject[] {
  const permissions = definitionPermissions(def.permissionKey);
  const routes: RouteObject[] = [];
  if (def.features.list) {
    routes.push({
      path: def.routeBase,
      element: <DynamicListPage def={def} />,
      handle: {
        breadcrumb: [{ label: def.label }],
        requiredPermission: permissions.view,
      },
    });
  }
  if (def.features.create) {
    routes.push({
      path: `${def.routeBase}/create`,
      element: <DynamicCreatePage def={def} />,
      handle: {
        breadcrumb: [{ label: def.label, to: `/${def.routeBase}` }, { label: 'Create' }],
        requiredPermission: permissions.create,
      },
    });
  }
  if (def.features.detail) {
    routes.push({
      path: `${def.routeBase}/:recordId/view`,
      element: <DynamicDetailPage def={def} />,
      handle: {
        breadcrumb: [{ label: def.label, to: `/${def.routeBase}` }, { label: 'Detail' }],
        requiredPermission: permissions.view,
      },
    });
  }
  if (def.features.edit) {
    routes.push({
      path: `${def.routeBase}/:recordId/edit`,
      element: <DynamicEditPage def={def} />,
      handle: {
        breadcrumb: [{ label: def.label, to: `/${def.routeBase}` }, { label: 'Edit' }],
        requiredPermission: permissions.update,
      },
    });
  }
  return routes;
}

function DynamicModuleRoutes() {
  const { data, isLoading, isError, refetch } = useDynamicDefinitions('published');
  const routes: RouteObject[] = useMemo(
    () => (data ?? []).flatMap(routesForDefinition),
    [data],
  );
  const element = useRoutes(routes);
  if (isLoading) return <LoadingOverlay testId="dynamic-routes-loading" />;
  if (isError) {
    return (
      <ErrorStatePage
        type="500"
        title="Gagal memuat modul dinamis."
        onRetry={() => refetch()}
      />
    );
  }
  return element;
}

function usePreviewDefinition(): {
  def: ModuleDefinition | undefined;
  isLoading: boolean;
  isError: boolean;
  refetch: () => void;
  key: string;
} {
  const { definitionKey } = useParams();
  const key = definitionKey ? decodeURIComponent(definitionKey) : '';
  const { data, isLoading, isError, refetch } = useDynamicDefinition(key || undefined);
  return { def: data, isLoading, isError, refetch: () => refetch(), key };
}

function PreviewGuard({ children }: { children: (def: ModuleDefinition) => React.ReactNode }) {
  const { def, isLoading, isError, refetch, key } = usePreviewDefinition();
  if (isLoading) return <LoadingOverlay testId="dynamic-preview-loading" />;
  if (isError || !def) {
    return (
      <ErrorStatePage
        type="404"
        title={`Definisi "${key}" tidak ditemukan.`}
        onRetry={() => refetch()}
      />
    );
  }
  return <>{children(def)}</>;
}

/** Preview satu definisi (termasuk draft) — verifikasi runtime tanpa cutover. */
function DynamicPreviewPage() {
  return (
    <PreviewGuard>
      {(def) => (def.features.list ? <DynamicListPage def={def} /> : <ErrorStatePage type="404" />)}
    </PreviewGuard>
  );
}

function DynamicPreviewCreatePage() {
  return (
    <PreviewGuard>
      {(def) => (def.features.create ? <DynamicCreatePage def={def} /> : <ErrorStatePage type="404" />)}
    </PreviewGuard>
  );
}

function DynamicPreviewDetailPage() {
  return (
    <PreviewGuard>
      {(def) => (def.features.detail ? <DynamicDetailPage def={def} /> : <ErrorStatePage type="404" />)}
    </PreviewGuard>
  );
}

function DynamicPreviewEditPage() {
  return (
    <PreviewGuard>
      {(def) => (def.features.edit ? <DynamicEditPage def={def} /> : <ErrorStatePage type="404" />)}
    </PreviewGuard>
  );
}

export {
  DynamicModuleRoutes,
  DynamicPreviewPage,
  DynamicPreviewCreatePage,
  DynamicPreviewDetailPage,
  DynamicPreviewEditPage,
};
