import { USE_MOCK, mockLogin } from './mock';
import * as service from './service';

export const login = USE_MOCK.login ? mockLogin : service.login;
