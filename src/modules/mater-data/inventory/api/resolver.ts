import {
  USE_MOCK,
  mockGetInventories,
  mockGetInventoryById,
  mockCreateInventory,
  mockUpdateInventory,
  mockDeleteInventory,
  mockRestoreInventory,
  mockExportInventories,
  mockBulkUploadInventories,
  mockDownloadInventoryTemplate,
} from './mock';
import * as service from './service';

export const getInventories = USE_MOCK.list ? mockGetInventories : service.getInventories;
export const getInventoryById = USE_MOCK.detail ? mockGetInventoryById : service.getInventoryById;
export const createInventory = USE_MOCK.create ? mockCreateInventory : service.createInventory;
export const updateInventory = USE_MOCK.update ? mockUpdateInventory : service.updateInventory;
export const deleteInventory = USE_MOCK.delete ? mockDeleteInventory : service.deleteInventory;
export const restoreInventory = USE_MOCK.restore ? mockRestoreInventory : service.restoreInventory;
export const exportInventories = USE_MOCK.export ? mockExportInventories : service.exportInventories;
export const bulkUploadInventories = USE_MOCK.bulkUpload ? mockBulkUploadInventories : service.bulkUploadInventories;
export const downloadInventoryTemplate = USE_MOCK.bulkTemplate ? mockDownloadInventoryTemplate : service.downloadInventoryTemplate;
