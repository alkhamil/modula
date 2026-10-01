export interface NewClaim {
  id: string;
  policyNumber: string;
  policyDate: string;
  status: 'active' | 'inactive';
  createdBy: string;
  createdDate: string;
}

export interface NewClaimListItem {
  id: number;
  policyNumber: string;
  policyDate: string;
  created_date: string;
  created_by: string | null;
  status: 'active' | 'inactive';
}

export interface CreateNewClaimPayload {
  policyNumber: string;
  policyDate: string;
}

export interface GetNewClaimsParams {
  search?: string;
  status?: string;
  policyDate?: string;
  order?: string;
  sort?: 'asc' | 'desc';
  page?: number;
  size?: number;
}

export interface NewClaimMutationResult<T = NewClaim> {
  message: string;
  data: T;
}

export interface BulkRowError {
  /** Nomor baris Excel 1-based (termasuk header). */
  row: number;
  /** Label kolom (header); kosong bila error sebaris file. */
  field?: string;
  message: string;
}

export interface BulkUploadResult {
  totalRows: number;
  successCount: number;
  failedCount: number;
  errors: BulkRowError[];
}
