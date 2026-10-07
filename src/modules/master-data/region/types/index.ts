export interface Region {
  id: string;
  regionName: string;
  description: string;
  status: 'active' | 'inactive';
  createdBy: string;
  createdDate: string;
}

export interface RegionListItem {
  id: number;
  regionName: string;
  description: string;
  created_date: string;
  created_by: string | null;
  status: 'active' | 'inactive';
}

export interface CreateRegionPayload {
  regionName: string;
  description: string;
}

export interface GetRegionsParams {
  search?: string;
  status?: string;
  regionName?: string;
  order?: string;
  sort?: 'asc' | 'desc';
  page?: number;
  size?: number;
}

export interface RegionMutationResult<T = Region> {
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
