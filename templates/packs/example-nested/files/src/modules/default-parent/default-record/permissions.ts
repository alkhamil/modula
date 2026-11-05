/** Permission keys modul DefaultRecord — base `default_record`, suffix otomatis. */
export const DefaultRecordPermissions = {
  view: 'default_record.view',
  create: 'default_record.create',
  update: 'default_record.update',
  delete: 'default_record.delete',
  bulkUpload: 'default_record.bulk_upload',
  export: 'default_record.export',
} as const;

export type DefaultRecordPermission =
  (typeof DefaultRecordPermissions)[keyof typeof DefaultRecordPermissions];
