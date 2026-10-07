import {
  USE_MOCK,
  mockGetPrices,
  mockGetPriceById,
  mockCreatePrice,
  mockUpdatePrice,
  mockDeletePrice,
  mockRestorePrice,
  mockExportPrices,
  mockBulkUploadPrices,
  mockDownloadPriceTemplate,
  loadProductOptions as mockLoadProductOptions,
} from './mock';
import * as service from './service';

export const getPrices = USE_MOCK.list ? mockGetPrices : service.getPrices;
export const getPriceById = USE_MOCK.detail ? mockGetPriceById : service.getPriceById;
export const createPrice = USE_MOCK.create ? mockCreatePrice : service.createPrice;
export const updatePrice = USE_MOCK.update ? mockUpdatePrice : service.updatePrice;
export const deletePrice = USE_MOCK.delete ? mockDeletePrice : service.deletePrice;
export const restorePrice = USE_MOCK.restore ? mockRestorePrice : service.restorePrice;
export const exportPrices = USE_MOCK.export ? mockExportPrices : service.exportPrices;
export const bulkUploadPrices = USE_MOCK.bulkUpload ? mockBulkUploadPrices : service.bulkUploadPrices;
export const downloadPriceTemplate = USE_MOCK.bulkTemplate ? mockDownloadPriceTemplate : service.downloadPriceTemplate;
export const loadProductOptions = USE_MOCK.productLoadOptions ? mockLoadProductOptions : service.loadProductOptions;
