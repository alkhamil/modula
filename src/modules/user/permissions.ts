/** Permission keys modul User — base `user`, suffix otomatis. */
export const UserPermissions = {
  view: 'user.view',
  create: 'user.create',
  update: 'user.update',
  delete: 'user.delete',
  bulkUpload: 'user.bulk_upload',
  export: 'user.export',
} as const;

export type UserPermission = (typeof UserPermissions)[keyof typeof UserPermissions];
