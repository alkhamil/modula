export interface Product {
  id: string;
  category: string;
  status: 'active' | 'inactive';
  createdBy: string;
  createdDate: string;
}

export interface ProductListItem {
  id: number;
  category: string;
  created_date: string;
  created_by: string | null;
  status: 'active' | 'inactive';
}

export interface CreateProductPayload {
  category: string;
}

export interface GetProductsParams {
  search?: string;
  status?: string;
  category?: string;
  order?: string;
  sort?: 'asc' | 'desc';
  page?: number;
  size?: number;
}

export interface CategoryOption {
  label: string;
  value: string;
}

export interface ProductMutationResult<T = Product> {
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
