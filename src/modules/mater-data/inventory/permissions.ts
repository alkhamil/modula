/** Permission keys modul Inventory — base `inventory`, suffix otomatis. */
export const InventoryPermissions = {
  view: 'inventory.view',
  create: 'inventory.create',
  update: 'inventory.update',
  delete: 'inventory.delete',
  bulkUpload: 'inventory.bulk_upload',
  export: 'inventory.export',
} as const;

export type InventoryPermission =
  (typeof InventoryPermissions)[keyof typeof InventoryPermissions];
