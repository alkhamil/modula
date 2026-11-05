import { USE_MOCK, mockRequestReset, mockResetPassword } from './mock';
import * as service from './service';

export const requestReset = USE_MOCK.requestReset ? mockRequestReset : service.requestReset;
export const resetPassword = USE_MOCK.resetPassword ? mockResetPassword : service.resetPassword;
