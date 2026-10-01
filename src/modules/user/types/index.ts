export interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  status: 'active' | 'inactive';
  createdBy: string;
  createdDate: string;
}

export interface UserListItem {
  id: number;
  name: string;
  email: string;
  role: string;
  created_date: string;
  created_by: string | null;
  status: 'active' | 'inactive';
}

export interface CreateUserPayload {
  name: string;
  email: string;
  role: string;
}

export interface GetUsersParams {
  search?: string;
  status?: string;
  name?: string;
  email?: string;
  role?: string;
  order?: string;
  sort?: 'asc' | 'desc';
  page?: number;
  size?: number;
}

export interface RoleOption {
  label: string;
  value: string;
}

export interface UserMutationResult<T = User> {
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
