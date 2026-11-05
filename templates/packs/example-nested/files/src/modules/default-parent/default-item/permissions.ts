/** Permission keys modul DefaultItem — base `default_item`, suffix otomatis. */
export const DefaultItemPermissions = {
  view: 'default_item.view',
  create: 'default_item.create',
  update: 'default_item.update',
  delete: 'default_item.delete',
  bulkUpload: 'default_item.bulk_upload',
  export: 'default_item.export',
} as const;

export type DefaultItemPermission =
  (typeof DefaultItemPermissions)[keyof typeof DefaultItemPermissions];
