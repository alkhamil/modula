/** Permission keys modul Vendor — base `vendor`, suffix otomatis. */
export const VendorPermissions = {
  view: 'vendor.view',
  create: 'vendor.create',
  update: 'vendor.update',
  delete: 'vendor.delete',
  bulkUpload: 'vendor.bulk_upload',
  export: 'vendor.export',
} as const;

export type VendorPermission =
  (typeof VendorPermissions)[keyof typeof VendorPermissions];
