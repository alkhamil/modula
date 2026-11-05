import { USE_MOCK, mockVerifyCode } from './mock';
import * as service from './service';

export const verifyCode = USE_MOCK.verify ? mockVerifyCode : service.verifyCode;
