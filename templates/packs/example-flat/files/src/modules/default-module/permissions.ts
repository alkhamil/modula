/** Permission keys modul DefaultModule — base `default_module`, suffix otomatis. */
export const DefaultModulePermissions = {
  view: 'default_module.view',
  create: 'default_module.create',
  update: 'default_module.update',
  delete: 'default_module.delete',
  bulkUpload: 'default_module.bulk_upload',
  export: 'default_module.export',
} as const;

export type DefaultModulePermission =
  (typeof DefaultModulePermissions)[keyof typeof DefaultModulePermissions];
