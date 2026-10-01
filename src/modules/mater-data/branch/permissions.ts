/** Permission keys modul Branch — base `branch`, suffix otomatis. */
export const BranchPermissions = {
  view: 'branch.view',
  create: 'branch.create',
  update: 'branch.update',
  delete: 'branch.delete',
  bulkUpload: 'branch.bulk_upload',
  export: 'branch.export',
} as const;

export type BranchPermission =
  (typeof BranchPermissions)[keyof typeof BranchPermissions];
