import {
  USE_MOCK,
  mockGetDefaultModules,
  mockGetDefaultModuleById,
  mockCreateDefaultModule,
  mockUpdateDefaultModule,
  mockDeleteDefaultModule,
  mockRestoreDefaultModule,
  mockExportDefaultModules,
  mockBulkUploadDefaultModules,
  mockDownloadDefaultModuleTemplate,
} from './mock';
import * as service from './service';

export const getDefaultModules = USE_MOCK.list ? mockGetDefaultModules : service.getDefaultModules;
export const getDefaultModuleById = USE_MOCK.detail ? mockGetDefaultModuleById : service.getDefaultModuleById;
export const createDefaultModule = USE_MOCK.create ? mockCreateDefaultModule : service.createDefaultModule;
export const updateDefaultModule = USE_MOCK.update ? mockUpdateDefaultModule : service.updateDefaultModule;
export const deleteDefaultModule = USE_MOCK.delete ? mockDeleteDefaultModule : service.deleteDefaultModule;
export const restoreDefaultModule = USE_MOCK.restore ? mockRestoreDefaultModule : service.restoreDefaultModule;
export const exportDefaultModules = USE_MOCK.export ? mockExportDefaultModules : service.exportDefaultModules;
export const bulkUploadDefaultModules = USE_MOCK.bulkUpload ? mockBulkUploadDefaultModules : service.bulkUploadDefaultModules;
export const downloadDefaultModuleTemplate = USE_MOCK.bulkTemplate ? mockDownloadDefaultModuleTemplate : service.downloadDefaultModuleTemplate;
