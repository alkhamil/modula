export interface Category {
  id: string;
  name: string;
  region: string;
  status: 'active' | 'inactive';
  createdBy: string;
  createdDate: string;
}

export interface CategoryListItem {
  id: number;
  name: string;
  region: string;
  created_date: string;
  created_by: string | null;
  status: 'active' | 'inactive';
}

export interface CreateCategoryPayload {
  name: string;
  region: string;
}

export interface GetCategoriesParams {
  search?: string;
  status?: string;
  region?: string;
  order?: string;
  sort?: 'asc' | 'desc';
  page?: number;
  size?: number;
}

export interface RegionOption {
  label: string;
  value: string;
}

export interface CategoryMutationResult<T = Category> {
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
