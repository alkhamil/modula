export interface Vendor {
  id: string;
  region: string;
  name: string;
  status: 'active' | 'inactive';
  createdBy: string;
  createdDate: string;
}

export interface VendorListItem {
  id: number;
  region: string;
  name: string;
  created_date: string;
  created_by: string | null;
  status: 'active' | 'inactive';
}

export interface CreateVendorPayload {
  region: string;
  name: string;
}

export interface GetVendorsParams {
  search?: string;
  status?: string;
  region?: string;
  name?: string;
  order?: string;
  sort?: 'asc' | 'desc';
  page?: number;
  size?: number;
}

export interface RegionOption {
  label: string;
  value: string;
}

export interface VendorMutationResult<T = Vendor> {
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
