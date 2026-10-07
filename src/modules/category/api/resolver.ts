import {
  USE_MOCK,
  mockGetCategories,
  mockGetCategoryById,
  mockCreateCategory,
  mockUpdateCategory,
  mockDeleteCategory,
  mockRestoreCategory,
  mockExportCategories,
  mockBulkUploadCategories,
  mockDownloadCategoryTemplate,
} from './mock';
import * as service from './service';

export const getCategories = USE_MOCK.list ? mockGetCategories : service.getCategories;
export const getCategoryById = USE_MOCK.detail ? mockGetCategoryById : service.getCategoryById;
export const createCategory = USE_MOCK.create ? mockCreateCategory : service.createCategory;
export const updateCategory = USE_MOCK.update ? mockUpdateCategory : service.updateCategory;
export const deleteCategory = USE_MOCK.delete ? mockDeleteCategory : service.deleteCategory;
export const restoreCategory = USE_MOCK.restore ? mockRestoreCategory : service.restoreCategory;
export const exportCategories = USE_MOCK.export ? mockExportCategories : service.exportCategories;
export const bulkUploadCategories = USE_MOCK.bulkUpload ? mockBulkUploadCategories : service.bulkUploadCategories;
export const downloadCategoryTemplate = USE_MOCK.bulkTemplate ? mockDownloadCategoryTemplate : service.downloadCategoryTemplate;
