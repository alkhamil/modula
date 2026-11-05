import { USE_MOCK, mockLogout } from './mock';
import * as service from './service';

export const logout = USE_MOCK.logout ? mockLogout : service.logout;
