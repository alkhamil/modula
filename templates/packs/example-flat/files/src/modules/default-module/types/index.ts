export interface DefaultModule {
  id: string;
  name: string;
  code: string;
  sortOrder: number;
  description: string;
  status: 'active' | 'inactive';
  createdBy: string;
  createdDate: string;
}

export interface DefaultModuleListItem {
  id: number;
  name: string;
  code: string;
  sortOrder: number;
  description: string;
  created_date: string;
  created_by: string | null;
  status: 'active' | 'inactive';
}

export interface CreateDefaultModulePayload {
  name: string;
  code: string;
  sortOrder: number;
  description: string;
}

export interface GetDefaultModulesParams {
  search?: string;
  status?: string;
  name?: string;
  code?: string;
  sortOrder?: string;
  order?: string;
  sort?: 'asc' | 'desc';
  page?: number;
  size?: number;
}

export interface DefaultModuleMutationResult<T = DefaultModule> {
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
