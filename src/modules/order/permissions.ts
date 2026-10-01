/** Permission keys modul Order — base `order`, suffix otomatis. */
export const OrderPermissions = {
  view: 'order.view',
  create: 'order.create',
  update: 'order.update',
  delete: 'order.delete',
  bulkUpload: 'order.bulk_upload',
  export: 'order.export',
} as const;

export type OrderPermission =
  (typeof OrderPermissions)[keyof typeof OrderPermissions];
