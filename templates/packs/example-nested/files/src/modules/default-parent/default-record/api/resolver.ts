import {
  USE_MOCK,
  mockGetDefaultRecords,
  mockGetDefaultRecordById,
  mockCreateDefaultRecord,
  mockUpdateDefaultRecord,
  mockDeleteDefaultRecord,
  mockRestoreDefaultRecord,
  mockExportDefaultRecords,
  mockBulkUploadDefaultRecords,
  mockDownloadDefaultRecordTemplate,
} from './mock';
import * as service from './service';

export const getDefaultRecords = USE_MOCK.list ? mockGetDefaultRecords : service.getDefaultRecords;
export const getDefaultRecordById = USE_MOCK.detail ? mockGetDefaultRecordById : service.getDefaultRecordById;
export const createDefaultRecord = USE_MOCK.create ? mockCreateDefaultRecord : service.createDefaultRecord;
export const updateDefaultRecord = USE_MOCK.update ? mockUpdateDefaultRecord : service.updateDefaultRecord;
export const deleteDefaultRecord = USE_MOCK.delete ? mockDeleteDefaultRecord : service.deleteDefaultRecord;
export const restoreDefaultRecord = USE_MOCK.restore ? mockRestoreDefaultRecord : service.restoreDefaultRecord;
export const exportDefaultRecords = USE_MOCK.export ? mockExportDefaultRecords : service.exportDefaultRecords;
export const bulkUploadDefaultRecords = USE_MOCK.bulkUpload ? mockBulkUploadDefaultRecords : service.bulkUploadDefaultRecords;
export const downloadDefaultRecordTemplate = USE_MOCK.bulkTemplate ? mockDownloadDefaultRecordTemplate : service.downloadDefaultRecordTemplate;
