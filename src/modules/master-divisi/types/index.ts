export interface MasterDivisi {
  id: string;
  divisionName: string;
  idAjalah: number;
  status: 'active' | 'inactive';
  createdBy: string;
  createdDate: string;
}

export interface MasterDivisiListItem {
  id: number;
  divisionName: string;
  idAjalah: number;
  created_date: string;
  created_by: string | null;
  status: 'active' | 'inactive';
}

export interface CreateMasterDivisiPayload {
  divisionName: string;
  idAjalah: number;
}

export interface GetMasterDivisisParams {
  search?: string;
  status?: string;
  divisionName?: string;
  idAjalah?: string;
  order?: string;
  sort?: 'asc' | 'desc';
  page?: number;
  size?: number;
}

export interface MasterDivisiMutationResult<T = MasterDivisi> {
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
