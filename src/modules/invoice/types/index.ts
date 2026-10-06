export interface Invoice {
  id: string;
  invoiceNumber: string;
  dateOfIssue: string;
  dueDate: string;
  seller: string;
  buyer: string;
  detailProduct: DetailProductRow[];
  status: 'active' | 'inactive';
  createdBy: string;
  createdDate: string;
}

export interface InvoiceListItem {
  id: number;
  invoiceNumber: string;
  dateOfIssue: string;
  dueDate: string;
  seller: string;
  buyer: string;
  detailProduct: DetailProductRow[];
  created_date: string;
  created_by: string | null;
  status: 'active' | 'inactive';
}

export interface CreateInvoicePayload {
  invoiceNumber: string;
  dateOfIssue: string;
  dueDate: string;
  seller: string;
  buyer: string;
  detailProduct: DetailProductRow[];
}

export interface GetInvoicesParams {
  search?: string;
  status?: string;
  dateOfIssue?: string;
  dueDate?: string;
  seller?: string;
  buyer?: string;
  order?: string;
  sort?: 'asc' | 'desc';
  page?: number;
  size?: number;
}

export interface SellerOption {
  label: string;
  value: string;
}

export interface BuyerOption {
  label: string;
  value: string;
}

export interface DetailProductProductOption {
  label: string;
  value: string;
}
export interface DetailProductRow extends Record<string, unknown> {
  product: string;
  quantity: number;
}

export interface DetailProductRowForm extends Record<string, unknown> {
  product: string;
  quantity: string;
}

export interface InvoiceMutationResult<T = Invoice> {
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
