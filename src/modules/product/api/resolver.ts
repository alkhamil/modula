import {
  USE_MOCK,
  mockGetProducts,
  mockGetProductById,
  mockCreateProduct,
  mockUpdateProduct,
  mockDeleteProduct,
  mockRestoreProduct,
  mockExportProducts,
  mockBulkUploadProducts,
  mockDownloadProductTemplate,
  loadCategoryOptions as mockLoadCategoryOptions,
} from './mock';
import * as service from './service';

export const getProducts = USE_MOCK.list ? mockGetProducts : service.getProducts;
export const getProductById = USE_MOCK.detail ? mockGetProductById : service.getProductById;
export const createProduct = USE_MOCK.create ? mockCreateProduct : service.createProduct;
export const updateProduct = USE_MOCK.update ? mockUpdateProduct : service.updateProduct;
export const deleteProduct = USE_MOCK.delete ? mockDeleteProduct : service.deleteProduct;
export const restoreProduct = USE_MOCK.restore ? mockRestoreProduct : service.restoreProduct;
export const exportProducts = USE_MOCK.export ? mockExportProducts : service.exportProducts;
export const bulkUploadProducts = USE_MOCK.bulkUpload ? mockBulkUploadProducts : service.bulkUploadProducts;
export const downloadProductTemplate = USE_MOCK.bulkTemplate ? mockDownloadProductTemplate : service.downloadProductTemplate;
export const loadCategoryOptions = USE_MOCK.categoryLoadOptions ? mockLoadCategoryOptions : service.loadCategoryOptions;
