import {
  USE_MOCK,
  mockGetProductColors,
  mockGetProductColorById,
  mockCreateProductColor,
  mockUpdateProductColor,
  mockDeleteProductColor,
  mockRestoreProductColor,
  mockExportProductColors,
  mockBulkUploadProductColors,
  mockDownloadProductColorTemplate,
} from './mock';
import * as service from './service';

export const getProductColors = USE_MOCK.list ? mockGetProductColors : service.getProductColors;
export const getProductColorById = USE_MOCK.detail ? mockGetProductColorById : service.getProductColorById;
export const createProductColor = USE_MOCK.create ? mockCreateProductColor : service.createProductColor;
export const updateProductColor = USE_MOCK.update ? mockUpdateProductColor : service.updateProductColor;
export const deleteProductColor = USE_MOCK.delete ? mockDeleteProductColor : service.deleteProductColor;
export const restoreProductColor = USE_MOCK.restore ? mockRestoreProductColor : service.restoreProductColor;
export const exportProductColors = USE_MOCK.export ? mockExportProductColors : service.exportProductColors;
export const bulkUploadProductColors = USE_MOCK.bulkUpload ? mockBulkUploadProductColors : service.bulkUploadProductColors;
export const downloadProductColorTemplate = USE_MOCK.bulkTemplate ? mockDownloadProductColorTemplate : service.downloadProductColorTemplate;
