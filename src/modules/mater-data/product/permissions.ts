/** Permission keys modul Product — base `product`, suffix otomatis. */
export const ProductPermissions = {
  view: 'product.view',
  create: 'product.create',
  update: 'product.update',
  delete: 'product.delete',
  bulkUpload: 'product.bulk_upload',
  export: 'product.export',
} as const;

export type ProductPermission =
  (typeof ProductPermissions)[keyof typeof ProductPermissions];
