export interface Price {
  id: string;
  product: string;
  price: number;
  status: 'active' | 'inactive';
  createdBy: string;
  createdDate: string;
}

export interface PriceListItem {
  id: number;
  product: string;
  price: number;
  created_date: string;
  created_by: string | null;
  status: 'active' | 'inactive';
}

export interface CreatePricePayload {
  product: string;
  price: number;
}

export interface GetPricesParams {
  search?: string;
  status?: string;
  product?: string;
  price?: string;
  order?: string;
  sort?: 'asc' | 'desc';
  page?: number;
  size?: number;
}

export interface ProductOption {
  label: string;
  value: string;
}

export interface PriceMutationResult<T = Price> {
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
