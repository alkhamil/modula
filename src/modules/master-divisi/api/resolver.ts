import {
  USE_MOCK,
  mockGetMasterDivisis,
  mockGetMasterDivisiById,
  mockCreateMasterDivisi,
  mockUpdateMasterDivisi,
  mockDeleteMasterDivisi,
  mockRestoreMasterDivisi,
  mockExportMasterDivisis,
  mockBulkUploadMasterDivisis,
  mockDownloadMasterDivisiTemplate,
} from './mock';
import * as service from './service';

export const getMasterDivisis = USE_MOCK.list ? mockGetMasterDivisis : service.getMasterDivisis;
export const getMasterDivisiById = USE_MOCK.detail ? mockGetMasterDivisiById : service.getMasterDivisiById;
export const createMasterDivisi = USE_MOCK.create ? mockCreateMasterDivisi : service.createMasterDivisi;
export const updateMasterDivisi = USE_MOCK.update ? mockUpdateMasterDivisi : service.updateMasterDivisi;
export const deleteMasterDivisi = USE_MOCK.delete ? mockDeleteMasterDivisi : service.deleteMasterDivisi;
export const restoreMasterDivisi = USE_MOCK.restore ? mockRestoreMasterDivisi : service.restoreMasterDivisi;
export const exportMasterDivisis = USE_MOCK.export ? mockExportMasterDivisis : service.exportMasterDivisis;
export const bulkUploadMasterDivisis = USE_MOCK.bulkUpload ? mockBulkUploadMasterDivisis : service.bulkUploadMasterDivisis;
export const downloadMasterDivisiTemplate = USE_MOCK.bulkTemplate ? mockDownloadMasterDivisiTemplate : service.downloadMasterDivisiTemplate;
