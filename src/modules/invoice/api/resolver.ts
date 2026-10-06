import {
  USE_MOCK,
  mockGetInvoices,
  mockGetInvoiceById,
  mockCreateInvoice,
  mockUpdateInvoice,
  mockDeleteInvoice,
  mockRestoreInvoice,
  mockExportInvoices,
  mockBulkUploadInvoices,
  mockDownloadInvoiceTemplate,
  loadSellerOptions as mockLoadSellerOptions,
  loadBuyerOptions as mockLoadBuyerOptions,
  loadDetailProductProductOptions as mockLoadDetailProductProductOptions,
  getSellerOptionLabel as mockGetSellerOptionLabel,
  getBuyerOptionLabel as mockGetBuyerOptionLabel,
  getDetailProductProductOptionLabel as mockGetDetailProductProductOptionLabel,
} from './mock';
import * as service from './service';

export const getInvoices = USE_MOCK.list ? mockGetInvoices : service.getInvoices;
export const getInvoiceById = USE_MOCK.detail ? mockGetInvoiceById : service.getInvoiceById;
export const createInvoice = USE_MOCK.create ? mockCreateInvoice : service.createInvoice;
export const updateInvoice = USE_MOCK.update ? mockUpdateInvoice : service.updateInvoice;
export const deleteInvoice = USE_MOCK.delete ? mockDeleteInvoice : service.deleteInvoice;
export const restoreInvoice = USE_MOCK.restore ? mockRestoreInvoice : service.restoreInvoice;
export const exportInvoices = USE_MOCK.export ? mockExportInvoices : service.exportInvoices;
export const bulkUploadInvoices = USE_MOCK.bulkUpload ? mockBulkUploadInvoices : service.bulkUploadInvoices;
export const downloadInvoiceTemplate = USE_MOCK.bulkTemplate ? mockDownloadInvoiceTemplate : service.downloadInvoiceTemplate;
export const loadSellerOptions = USE_MOCK.sellerLoadOptions ? mockLoadSellerOptions : service.loadSellerOptions;
export const loadBuyerOptions = USE_MOCK.buyerLoadOptions ? mockLoadBuyerOptions : service.loadBuyerOptions;
export const loadDetailProductProductOptions = USE_MOCK.productLoadOptions ? mockLoadDetailProductProductOptions : service.loadDetailProductProductOptions;
export const getSellerOptionLabel = USE_MOCK.sellerLabel ? mockGetSellerOptionLabel : service.getSellerOptionLabel;
export const getBuyerOptionLabel = USE_MOCK.buyerLabel ? mockGetBuyerOptionLabel : service.getBuyerOptionLabel;
export const getDetailProductProductOptionLabel = USE_MOCK.productLabel ? mockGetDetailProductProductOptionLabel : service.getDetailProductProductOptionLabel;
