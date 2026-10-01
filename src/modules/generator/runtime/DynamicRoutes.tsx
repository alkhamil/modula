/** Route dinamis dari definisi published + halaman preview satu definisi. */
import { useMemo } from 'react';
import { useParams, useRoutes, type RouteObject } from 'react-router';
import { ErrorStatePage, LoadingOverlay } from '../../../shared/components/ui';
import { definitionPermissions } from './types';
import { useDynamicDefinition, useDynamicDefinitions } from './hooks';
import DynamicListPage from './DynamicListPage';

/**
 * RouteBase yang masih dilayani route statis — dilewati runtime agar tidak
 * render ganda selama koeksistensi. FASE 8: hapus konstanta ini saat cutover.
 */
const STATIC_COVERED_BASES = new Set([
  'users',
  'mater-data/companies',
  'mater-data/branches',
  'mater-data/products',
  'orders',
  'new-claims',
  'mater-data/categories',
  'mater-data/inventories',
  'mater-data/product-variants',
  'mater-data/product-colors',
]);

function DynamicModuleRoutes() {
  const { data, isLoading, isError, refetch } = useDynamicDefinitions('published');
  const routes: RouteObject[] = useMemo(
    () =>
      (data ?? [])
        .filter((def) => def.features.list && !STATIC_COVERED_BASES.has(def.routeBase))
        .map((def) => ({
          path: def.routeBase,
          element: <DynamicListPage def={def} />,
          handle: {
            breadcrumb: [{ label: def.label }],
            requiredPermission: definitionPermissions(def.permissionKey).view,
          },
        })),
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

/** Preview satu definisi (termasuk draft) — verifikasi runtime tanpa cutover. */
function DynamicPreviewPage() {
  const { definitionKey } = useParams();
  const key = definitionKey ? decodeURIComponent(definitionKey) : undefined;
  const { data, isLoading, isError, refetch } = useDynamicDefinition(key);
  if (isLoading) return <LoadingOverlay testId="dynamic-preview-loading" />;
  if (isError || !data) {
    return (
      <ErrorStatePage
        type="404"
        title={`Definisi "${key ?? ''}" tidak ditemukan.`}
        onRetry={() => refetch()}
      />
    );
  }
  return <DynamicListPage def={data} />;
}

export { DynamicModuleRoutes, DynamicPreviewPage };
