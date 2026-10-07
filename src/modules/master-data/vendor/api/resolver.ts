import {
  USE_MOCK,
  mockGetVendors,
  mockGetVendorById,
  mockCreateVendor,
  mockUpdateVendor,
  mockDeleteVendor,
  mockRestoreVendor,
  mockExportVendors,
  mockBulkUploadVendors,
  mockDownloadVendorTemplate,
  loadRegionOptions as mockLoadRegionOptions,
} from './mock';
import * as service from './service';

export const getVendors = USE_MOCK.list ? mockGetVendors : service.getVendors;
export const getVendorById = USE_MOCK.detail ? mockGetVendorById : service.getVendorById;
export const createVendor = USE_MOCK.create ? mockCreateVendor : service.createVendor;
export const updateVendor = USE_MOCK.update ? mockUpdateVendor : service.updateVendor;
export const deleteVendor = USE_MOCK.delete ? mockDeleteVendor : service.deleteVendor;
export const restoreVendor = USE_MOCK.restore ? mockRestoreVendor : service.restoreVendor;
export const exportVendors = USE_MOCK.export ? mockExportVendors : service.exportVendors;
export const bulkUploadVendors = USE_MOCK.bulkUpload ? mockBulkUploadVendors : service.bulkUploadVendors;
export const downloadVendorTemplate = USE_MOCK.bulkTemplate ? mockDownloadVendorTemplate : service.downloadVendorTemplate;
export const loadRegionOptions = USE_MOCK.regionLoadOptions ? mockLoadRegionOptions : service.loadRegionOptions;
