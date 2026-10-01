export interface Branch {
  id: string;
  branchName: string;
  branchCode: string;
  status: 'active' | 'inactive';
  createdBy: string;
  createdDate: string;
}

export interface BranchListItem {
  id: number;
  branchName: string;
  branchCode: string;
  created_date: string;
  created_by: string | null;
  status: 'active' | 'inactive';
}

export interface CreateBranchPayload {
  branchName: string;
  branchCode: string;
}

export interface GetBranchesParams {
  search?: string;
  status?: string;
  order?: string;
  sort?: 'asc' | 'desc';
  page?: number;
  size?: number;
}

export interface BranchMutationResult<T = Branch> {
  message: string;
  data: T;
}
