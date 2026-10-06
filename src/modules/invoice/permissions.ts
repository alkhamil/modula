/** Permission keys modul Invoice — base `invoice`, suffix otomatis. */
export const InvoicePermissions = {
  view: 'invoice.view',
  create: 'invoice.create',
  update: 'invoice.update',
  delete: 'invoice.delete',
  bulkUpload: 'invoice.bulk_upload',
  export: 'invoice.export',
} as const;

export type InvoicePermission =
  (typeof InvoicePermissions)[keyof typeof InvoicePermissions];
