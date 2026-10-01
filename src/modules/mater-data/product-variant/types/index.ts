export interface ProductVariant {
  id: string;
  name: string;
  description: string;
  status: 'active' | 'inactive';
  createdBy: string;
  createdDate: string;
}

export interface ProductVariantListItem {
  id: number;
  name: string;
  description: string;
  created_date: string;
  created_by: string | null;
  status: 'active' | 'inactive';
}

export interface CreateProductVariantPayload {
  name: string;
  description: string;
}

export interface GetProductVariantsParams {
  search?: string;
  status?: string;
  order?: string;
  sort?: 'asc' | 'desc';
  page?: number;
  size?: number;
}

export interface ProductVariantMutationResult<T = ProductVariant> {
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
