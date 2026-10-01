import {
  USE_MOCK,
  mockGetCompanies,
  mockGetCompanyById,
  mockCreateCompany,
  mockUpdateCompany,
  mockDeleteCompany,
  mockRestoreCompany,
  loadCompanyGroupOptions as mockCompanyGroupLoader,
} from './mock';
import * as service from './service';

export const getCompanies = USE_MOCK.list ? mockGetCompanies : service.getCompanies;
export const getCompanyById = USE_MOCK.detail ? mockGetCompanyById : service.getCompanyById;
export const createCompany = USE_MOCK.create ? mockCreateCompany : service.createCompany;
export const updateCompany = USE_MOCK.update ? mockUpdateCompany : service.updateCompany;
export const deleteCompany = USE_MOCK.delete ? mockDeleteCompany : service.deleteCompany;
export const restoreCompany = USE_MOCK.restore ? mockRestoreCompany : service.restoreCompany;
export const loadCompanyGroupOptions = USE_MOCK.companyGroupLoadOptions ? mockCompanyGroupLoader : service.loadCompanyGroupOptions;
