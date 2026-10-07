/** Permission keys modul Price — base `price`, suffix otomatis. */
export const PricePermissions = {
  view: 'price.view',
  create: 'price.create',
  update: 'price.update',
  delete: 'price.delete',
  bulkUpload: 'price.bulk_upload',
  export: 'price.export',
} as const;

export type PricePermission =
  (typeof PricePermissions)[keyof typeof PricePermissions];
