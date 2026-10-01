/** Permission keys modul Company — base `company`, suffix otomatis. */
export const CompanyPermissions = {
  view: 'company.view',
  create: 'company.create',
  update: 'company.update',
  delete: 'company.delete',
  bulkUpload: 'company.bulk_upload',
  export: 'company.export',
} as const;

export type CompanyPermission =
  (typeof CompanyPermissions)[keyof typeof CompanyPermissions];
