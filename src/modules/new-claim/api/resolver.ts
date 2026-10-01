import {
  USE_MOCK,
  mockGetNewClaims,
  mockGetNewClaimById,
  mockCreateNewClaim,
  mockUpdateNewClaim,
  mockDeleteNewClaim,
  mockRestoreNewClaim,
  mockExportNewClaims,
  mockBulkUploadNewClaims,
  mockDownloadNewClaimTemplate,
} from './mock';
import * as service from './service';

export const getNewClaims = USE_MOCK.list ? mockGetNewClaims : service.getNewClaims;
export const getNewClaimById = USE_MOCK.detail ? mockGetNewClaimById : service.getNewClaimById;
export const createNewClaim = USE_MOCK.create ? mockCreateNewClaim : service.createNewClaim;
export const updateNewClaim = USE_MOCK.update ? mockUpdateNewClaim : service.updateNewClaim;
export const deleteNewClaim = USE_MOCK.delete ? mockDeleteNewClaim : service.deleteNewClaim;
export const restoreNewClaim = USE_MOCK.restore ? mockRestoreNewClaim : service.restoreNewClaim;
export const exportNewClaims = USE_MOCK.export ? mockExportNewClaims : service.exportNewClaims;
export const bulkUploadNewClaims = USE_MOCK.bulkUpload ? mockBulkUploadNewClaims : service.bulkUploadNewClaims;
export const downloadNewClaimTemplate = USE_MOCK.bulkTemplate ? mockDownloadNewClaimTemplate : service.downloadNewClaimTemplate;
