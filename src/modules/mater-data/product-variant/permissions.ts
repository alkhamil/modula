/** Permission keys modul ProductVariant — base `product_variant`, suffix otomatis. */
export const ProductVariantPermissions = {
  view: 'product_variant.view',
  create: 'product_variant.create',
  update: 'product_variant.update',
  delete: 'product_variant.delete',
  bulkUpload: 'product_variant.bulk_upload',
  export: 'product_variant.export',
} as const;

export type ProductVariantPermission =
  (typeof ProductVariantPermissions)[keyof typeof ProductVariantPermissions];
