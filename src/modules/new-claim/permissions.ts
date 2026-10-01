/** Permission keys modul NewClaim — base `new_claim`, suffix otomatis. */
export const NewClaimPermissions = {
  view: 'new_claim.view',
  create: 'new_claim.create',
  update: 'new_claim.update',
  delete: 'new_claim.delete',
  bulkUpload: 'new_claim.bulk_upload',
  export: 'new_claim.export',
} as const;

export type NewClaimPermission =
  (typeof NewClaimPermissions)[keyof typeof NewClaimPermissions];
