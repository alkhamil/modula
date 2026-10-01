/** Permission keys modul Category — base `category`, suffix otomatis. */
export const CategoryPermissions = {
  view: 'category.view',
  create: 'category.create',
  update: 'category.update',
  delete: 'category.delete',
  bulkUpload: 'category.bulk_upload',
  export: 'category.export',
} as const;

export type CategoryPermission =
  (typeof CategoryPermissions)[keyof typeof CategoryPermissions];
