export interface Inventory {
  id: string;
  inventoryName: string;
  status: 'active' | 'inactive';
  createdBy: string;
  createdDate: string;
}

export interface InventoryListItem {
  id: number;
  inventoryName: string;
  created_date: string;
  created_by: string | null;
  status: 'active' | 'inactive';
}

export interface CreateInventoryPayload {
  inventoryName: string;
}

export interface GetInventoriesParams {
  search?: string;
  status?: string;
  order?: string;
  sort?: 'asc' | 'desc';
  page?: number;
  size?: number;
}

export interface InventoryMutationResult<T = Inventory> {
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
