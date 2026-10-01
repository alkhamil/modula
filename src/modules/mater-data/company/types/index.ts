export interface Company {
  id: string;
  companyName: string;
  companyGroup: string;
  companyAddress: string;
  status: 'active' | 'inactive';
  createdBy: string;
  createdDate: string;
}

export interface CompanyListItem {
  id: number;
  companyName: string;
  companyGroup: string;
  companyAddress: string;
  created_date: string;
  created_by: string | null;
  status: 'active' | 'inactive';
}

export interface CreateCompanyPayload {
  companyName: string;
  companyGroup: string;
  companyAddress: string;
}

export interface GetCompaniesParams {
  search?: string;
  status?: string;
  companyGroup?: string;
  order?: string;
  sort?: 'asc' | 'desc';
  page?: number;
  size?: number;
}

export interface CompanyGroupOption {
  label: string;
  value: string;
}

export interface CompanyMutationResult<T = Company> {
  message: string;
  data: T;
}
