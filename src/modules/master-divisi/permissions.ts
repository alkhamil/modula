/** Permission keys modul MasterDivisi — base `master_division`, suffix otomatis. */
export const MasterDivisiPermissions = {
  view: 'master_division.view',
  create: 'master_division.create',
  update: 'master_division.update',
  delete: 'master_division.delete',
  bulkUpload: 'master_division.bulk_upload',
  export: 'master_division.export',
} as const;

export type MasterDivisiPermission =
  (typeof MasterDivisiPermissions)[keyof typeof MasterDivisiPermissions];
