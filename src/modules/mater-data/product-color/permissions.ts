/** Permission keys modul ProductColor — base `product_color`, suffix otomatis. */
export const ProductColorPermissions = {
  view: 'product_color.view',
  create: 'product_color.create',
  update: 'product_color.update',
  delete: 'product_color.delete',
  bulkUpload: 'product_color.bulk_upload',
  export: 'product_color.export',
} as const;

export type ProductColorPermission =
  (typeof ProductColorPermissions)[keyof typeof ProductColorPermissions];
