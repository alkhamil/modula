import {
  USE_MOCK,
  mockGetBranches,
  mockGetBranchById,
  mockCreateBranch,
  mockUpdateBranch,
  mockDeleteBranch,
  mockRestoreBranch,
} from './mock';
import * as service from './service';

export const getBranches = USE_MOCK.list ? mockGetBranches : service.getBranches;
export const getBranchById = USE_MOCK.detail ? mockGetBranchById : service.getBranchById;
export const createBranch = USE_MOCK.create ? mockCreateBranch : service.createBranch;
export const updateBranch = USE_MOCK.update ? mockUpdateBranch : service.updateBranch;
export const deleteBranch = USE_MOCK.delete ? mockDeleteBranch : service.deleteBranch;
export const restoreBranch = USE_MOCK.restore ? mockRestoreBranch : service.restoreBranch;
