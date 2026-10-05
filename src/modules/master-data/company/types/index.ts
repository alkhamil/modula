export interface Company {
  id: string;
  name: string;
  description: string;
  status: 'active' | 'inactive';
  createdBy: string;
  createdDate: string;
}

export interface CompanyListItem {
  id: number;
  name: string;
  description: string;
  created_date: string;
  created_by: string | null;
  status: 'active' | 'inactive';
}

export interface CreateCompanyPayload {
  name: string;
  description: string;
}

export interface GetCompaniesParams {
  search?: string;
  status?: string;
  order?: string;
  sort?: 'asc' | 'desc';
  page?: number;
  size?: number;
}

export interface CompanyMutationResult<T = Company> {
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
