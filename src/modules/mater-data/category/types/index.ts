export interface Category {
  id: string;
  categoryName: string;
  description: string;
  source: string[];
  status: 'active' | 'inactive';
  createdBy: string;
  createdDate: string;
}

export interface CategoryListItem {
  id: number;
  categoryName: string;
  description: string;
  source: string[];
  created_date: string;
  created_by: string | null;
  status: 'active' | 'inactive';
}

export interface CreateCategoryPayload {
  categoryName: string;
  description: string;
  source: string[];
}

export interface GetCategoriesParams {
  search?: string;
  status?: string;
  source?: string;
  order?: string;
  sort?: 'asc' | 'desc';
  page?: number;
  size?: number;
}

export interface SourceOption {
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
