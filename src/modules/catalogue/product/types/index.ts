export interface Product {
  id: string;
  name: string;
  price: number;
  category: string;
  status: 'active' | 'inactive';
  createdBy: string;
  createdDate: string;
}

export interface ProductListItem {
  id: number;
  name: string;
  price: number;
  category: string;
  created_date: string;
  created_by: string | null;
  status: 'active' | 'inactive';
}

export interface CategoryOption {
  label: string;
  value: string;
}

export interface CreateProductPayload {
  name: string;
  price: number;
  category: string;
}

export interface GetProductsParams {
  search?: string;
  status?: string;
  name?: string;
  category?: string;
  order?: string;
  sort?: 'asc' | 'desc';
  page?: number;
  size?: number;
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
