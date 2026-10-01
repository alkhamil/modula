import {
  USE_MOCK,
  mockGetProductVariants,
  mockGetProductVariantById,
  mockCreateProductVariant,
  mockUpdateProductVariant,
  mockDeleteProductVariant,
  mockRestoreProductVariant,
  mockExportProductVariants,
  mockBulkUploadProductVariants,
  mockDownloadProductVariantTemplate,
} from './mock';
import * as service from './service';

export const getProductVariants = USE_MOCK.list ? mockGetProductVariants : service.getProductVariants;
export const getProductVariantById = USE_MOCK.detail ? mockGetProductVariantById : service.getProductVariantById;
export const createProductVariant = USE_MOCK.create ? mockCreateProductVariant : service.createProductVariant;
export const updateProductVariant = USE_MOCK.update ? mockUpdateProductVariant : service.updateProductVariant;
export const deleteProductVariant = USE_MOCK.delete ? mockDeleteProductVariant : service.deleteProductVariant;
export const restoreProductVariant = USE_MOCK.restore ? mockRestoreProductVariant : service.restoreProductVariant;
export const exportProductVariants = USE_MOCK.export ? mockExportProductVariants : service.exportProductVariants;
export const bulkUploadProductVariants = USE_MOCK.bulkUpload ? mockBulkUploadProductVariants : service.bulkUploadProductVariants;
export const downloadProductVariantTemplate = USE_MOCK.bulkTemplate ? mockDownloadProductVariantTemplate : service.downloadProductVariantTemplate;
