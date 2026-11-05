import { USE_MOCK, mockRegister } from './mock';
import * as service from './service';

export const register = USE_MOCK.register ? mockRegister : service.register;
