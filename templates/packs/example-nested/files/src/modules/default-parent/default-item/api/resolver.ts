import {
  USE_MOCK,
  mockGetDefaultItems,
  mockGetDefaultItemById,
  mockCreateDefaultItem,
  mockUpdateDefaultItem,
  mockDeleteDefaultItem,
  mockRestoreDefaultItem,
  mockExportDefaultItems,
  mockBulkUploadDefaultItems,
  mockDownloadDefaultItemTemplate,
} from './mock';
import * as service from './service';

export const getDefaultItems = USE_MOCK.list ? mockGetDefaultItems : service.getDefaultItems;
export const getDefaultItemById = USE_MOCK.detail ? mockGetDefaultItemById : service.getDefaultItemById;
export const createDefaultItem = USE_MOCK.create ? mockCreateDefaultItem : service.createDefaultItem;
export const updateDefaultItem = USE_MOCK.update ? mockUpdateDefaultItem : service.updateDefaultItem;
export const deleteDefaultItem = USE_MOCK.delete ? mockDeleteDefaultItem : service.deleteDefaultItem;
export const restoreDefaultItem = USE_MOCK.restore ? mockRestoreDefaultItem : service.restoreDefaultItem;
export const exportDefaultItems = USE_MOCK.export ? mockExportDefaultItems : service.exportDefaultItems;
export const bulkUploadDefaultItems = USE_MOCK.bulkUpload ? mockBulkUploadDefaultItems : service.bulkUploadDefaultItems;
export const downloadDefaultItemTemplate = USE_MOCK.bulkTemplate ? mockDownloadDefaultItemTemplate : service.downloadDefaultItemTemplate;
