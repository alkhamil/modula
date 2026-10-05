# New session - 2026-10-03T05:37:44.608Z

**Session ID:** ses_effbb4d60ffeBOBp4rUiMp61XB
**Created:** 10/3/2026, 12:37:44 PM
**Updated:** 10/4/2026, 2:03:42 PM

---

## User

Untuk **Auth**, coba tiru konsep **Service Mock Resolver** yang sudah digunakan di `boilerplate_fe`.

Pelajari implementasi Auth dan terutama **User Module** yang sudah ada di `boilerplate_fe` sebagai referensi.

Kemudian terapkan pattern yang sama ke **module generator**, sehingga setiap module yang di-generate sudah memiliki konsep:

* Service
* Mock Service
* Service Mock Resolver

Pastikan struktur, flow, naming, dan cara penggunaannya mengikuti pattern yang sudah ada di `boilerplate_fe`, jangan membuat pattern baru. 

---

## Assistant (Build · Muse Spark 1.3 Free · 17.5s)

_Thinking:_



**Tool: bash**

**Input:**
```json
{
  "command": "ls ~/Documents/Projects/ 2>/dev/null; ls /Users/nazmudinalkhamil/Documents/Projects/ 2>/dev/null; find /Users/nazmudinalkhamil/Documents -maxdepth 3 -iname \"*boilerplate*\" 2>/dev/null | head -5"
}
```

**Output:**
```
ait_core_ui
ait_mds
ait_pro_revamp_frontend
ait_revamp_react_web
ait_test_core_ui
automation-bot
bcai_mobile_app_frontend
bcai_portal_nmv_backend
bcai_portal_nmv_frontend
beriaga-pos
boilerplate-fe
boilerplate-fe.worktrees
cashier-app
dayacore_cms
dayacore_kds_web
dayacore_pos_web
dayacore_self_order_web
generator-module-app
jayaraja
jira-md-tool
mandiri_taspen_leads_web
naz-motion-ai-bot
nurul_anwar
prometheus_doc
prompt_store
rama-jaya-mandiri
rni-cms
template-admin
toko_kitab
ait_core_ui
ait_mds
ait_pro_revamp_frontend
ait_revamp_react_web
ait_test_core_ui
automation-bot
bcai_mobile_app_frontend
bcai_portal_nmv_backend
bcai_portal_nmv_frontend
beriaga-pos
boilerplate-fe
boilerplate-fe.worktrees
cashier-app
dayacore_cms
dayacore_kds_web
dayacore_pos_web
dayacore_self_order_web
generator-module-app
jayaraja
jira-md-tool
mandiri_taspen_leads_web
naz-motion-ai-bot
nurul_anwar
prometheus_doc
prompt_store
rama-jaya-mandiri
rni-cms
template-admin
toko_kitab
/Users/nazmudinalkhamil/Documents/Projects/boilerplate-fe
/Users/nazmudinalkhamil/Documents/Projects/generator-module-app/boilerplate-fe
/Users/nazmudinalkhamil/Documents/Projects/boilerplate-fe.worktrees

```

---

## Assistant (Build · Muse Spark 1.3 Free · 3.7s)

_Thinking:_



**Tool: bash**

**Input:**
```json
{
  "command": "ls /Users/nazmudinalkhamil/Documents/Projects/boilerplate-fe/; echo '==='; ls /Users/nazmudinalkhamil/Documents/Projects/generator-module-app/boilerplate-fe/ 2>/dev/null | head -5"
}
```

**Output:**
```
AGENTS.md
cypress
cypress.config.ts
dist
Dockerfile
docs
eslint.config.js
export-postman.sh
graphify-out
index.html
nginx.conf
node_modules
package-lock.json
package.json
public
README.md
SKILL.md
sonar-project.properties
src
tailwind.config.js
tsconfig.app.json
tsconfig.json
tsconfig.node.json
vite.config.ts
===
AGENTS.md
cypress
cypress.config.ts
dist
Dockerfile

```

---

## Assistant (Build · Muse Spark 1.3 Free · 3.1s)

**Tool: bash**

**Input:**
```json
{
  "command": "ls /Users/nazmudinalkhamil/Documents/Projects/boilerplate-fe/src/; echo '==='; ls /Users/nazmudinalkhamil/Documents/Projects/boilerplate-fe/src/modules/ 2>/dev/null | head -20"
}
```

**Output:**
```
app
App.css
App.tsx
assets
index.css
main.tsx
modules
shared
vite-env.d.ts
===
auth
balailelang
internal
thirdparty

```

---

## Assistant (Build · Muse Spark 1.3 Free · 2.8s)

**Tool: bash**

**Input:**
```json
{
  "command": "ls -R /Users/nazmudinalkhamil/Documents/Projects/boilerplate-fe/src/modules/auth/ 2>/dev/null | head -30; echo '=== user?'; find /Users/nazmudinalkhamil/Documents/Projects/boilerplate-fe/src -maxdepth 3 -iname \"*user*\" | head -10"
}
```

**Output:**
```
create-password
forgot-password
login

/Users/nazmudinalkhamil/Documents/Projects/boilerplate-fe/src/modules/auth/create-password:
api
components
hooks
index.ts
pages
types

/Users/nazmudinalkhamil/Documents/Projects/boilerplate-fe/src/modules/auth/create-password/api:
index.ts
mock.ts
mutations.ts
queries.ts
resolver.ts
service.ts

/Users/nazmudinalkhamil/Documents/Projects/boilerplate-fe/src/modules/auth/create-password/components:
CreatePasswordForm.tsx
PasswordResetLinkErrorCard.tsx

/Users/nazmudinalkhamil/Documents/Projects/boilerplate-fe/src/modules/auth/create-password/hooks:
index.ts
useCreatePasswordForm.ts

/Users/nazmudinalkhamil/Documents/Projects/boilerplate-fe/src/modules/auth/create-password/pages:
CreatePasswordPage.tsx
=== user?
/Users/nazmudinalkhamil/Documents/Projects/boilerplate-fe/src/modules/internal/user-management

```

---

## Assistant (Build · Muse Spark 1.3 Free · 4.8s)

_Thinking:_



**Tool: bash**

**Input:**
```json
{
  "command": "ls -R /Users/nazmudinalkhamil/Documents/Projects/boilerplate-fe/src/modules/auth/login/api/ /Users/nazmudinalkhamil/Documents/Projects/boilerplate-fe/src/modules/internal/user-management/ 2>/dev/null | head -40"
}
```

**Output:**
```
/Users/nazmudinalkhamil/Documents/Projects/boilerplate-fe/src/modules/auth/login/api/:
index.ts
mock.ts
mutations.ts
queries.ts
resolver.ts
service.ts

/Users/nazmudinalkhamil/Documents/Projects/boilerplate-fe/src/modules/internal/user-management/:
index.ts
manage-role
manage-user

/Users/nazmudinalkhamil/Documents/Projects/boilerplate-fe/src/modules/internal/user-management/manage-role:
api
components
hooks
index.ts
pages
types

/Users/nazmudinalkhamil/Documents/Projects/boilerplate-fe/src/modules/internal/user-management/manage-role/api:
index.ts
mock.ts
mutations.ts
queries.ts
resolver.ts
service.ts

/Users/nazmudinalkhamil/Documents/Projects/boilerplate-fe/src/modules/internal/user-management/manage-role/components:
index.ts
PermissionTable.tsx
RoleForm.tsx
RoleTable.tsx

/Users/nazmudinalkhamil/Documents/Projects/boilerplate-fe/src/modules/internal/user-management/manage-role/hooks:
index.ts
permissionTree.ts
useRoleForm.tsx
useRoleList.ts

```

---

## Assistant (Build · Muse Spark 1.3 Free · 6.2s)

**Tool: read**

**Input:**
```json
{
  "filePath": "/Users/nazmudinalkhamil/Documents/Projects/boilerplate-fe/src/modules/auth/login/api/resolver.ts"
}
```

**Output:**
```
<path>/Users/nazmudinalkhamil/Documents/Projects/boilerplate-fe/src/modules/auth/login/api/resolver.ts</path>
<type>file</type>
<content>
1: import { USE_MOCK, mockLogin, mockLogout, mockRefresh, mockVerifyEmailToken } from './mock';
2: import * as service from './service';
3: 
4: export const login = USE_MOCK.login ? mockLogin : service.login;
5: export const logout = USE_MOCK.logout ? mockLogout : service.logout;
6: export const refresh = USE_MOCK.refresh ? mockRefresh : service.refresh;
7: export const verifyEmailToken = USE_MOCK.verifyEmail
8:   ? mockVerifyEmailToken
9:   : service.verifyEmailToken;

(End of file - total 9 lines)
</content>
```

**Tool: read**

**Input:**
```json
{
  "filePath": "/Users/nazmudinalkhamil/Documents/Projects/boilerplate-fe/src/modules/auth/login/api/service.ts"
}
```

**Output:**
```
<path>/Users/nazmudinalkhamil/Documents/Projects/boilerplate-fe/src/modules/auth/login/api/service.ts</path>
<type>file</type>
<content>
1: import api, { AUTH_STORAGE_KEYS } from '../../../../shared/lib/api';
2: import { isConnectionError, NETWORK_ERROR_MESSAGE, createUuid } from '../../../../shared/utils';
3: import type {
4:   LoginPayload,
5:   LoginResponse,
6:   RefreshResponse,
7:   LoginError,
8:   EmailVerificationResponse,
9:   EmailVerificationError,
10: } from '../types';
11: import type { ApiDetail, ApiResponse } from '../../../../shared/types';
12: 
13: interface LoginErrorBody {
14:   response_schema: { response_code: string; response_message: string };
15:   response_output?: { detail?: { redirect_url?: string; token?: string } | null } | null;
16: }
17: 
18: function getDeviceId(): string {
19:   let deviceId = localStorage.getItem(AUTH_STORAGE_KEYS.deviceId);
20:   if (!deviceId) {
21:     deviceId =
22:       typeof crypto.randomUUID === 'function'
23:         ? crypto.randomUUID()
24:         : `device-${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
25:     localStorage.setItem(AUTH_STORAGE_KEYS.deviceId, deviceId);
26:   }
27:   return deviceId;
28: }
29: 
30: export async function login(payload: LoginPayload): Promise<LoginResponse> {
31:   try {
32:     const { data } = await api.post<ApiResponse<ApiDetail<LoginResponse>>>(
33:       '/api/v1/auth/login',
34:       payload,
35:       {
36:         headers: {
37:           'X-DEVICE-ID': getDeviceId(),
38:           'X-REQUEST-ID': createUuid(),
39:         },
40:       },
41:     );
42:     return data.response_output!.detail;
43:   } catch (err) {
44:     if (err && typeof err === 'object' && 'response_schema' in err) {
45:       const body = err as LoginErrorBody;
46:       const detail = body.response_output?.detail;
47:       const createPasswordUrl = detail?.redirect_url
48:         ? detail.redirect_url
49:         : detail?.token
50:           ? `/create-password?token=${detail.token}`
51:           : undefined;
52:       throw {
53:         message: body.response_schema.response_message,
54:         response_code: body.response_schema.response_code,
55:         ...(createPasswordUrl ? { createPasswordUrl } : {}),
56:       } as LoginError;
57:     }
58:     throw {
59:       message: isConnectionError(err) ? NETWORK_ERROR_MESSAGE : 'Login failed',
60:       response_code: 'BCAI-LOGIN-INVALID-400',
61:     } as LoginError;
62:   }
63: }
64: 
65: interface VerifyEmailErrorBody {
66:   response_schema: { response_code: string; response_message: string };
67: }
68: 
69: export async function verifyEmailToken(token: string): Promise<EmailVerificationResponse> {
70:   try {
71:     const { data } = await api.get<ApiResponse<ApiDetail<EmailVerificationResponse>>>(
72:       '/api/v1/auth/email/verification',
73:       { params: { token } },
74:     );
75:     return data.response_output!.detail;
76:   } catch (err) {
77:     const data = (err as { response?: { data?: VerifyEmailErrorBody } }).response?.data;
78:     if (data?.response_schema?.response_message) {
79:       throw {
80:         message: data.response_schema.response_message,
81:         response_code: data.response_schema.response_code ?? 'BCAI-AUTH-EMAIL_VERIFICATION-400',
82:       } as EmailVerificationError;
83:     }
84:     throw {
85:       message: isConnectionError(err) ? NETWORK_ERROR_MESSAGE : 'Verification failed',
86:       response_code: 'BCAI-AUTH-EMAIL_VERIFICATION-400',
87:     } as EmailVerificationError;
88:   }
89: }
90: 
91: export async function refresh(): Promise<RefreshResponse> {
92:   const refreshToken = localStorage.getItem(AUTH_STORAGE_KEYS.refreshToken);
93:   const { data } = await api.get<ApiResponse<ApiDetail<RefreshResponse>>>('/api/v1/auth/refresh', {
94:     headers: { Authorization: `Bearer ${refreshToken}` },
95:   });
96:   return data.response_output!.detail;
97: }
98: 
99: export async function logout(): Promise<void> {
100:   await api.get<ApiResponse<null>>('/api/v1/auth/logout');
101: }

(End of file - total 101 lines)
</content>
```

---

## Assistant (Build · Muse Spark 1.3 Free · 9.1s)

_Thinking:_



**Tool: bash**

**Input:**
```json
{
  "command": "grep -n \"USE_MOCK\" -A 10 /Users/nazmudinalkhamil/Documents/Projects/boilerplate-fe/src/modules/auth/login/api/mock.ts | head -14; echo '=== user mgmt resolver'; cat /Users/nazmudinalkhamil/Documents/Projects/boilerplate-fe/src/modules/internal/user-management/manage-user/api/resolver.ts 2>/dev/null | head -40; ls /Users/nazmudinalkhamil/Documents/Projects/boilerplate-fe/src/modules/internal/user-management/manage-user/api/ 2>/dev/null"
}
```

**Output:**
```
13:export const USE_MOCK = {
14-  login: false,
15-  logout: false,
16-  refresh: false,
17-  verifyEmail: false,
18-};
19-
20-const ACCESS_TTL_S = 600;
21-const REFRESH_TTL_S = 3600;
22-
23-interface MockAuthUser {
=== user mgmt resolver
import {
  USE_MOCK,
  mockGetUsers,
  mockGetUserById,
  mockCreateUser,
  mockUpdateUser,
  mockDeleteUser,
  mockRestoreUser,
  mockGetRoleOptions,
  mockVerifyLdapPassword,
  mockSearchLdapUserByNip,
} from './mock';
import * as service from './service';

export const getUsers = USE_MOCK.list ? mockGetUsers : service.getUsers;
export const getUserById = USE_MOCK.detail ? mockGetUserById : service.getUserById;
export const createUser = USE_MOCK.create ? mockCreateUser : service.createUser;
export const updateUser = USE_MOCK.update ? mockUpdateUser : service.updateUser;
export const deleteUser = USE_MOCK.delete ? mockDeleteUser : service.deleteUser;
export const restoreUser = USE_MOCK.restore ? mockRestoreUser : service.restoreUser;
export const getRoleOptions = USE_MOCK.roleOptions ? mockGetRoleOptions : service.getRoleOptions;
export const verifyLdapPassword = USE_MOCK.verifyPassword
  ? mockVerifyLdapPassword
  : service.verifyLdapPassword;
export const searchLdapUserByNip = USE_MOCK.searchUser
  ? mockSearchLdapUserByNip
  : service.searchLdapUserByNip;
index.ts
mock.ts
mutations.ts
queries.ts
resolver.ts
service.ts

```

---

## Assistant (Build · Muse Spark 1.3 Free · 3.2s)

**Tool: bash**

**Input:**
```json
{
  "command": "grep -n \"USE_MOCK\" -A 14 /Users/nazmudinalkhamil/Documents/Projects/boilerplate-fe/src/modules/internal/user-management/manage-user/api/mock.ts | head -18; echo '=== service head'; sed -n '1,80p' /Users/nazmudinalkhamil/Documents/Projects/boilerplate-fe/src/modules/internal/user-management/manage-user/api/service.ts"
}
```

**Output:**
```
14:export const USE_MOCK = {
15-  list: false,
16-  detail: false,
17-  create: false,
18-  update: false,
19-  delete: false,
20-  restore: false,
21-  roleOptions: false,
22-  verifyPassword: false,
23-  searchUser: false,
24-};
25-
26-const MOCK_LDAP_PASSWORD = 'ldap-secret';
27-
28-function mockApiError(message: string, code = 'BCAI-USER-400', field?: string) {
=== service head
import api from '../../../../../shared/lib/api';
import type {
  User,
  CreateUserPayload,
  GetUsersParams,
  LdapCheckLoginResult,
  LdapUserResult,
  UserMutationResult,
} from '../types';
import type { SelectOption } from '../../../../../shared/components/ui';
import type { ApiDetail, ApiList, ApiResponse } from '../../../../../shared/types';

export async function getUsers(params?: GetUsersParams): Promise<ApiList<User>> {
  const res = await api.get<ApiResponse<ApiList<User>>>('/api/v1/users', {
    params: { ...params, page: (params?.page ?? 1) - 1 },
  });
  return res.data.response_output ?? { list: { pagination: null, content: [] } };
}

export async function getUserById(userId: string): Promise<User> {
  const res = await api.get<ApiResponse<ApiDetail<User>>>(`/api/v1/users/${userId}`);
  return res.data.response_output!.detail;
}

export async function createUser(data: CreateUserPayload): Promise<UserMutationResult> {
  const res = await api.post<ApiResponse<ApiDetail<User>>>('/api/v1/users', data);
  return {
    message: res.data.response_schema.response_message,
    data: res.data.response_output!.detail,
  };
}

export async function updateUser(
  userId: string,
  data: CreateUserPayload,
): Promise<UserMutationResult> {
  const res = await api.put<ApiResponse<ApiDetail<User>>>(`/api/v1/users/${userId}`, data);
  return {
    message: res.data.response_schema.response_message,
    data: res.data.response_output!.detail,
  };
}

export async function deleteUser(userId: string): Promise<{ message: string }> {
  const res = await api.delete<ApiResponse<null>>(`/api/v1/users/${userId}`);
  return { message: res.data.response_schema.response_message };
}

export async function restoreUser(userId: string): Promise<UserMutationResult> {
  const res = await api.patch<ApiResponse<ApiDetail<User>>>(`/api/v1/users/${userId}/restore`);
  return {
    message: res.data.response_schema.response_message,
    data: res.data.response_output!.detail,
  };
}

export async function getRoleOptions(search?: string): Promise<SelectOption[]> {
  const res = await api.get<ApiResponse<ApiList<{ id: number | string; name: string }>>>(
    '/api/v1/roles',
    {
      params: { search, page: 0, size: 999999, status: 'active' },
    },
  );
  const content = res.data.response_output?.list.content ?? [];
  return content.map((r) => ({
    label: r.name,
    value: String(r.id),
  }));
}

export async function verifyLdapPassword(password: string): Promise<LdapCheckLoginResult> {
  const res = await api.post<ApiResponse<ApiDetail<LdapCheckLoginResult>>>(
    '/api/v1/users/ldap/check-password',
    { password },
  );
  return res.data.response_output!.detail;
}

export async function searchLdapUserByNip(nip: string, password: string): Promise<LdapUserResult> {
  const res = await api.post<ApiResponse<ApiDetail<LdapUserResult>>>(

```

---

## Assistant (Build · Muse Spark 1.3 Free · 12.2s)

_Thinking:_

Summarizing the boilerplate structure with shared API client, mock flags, service layer, and resolver switching.

_Thinking:_

Switching to axios with USE_MOCK flags and /api/v1 resource paths per boilerplate.

_Thinking:_



**Tool: bash**

**Input:**
```json
{
  "command": "find /Users/nazmudinalkhamil/Documents/Projects/boilerplate-fe/src/shared/lib -type f | head; echo '==='; ls -R /Users/nazmudinalkhamil/Documents/Projects/generator-module-app/src/modules/auth/ | head -20; echo '==='; ls /Users/nazmudinalkhamil/Documents/Projects/generator-module-app/src/shared/lib/"
}
```

**Output:**
```
/Users/nazmudinalkhamil/Documents/Projects/boilerplate-fe/src/shared/lib/api.ts
===
api
components
hooks
index.ts
types

/Users/nazmudinalkhamil/Documents/Projects/generator-module-app/src/modules/auth/api:
index.ts
mock.ts
mockUsers.ts

/Users/nazmudinalkhamil/Documents/Projects/generator-module-app/src/modules/auth/components:
AuthProvider.tsx
index.ts
PermissionGate.tsx
RequireAuth.tsx

/Users/nazmudinalkhamil/Documents/Projects/generator-module-app/src/modules/auth/hooks:
index.ts
useAuth.ts
===
queryClient.ts

```

---

## Assistant (Build · Muse Spark 1.3 Free · 7.3s)

**Tool: read**

**Input:**
```json
{
  "filePath": "/Users/nazmudinalkhamil/Documents/Projects/boilerplate-fe/src/shared/lib/api.ts"
}
```

**Output:**
```
<path>/Users/nazmudinalkhamil/Documents/Projects/boilerplate-fe/src/shared/lib/api.ts</path>
<type>file</type>
<content>
1: import axios, { type InternalAxiosRequestConfig } from 'axios';
2: 
3: const baseURL = import.meta.env.VITE_API_BASE_URL || '';
4: 
5: export interface RefreshResponseDetail {
6:   access_token: string;
7:   access_token_ttl: string;
8: }
9: 
10: export type RefreshHandler = () => Promise<RefreshResponseDetail>;
11: 
12: let refreshHandler: RefreshHandler | null = null;
13: 
14: export function setAuthRefreshHandler(handler: RefreshHandler) {
15:   refreshHandler = handler;
16: }
17: 
18: export const AUTH_STORAGE_KEYS = {
19:   token: 'token',
20:   refreshToken: 'refresh_token',
21:   tokenIssuedAt: 'token_issued_at',
22:   tokenTtl: 'token_ttl',
23:   user: 'user',
24:   permissions: 'permissions',
25:   deviceId: 'device_id',
26: } as const;
27: 
28: export function clearAuthStorage() {
29:   Object.values(AUTH_STORAGE_KEYS).forEach((key) => {
30:     if (key !== AUTH_STORAGE_KEYS.deviceId) localStorage.removeItem(key);
31:   });
32: }
33: 
34: const api = axios.create({
35:   baseURL,
36:   headers: { 'Content-Type': 'application/json' },
37:   timeout: 60000,
38: });
39: 
40: api.interceptors.request.use((config) => {
41:   if (!config.headers.Authorization) {
42:     const token = localStorage.getItem(AUTH_STORAGE_KEYS.token);
43:     if (token) {
44:       config.headers.Authorization = `Bearer ${token}`;
45:     }
46:   }
47:   return config;
48: });
49: 
50: interface RetriableConfig extends InternalAxiosRequestConfig {
51:   _retried?: boolean;
52: }
53: 
54: let refreshPromise: Promise<string> | null = null;
55: 
56: async function refreshAccessToken(): Promise<string> {
57:   if (!refreshPromise) {
58:     refreshPromise = (async () => {
59:       if (!refreshHandler) throw new Error('Refresh handler not registered');
60:       const res = await refreshHandler();
61:       localStorage.setItem(AUTH_STORAGE_KEYS.token, res.access_token);
62:       localStorage.setItem(AUTH_STORAGE_KEYS.tokenTtl, res.access_token_ttl);
63:       localStorage.setItem(AUTH_STORAGE_KEYS.tokenIssuedAt, String(Date.now()));
64:       return res.access_token;
65:     })().finally(() => {
66:       refreshPromise = null;
67:     });
68:   }
69:   return refreshPromise;
70: }
71: 
72: api.interceptors.response.use(
73:   (response) => response,
74:   async (error) => {
75:     const config = error.config as RetriableConfig | undefined;
76:     const url = config?.url;
77:     const isLoginRequest = url === '/api/v1/auth/login';
78:     const isRefreshRequest = url === '/api/v1/auth/refresh';
79:     const isLogoutRequest = url === '/api/v1/auth/logout';
80: 
81:     if (isLoginRequest && error.response?.data) {
82:       return Promise.reject(error.response.data);
83:     }
84: 
85:     if (isRefreshRequest || isLogoutRequest || !error.response) {
86:       return Promise.reject(error);
87:     }
88: 
89:     if (error.response.status === 403) {
90:       const message = (error.response.data as { response_schema?: { response_message?: string } })
91:         ?.response_schema?.response_message;
92:       window.dispatchEvent(new CustomEvent('api-forbidden', { detail: { message } }));
93:       return Promise.reject(error);
94:     }
95: 
96:     if (error.response.status === 401) {
97:       // Refresh + dialog session-expired hanya untuk kegagalan auth milik kita.
98:       // 401 lain (mis. `BCAI-UPSTREAM-401` dari check-toi) diteruskan apa adanya.
99:       const responseCode = (
100:         error.response.data as { response_schema?: { response_code?: string } } | undefined
101:       )?.response_schema?.response_code;
102:       if (responseCode !== 'BCAI-AUTH-401') {
103:         return Promise.reject(error);
104:       }
105:       if (config?._retried) {
106:         window.dispatchEvent(new CustomEvent('session-expired'));
107:         return Promise.reject(error);
108:       }
109:       if (!refreshHandler || !localStorage.getItem(AUTH_STORAGE_KEYS.refreshToken)) {
110:         window.dispatchEvent(new CustomEvent('session-expired'));
111:         return Promise.reject(error);
112:       }
113:       if (!config) return Promise.reject(error);
114:       config._retried = true;
115:       try {
116:         await refreshAccessToken();
117:         config.headers.Authorization = `Bearer ${localStorage.getItem(AUTH_STORAGE_KEYS.token)}`;
118:         return api(config);
119:       } catch {
120:         window.dispatchEvent(new CustomEvent('session-expired'));
121:         return Promise.reject(error);
122:       }
123:     }
124: 
125:     return Promise.reject(error);
126:   },
127: );
128: 
129: export default api;

(End of file - total 129 lines)
</content>
```

---

## Assistant (Build · Muse Spark 1.3 Free · 10.2s)

_Thinking:_

Evaluating minimal port of the axios client and confirming shared types and auth pattern for the service/mocks/resolver structure.

_Thinking:_

Extending the port to generator templates while aligning axios client and mock behavior with existing storage keys.

**Tool: bash**

**Input:**
```json
{
  "command": "grep -rn \"auth_token\\|auth_user\\|permissions\" src/modules/auth/api/mock.ts src/modules/auth/hooks/useAuth.ts 2>/dev/null | head -8; echo '==='; grep -n \"ApiResponse\\|ApiDetail\\|ApiList\" src/shared/types/*.ts | head -8; echo '==='; grep -n \"USE_MOCK\" -A 12 src/modules/generator/templates/crud/api.ts | sed -n '1,16p'",
  "workdir": "/Users/nazmudinalkhamil/Documents/Projects/generator-module-app"
}
```

**Output:**
```
src/modules/auth/api/mock.ts:21:    permissions: normalizePermissions(record.permissions),
===
src/shared/types/api.ts:8:export interface ApiList<T> {
src/shared/types/api.ts:15:export interface ApiDetail<T> {
src/shared/types/api.ts:19:export interface ApiResponse<T> {
src/shared/types/index.ts:1:export type { ApiResponse, ApiDetail, ApiList, ApiPagination } from './api';
===
302:export const USE_MOCK = {
303-${mockFlags}
304-};
305-
306-function delay(ms: number): Promise<void> {
307-  return new Promise((resolve) => setTimeout(resolve, ms));
308-}
309-${optionsConsts ? `\n${optionsConsts}\n` : ''}
310-${loadFns ? `${loadFns}\n` : ''}
311-interface Mock${names.entity}Record {
312-  id: number;
313-${fields.map((f) => `  ${f.name}: ${tsDataType(f)};`).join('\n')}
314-  status: 'active' | 'inactive';

```

---

## Assistant (Build · Muse Spark 1.3 Free · 3.7s)

**Tool: bash**

**Input:**
```json
{
  "command": "sed -n '1,60p' src/modules/auth/api/mock.ts; echo '==='; grep -rn \"localStorage\" src/modules/auth --include='*.ts' --include='*.tsx' | grep -v mockUsers | head -8",
  "workdir": "/Users/nazmudinalkhamil/Documents/Projects/generator-module-app"
}
```

**Output:**
```
import type { LoginPayload, LoginResult } from '../types';
import { normalizePermissions } from '../../../shared/utils';
import { mockUserRecords } from './mockUsers';

/** Auth mock-only (tanpa BE): kredensial dicek terhadap `mockUserRecords`. */
function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export async function mockLogin(payload: LoginPayload): Promise<LoginResult> {
  await delay(500);
  const record = mockUserRecords.find(
    (candidate) => candidate.username === payload.username.trim().toLowerCase(),
  );
  if (!record || record.password !== payload.password) {
    throw new Error('auth.invalidCredentials');
  }
  return {
    user: { username: record.username, name: record.name, role: record.role },
    token: `mock-token-${record.username}-${Date.now()}`,
    permissions: normalizePermissions(record.permissions),
  };
}

export async function mockLogout(): Promise<void> {
  await delay(200);
}
===
src/modules/auth/components/AuthProvider.tsx:27:    const raw = localStorage.getItem(USER_KEY);
src/modules/auth/components/AuthProvider.tsx:41:    localStorage.getItem(TOKEN_KEY) ? readUser() : null,
src/modules/auth/components/AuthProvider.tsx:44:    localStorage.getItem(TOKEN_KEY) ? getStoredPermissions() : [],
src/modules/auth/components/AuthProvider.tsx:49:    localStorage.setItem(TOKEN_KEY, result.token);
src/modules/auth/components/AuthProvider.tsx:50:    localStorage.setItem(USER_KEY, JSON.stringify(result.user));
src/modules/auth/components/AuthProvider.tsx:51:    localStorage.setItem(PERMISSIONS_KEY, JSON.stringify(result.permissions));
src/modules/auth/components/AuthProvider.tsx:61:      localStorage.removeItem(TOKEN_KEY);
src/modules/auth/components/AuthProvider.tsx:62:      localStorage.removeItem(USER_KEY);

```

---

## Assistant (Build · Muse Spark 1.3 Free · 6.2s)

_Thinking:_

Implementing an axios client with token injection and error handling while omitting refresh logic to match existing auth.

**Tool: bash**

**Input:**
```json
{
  "command": "grep -n \"TOKEN_KEY\\|USER_KEY\\|PERMISSIONS_KEY\" src/modules/auth/components/AuthProvider.tsx | head -5; grep -rn \"api-forbidden\\|session-expired\" src --include='*.tsx' --include='*.ts' | head -4; echo '==='; cat src/shared/lib/queryClient.ts | head -20",
  "workdir": "/Users/nazmudinalkhamil/Documents/Projects/generator-module-app"
}
```

**Output:**
```
10:const TOKEN_KEY = 'auth_token';
11:const USER_KEY = 'auth_user';
12:const PERMISSIONS_KEY = 'permissions';
27:    const raw = localStorage.getItem(USER_KEY);
41:    localStorage.getItem(TOKEN_KEY) ? readUser() : null,
src/shared/components/ui/toast/Toast.tsx:49:const FORBIDDEN_EVENT = 'api-forbidden';
===
import { QueryClient } from '@tanstack/react-query';

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 60_000,
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

```

---

## Assistant (Build · Muse Spark 1.3 Free · 6.1s)

_Thinking:_

Implementing axios-based API layer with REST service and mock resolver templates.

_Thinking:_



**Tool: todowrite**

**Input:**
```json
{
  "todos": [
    {
      "content": "Add axios + shared/lib/api client (mirror boilerplate, adapted keys)",
      "status": "in_progress",
      "priority": "high"
    },
    {
      "content": "Rewrite serviceTemplate: axios + /api/v1 REST (mirror manage-user service)",
      "status": "pending",
      "priority": "high"
    },
    {
      "content": "Rewrite resolverTemplate: USE_MOCK pattern; confirm mock flags",
      "status": "pending",
      "priority": "high"
    },
    {
      "content": "Update INTEGRATION template docs; verify lint/build/verify",
      "status": "pending",
      "priority": "high"
    }
  ]
}
```

**Output:**
```
[
  {
    "content": "Add axios + shared/lib/api client (mirror boilerplate, adapted keys)",
    "status": "in_progress",
    "priority": "high"
  },
  {
    "content": "Rewrite serviceTemplate: axios + /api/v1 REST (mirror manage-user service)",
    "status": "pending",
    "priority": "high"
  },
  {
    "content": "Rewrite resolverTemplate: USE_MOCK pattern; confirm mock flags",
    "status": "pending",
    "priority": "high"
  },
  {
    "content": "Update INTEGRATION template docs; verify lint/build/verify",
    "status": "pending",
    "priority": "high"
  }
]
```

---

## Assistant (Build · Muse Spark 1.3 Free · 7.7s)

**Tool: bash**

**Input:**
```json
{
  "command": "npm install axios 2>&1 | tail -1; sed -n '280,302p' src/modules/generator/templates/crud/api.ts",
  "workdir": "/Users/nazmudinalkhamil/Documents/Projects/generator-module-app"
}
```

**Output:**
```
Run `npm audit` for details.

  const conflictCheck = (exclude: string): string =>
    uniqueField
      ? `
  if (mock${names.entity}Records.some((r) => ${exclude}r.${uniqueField.name} === data.${uniqueField.name})) {
    throw mockConflictError('${uniqueField.name}', '${uniqueField.label} already exists, please use another');
  }`
      : '';

  const validationImport = features.bulkUpload
    ? `import {\n  BULK_${names.entity.toUpperCase()}_EXAMPLE,\n  BULK_${names.entity.toUpperCase()}_HEADERS,\n  validateBulk${names.entity}Row,\n} from '../validation/${names.camel}BulkValidation';\n`
    : '';
  const excelImport =
    features.export || features.bulkUpload
      ? `import { XLSX_MIME, buildWorkbook${features.bulkUpload ? ', readWorkbookRows' : ''} } from '${names.sharedPrefix}shared/utils';\n`
      : '';

  return `import type {
  ${typeImports.join(',\n  ')},
} from '../types';
import type { ApiList } from '${names.sharedPrefix}shared/types';
${excelImport}${validationImport}
export const USE_MOCK = {

```

---

## Assistant (Build · Muse Spark 1.3 Free · 3.9s)

**Tool: bash**

**Input:**
```json
{
  "command": "grep -n \"mockFlags\" src/modules/generator/templates/crud/api.ts | head -3; sed -n '174,200p' src/modules/generator/templates/crud/api.ts",
  "workdir": "/Users/nazmudinalkhamil/Documents/Projects/generator-module-app"
}
```

**Output:**
```
228:  const mockFlags = [
303:${mockFlags}
}

export async function restore${names.entity}(id: string): Promise<${names.mutationResult}> {
  const body = await sendJson<Envelope<ApiDetail<${names.entity}>>>(\`\${BASE}/restore/\${encodeURIComponent(id)}\`, 'POST');
  return {
    message: body.response_schema?.response_message ?? '',
    data: body.response_output!.detail,
  };
}
${optionsFns ? `\n${optionsFns}\n` : ''}${loadFns ? `\n${loadFns}\n` : ''}${
    features.export
      ? `
export async function export${names.entityPlural}(params?: ${names.params}): Promise<Blob> {
  const query = params ? toQuery(params as Record<string, unknown>) : '';
  return getBlob(\`\${BASE}/export\${query ? \`?\${query}\` : ''}\`);
}
`
      : ''
  }${
    features.bulkUpload
      ? `
export async function bulkUpload${names.entityPlural}(file: File | ArrayBuffer): Promise<BulkUploadResult> {
  const form = new FormData();
  form.append('file', file instanceof ArrayBuffer ? new Blob([file]) : file);
  const res = await fetch(\`\${BASE}/bulk-upload\`, { method: 'POST', body: form });
  if (!res.ok) await throwForStatus(res);
  return (await res.json()) as BulkUploadResult;

```

---

## Assistant (Build · Muse Spark 1.3 Free · 4.8s)

_Thinking:_



**Tool: bash**

**Input:**
```json
{
  "command": "sed -n '225,245p' src/modules/generator/templates/crud/api.ts",
  "workdir": "/Users/nazmudinalkhamil/Documents/Projects/generator-module-app"
}
```

**Output:**
```
    ...fields.filter((f) => f.config.type === 'formArrayField').map((f) => rowTypeName(f)),
  ];

  const mockFlags = [
    '  list: true,',
    '  detail: true,',
    '  create: true,',
    '  update: true,',
    '  delete: true,',
    '  restore: true,',
    ...optionsSelects(ctx).map((f) => `  ${f.name}Options: true,`),
    ...loadSelects(ctx).map((f) => `  ${f.name}LoadOptions: true,`),
    ...(features.export ? ['  export: true,'] : []),
    ...(features.bulkUpload ? ['  bulkUpload: true,', '  bulkTemplate: true,'] : []),
  ].join('\n');

  const optionsConsts = optionsSelects(ctx).map(mockOptionsConst).join('\n\n');
  const loadFns = [...loadSelects(ctx), ...arraySubLoadModels(fields)]
    .map(mockLoadOptionsFn)
    .join('\n\n');


```

---

## Assistant (Build · Muse Spark 1.3 Free · 4.7s)

_Thinking:_



_Thinking:_



**Tool: write**

**Input:**
```json
{
  "content": "import axios from 'axios';\n\nconst baseURL = import.meta.env.VITE_API_BASE_URL || '';\n\nexport const AUTH_STORAGE_KEYS = {\n  token: 'auth_token',\n  user: 'auth_user',\n  permissions: 'permissions',\n  deviceId: 'device_id',\n} as const;\n\nexport function clearAuthStorage() {\n  Object.values(AUTH_STORAGE_KEYS).forEach((key) => {\n    if (key !== AUTH_STORAGE_KEYS.deviceId) localStorage.removeItem(key);\n  });\n}\n\nconst api = axios.create({\n  baseURL,\n  headers: { 'Content-Type': 'application/json' },\n  timeout: 60000,\n});\n\napi.interceptors.request.use((config) => {\n  if (!config.headers.Authorization) {\n    const token = localStorage.getItem(AUTH_STORAGE_KEYS.token);\n    if (token) {\n      config.headers.Authorization = `Bearer ${token}`;\n    }\n  }\n  return config;\n});\n\napi.interceptors.response.use(\n  (response) => response,\n  async (error) => {\n    const url = error.config?.url as string | undefined;\n    const isLoginRequest = url === '/api/v1/auth/login';\n\n    if (isLoginRequest && error.response?.data) {\n      return Promise.reject(error.response.data);\n    }\n\n    if (!error.response) {\n      return Promise.reject(error);\n    }\n\n    if (error.response.status === 403) {\n      const message = (\n        error.response.data as { response_schema?: { response_message?: string } } | undefined\n      )?.response_schema?.response_message;\n      window.dispatchEvent(new CustomEvent('api-forbidden', { detail: { message } }));\n      return Promise.reject(error);\n    }\n\n    return Promise.reject(error);\n  },\n);\n\nexport default api;\n",
  "filePath": "/Users/nazmudinalkhamil/Documents/Projects/generator-module-app/src/shared/lib/api.ts"
}
```

**Output:**
```
Wrote file successfully.
```

---

## Assistant (Build · Muse Spark 1.3 Free · 4.3s)

_Thinking:_



**Tool: bash**

**Input:**
```json
{
  "command": "grep -rn \"shared/lib\" src --include='*.tsx' --include='*.ts' | head -4; ls src/shared/lib/",
  "workdir": "/Users/nazmudinalkhamil/Documents/Projects/generator-module-app"
}
```

**Output:**
```
src/App.tsx:5:import { queryClient } from './shared/lib/queryClient';
api.ts
queryClient.ts

```

---

## Assistant (Build · Muse Spark 1.3 Free · 13.1s)

_Thinking:_

Rewriting a fetch-based service template to axios REST calls with typed endpoints and response handling.

_Thinking:_



**Tool: bash**

**Input:**
```json
{
  "command": "cd /Users/nazmudinalkhamil/Documents/Projects/generator-module-app && python3 - <<'PYEOF'\np = 'src/modules/generator/templates/crud/api.ts'\ns = open(p).read()\nstart = s.index('export function serviceTemplate(ctx: TemplateContext): string {')\nend = s.index('export function mockTemplate(ctx: TemplateContext): string {')\nnew_fn = '''export function serviceTemplate(ctx: TemplateContext): string {\n  const { names, features } = ctx;\n  const base = `/api/v1/${names.pluralKebab}`;\n  const typeImports = [\n    names.entity,\n    names.mutationResult,\n    ...(features.bulkUpload ? ['BulkUploadResult'] : []),\n    names.payload,\n    names.params,\n    names.listItem,\n    ...optionsSelects(ctx).map((f) => f.optionType),\n    ...loadSelects(ctx).map((f) => f.optionType),\n    ...arraySubLoadModels(ctx.fields).map((m) => m.optionType),\n  ];\n\n  const optionsFns = optionsSelects(ctx)\n    .map((f) => {\n      const mapping = optionMapping(f);\n      const shape = mapping ? 'Record<string, unknown>' : f.optionType;\n      const body = mapping\n        ? `const content = res.data.response_output?.list.content ?? [];\\\\n  return content.map(${mapping});`\n        : `return res.data.response_output?.list.content ?? [];`;\n      return `export async function get${f.pascal}Options(): Promise<${f.optionType}[]> {\n  const res = await api.get<ApiResponse<ApiList<${shape}>>>('${optionsEndpoint(ctx, f)}');\n  ${body}\n}`;\n    })\n    .join('\\\\n\\\\n');\n\n  const loadFns = [...loadSelects(ctx), ...arraySubLoadModels(ctx.fields)]\n    .map((f) => {\n      const mapping = optionMapping(f);\n      const shape = mapping ? 'Record<string, unknown>' : f.optionType;\n      const body = mapping\n        ? `const content = res.data.response_output?.list.content ?? [];\\\\n  return content.map(${mapping});`\n        : `return res.data.response_output?.list.content ?? [];`;\n      return `export async function ${f.loadOptionsFn}(\n  search = '',\n  page = 1,\n  size = 20,\n): Promise<${f.optionType}[]> {\n  const res = await api.get<ApiResponse<ApiList<${shape}>>>('${optionsEndpoint(ctx, f)}', {\n    params: { search, page, size },\n  });\n  ${body}\n}`;\n    })\n    .join('\\\\n\\\\n');\n\n  return `import api from '${names.sharedPrefix}shared/lib/api';\nimport type {\n  ${typeImports.join(',\\\\n  ')},\n} from '../types';\nimport type { ApiDetail, ApiList, ApiResponse } from '${names.sharedPrefix}shared/types';\n\nexport async function get${names.entityPlural}(params?: ${names.params}): Promise<ApiList<${names.listItem}}> {\n  const res = await api.get<ApiResponse<ApiList<${names.listItem}>>>('${base}', { params });\n  return res.data.response_output ?? { list: { pagination: null, content: [] } };\n}\n\nexport async function get${names.entity}ById(id: string): Promise<${names.entity}> {\n  const res = await api.get<ApiResponse<ApiDetail<${names.entity}>>>(\\\\`${base}/\\\\${id}\\\\`);\n  return res.data.response_output!.detail;\n}\n\nexport async function create${names.entity}(data: ${names.payload}): Promise<${names.mutationResult}> {\n  const res = await api.post<ApiResponse<ApiDetail<${names.entity}>>>('${base}', data);\n  return {\n    message: res.data.response_schema.response_message,\n    data: res.data.response_output!.detail,\n  };\n}\n\nexport async function update${names.entity}(\n  id: string,\n  data: ${names.payload},\n): Promise<${names.mutationResult}> {\n  const res = await api.put<ApiResponse<ApiDetail<${names.entity}>>>(\\\\`${base}/\\\\${id}\\\\`, data);\n  return {\n    message: res.data.response_schema.response_message,\n    data: res.data.response_output!.detail,\n  };\n}\n\nexport async function delete${names.entity}(id: string): Promise<{ message: string }> {\n  const res = await api.delete<ApiResponse<null>>(\\\\`${base}/\\\\${id}\\\\`);\n  return { message: res.data.response_schema.response_message };\n}\n\nexport async function restore${names.entity}(id: string): Promise<${names.mutationResult}> {\n  const res = await api.patch<ApiResponse<ApiDetail<${names.entity}>>>(\\\\`${base}/\\\\${id}/restore\\\\`);\n  return {\n    message: res.data.response_schema.response_message,\n    data: res.data.response_output!.detail,\n  };\n}\n${optionsFns ? `\\\\n${optionsFns}\\\\n` : ''}${loadFns ? `\\\\n${loadFns}\\\\n` : ''}${\n    features.export\n      ? `\nexport async function export${names.entityPlural}(params?: ${names.params}): Promise<Blob> {\n  const res = await api.get('${base}/export', { params, responseType: 'blob' });\n  return res.data as Blob;\n}\n`\n      : ''\n  }${\n    features.bulkUpload\n      ? `\nexport async function bulkUpload${names.entityPlural}(file: File): Promise<BulkUploadResult> {\n  const form = new FormData();\n  form.append('file', file);\n  const res = await api.post<ApiResponse<BulkUploadResult>>('${base}/bulk-upload', form);\n  return res.data.response_output!;\n}\n\nexport async function download${names.entity}Template(): Promise<Blob> {\n  const res = await api.get('${base}/bulk-template', { responseType: 'blob' });\n  return res.data as Blob;\n}\n`\n      : ''\n  }`;\n}\n\n'''\ns = s[:start] + new_fn + s[end:]\nopen(p, 'w').write(s)\nprint('service template rewritten')\nPYEOF\nnpm run lint 2>&1 | tail -2"
}
```

**Output:**
```
service template rewritten

src/modules/generator/templates/crud/api.ts:2:10: warning eslint(no-unused-vars): Identifier 'toKebabCase' is imported but never used. help: Consider removing this import.

```

---

## Assistant (Build · Muse Spark 1.3 Free · 5.0s)

_Thinking:_



**Tool: edit**

**Input:**
```json
{
  "filePath": "/Users/nazmudinalkhamil/Documents/Projects/generator-module-app/src/modules/generator/templates/crud/api.ts",
  "newString": "import type { TemplateContext } from '../../engine/context';\nimport { arraySubLoadModels, rowTypeName, tsDataType } from '../../engine/fieldGenerator';",
  "oldString": "import type { TemplateContext } from '../../engine/context';\nimport { toKebabCase } from '../../naming';\nimport { arraySubLoadModels, rowTypeName, tsDataType } from '../../engine/fieldGenerator';"
}
```

**Output:**
```
Edit applied successfully.
```

---

## Assistant (Build · Muse Spark 1.3 Free · 7.0s)

**Tool: bash**

**Input:**
```json
{
  "command": "cd /Users/nazmudinalkhamil/Documents/Projects/generator-module-app && python3 - <<'PYEOF'\np = 'src/modules/generator/templates/crud/api.ts'\ns = open(p).read()\nstart = s.index('/**\\n * API resolver')\n# find resolver function start more robustly\nidx = s.index('export function resolverTemplate(ctx: TemplateContext): string {')\n# include preceding doc comment\ncstart = s.rindex('/**', 0, idx)\nend = s.index('export function queriesTemplate(ctx: TemplateContext): string {')\nprint('old resolver block chars:', end - cstart)\nnew_fn = '''/**\n * API resolver — saklar sumber data modul ini per operasi.\n * `USE_MOCK` (di `mock.ts`, default semua `true` = mock lokal tanpa backend):\n * ubah flag yang relevan menjadi `false` untuk memakai Real API via `service.ts`.\n * Nama export sama untuk kedua sumber, jadi `queries.ts`/`mutations.ts`\n * tidak perlu berubah.\n */\nexport function resolverTemplate(ctx: TemplateContext): string {\n  const { names, features } = ctx;\n  const ops: [string, string][] = [\n    ['list', `get${names.entityPlural}`, `mockGet${names.entityPlural}`],\n    ['detail', `get${names.entity}ById`, `mockGet${names.entity}ById`],\n    ['create', `create${names.entity}`, `mockCreate${names.entity}`],\n    ['update', `update${names.entity}`, `mockUpdate${names.entity}`],\n    ['delete', `delete${names.entity}`, `mockDelete${names.entity}`],\n    ['restore', `restore${names.entity}`, `mockRestore${names.entity}`],\n  ];\n  if (features.export) {\n    ops.push(['export', `export${names.entityPlural}`, `mockExport${names.entityPlural}`]);\n  }\n  if (features.bulkUpload) {\n    ops.push(['bulkUpload', `bulkUpload${names.entityPlural}`, `mockBulkUpload${names.entityPlural}`]);\n    ops.push(['bulkTemplate', `download${names.entity}Template`, `mockDownload${names.entity}Template`]);\n  }\n  for (const f of optionsSelects(ctx)) {\n    ops.push([`${f.name}Options`, `get${f.pascal}Options`, `mockGet${f.pascal}Options`]);\n  }\n  for (const f of loadSelects(ctx)) {\n    ops.push([`${f.name}LoadOptions`, f.loadOptionsFn, f.loadOptionsFn]);\n  }\n  for (const f of arraySubLoadModels(ctx.fields)) {\n    ops.push([`${f.name}LoadOptions`, f.loadOptionsFn, f.loadOptionsFn]);\n  }\n  const lines = ops.map(\n    ([flag, name, mockName]) => `export const ${name} = USE_MOCK.${flag} ? ${mockName} : service.${name};`,\n  );\n  const mockImports = ops.map(([, , mockName]) => mockName).join(',\\\\n  ');\n  return `import { USE_MOCK,\\\\n  ${mockImports},\\\\n} from './mock';\nimport * as service from './service';\n\n${lines.join('\\\\n')}\n`;\n}\n\n'''\ns = s[:cstart] + new_fn + s[end:]\nopen(p, 'w').write(s)\nprint('resolver template rewritten')\nPYEOF\nnpm run lint 2>&1 | tail -2"
}
```

**Output:**
```
old resolver block chars: 2194
resolver template rewritten
> oxlint src vite.config.ts


```

---

## Assistant (Build · Muse Spark 1.3 Free · 4.7s)

_Thinking:_



**Tool: bash**

**Input:**
```json
{
  "command": "grep -n \"arraySubLoadModels\" -A 12 src/modules/generator/engine/fieldGenerator.ts | head -16",
  "workdir": "/Users/nazmudinalkhamil/Documents/Projects/generator-module-app"
}
```

**Output:**
```
550:export function arraySubLoadModels(fields: FieldModel[]): FieldModel[] {
551-  return fields
552-    .filter((f) => f.config.type === 'formArrayField')
553-    .flatMap((f) => arraySubs(f).map((sub) => subFieldModel(f, sub)))
554-    .filter((model) => model.isLoadOptions);
555-}
556-
557-function isSubOptionType(type: string): boolean {
558-  return (
559-    type === 'selectField' ||
560-    type === 'selectMultipleField' ||
561-    type === 'radioGroupField' ||
562-    type === 'checkboxGroupField'

```

---

## Assistant (Build · Muse Spark 1.3 Free · 9.0s)

**Tool: bash**

**Input:**
```json
{
  "command": "cd /Users/nazmudinalkhamil/Documents/Projects/generator-module-app && python3 - <<'PYEOF'\np = 'src/modules/generator/templates/crud/api.ts'\ns = open(p).read()\no = \"\"\"    ...optionsSelects(ctx).map((f) => `  ${f.name}Options: true,`),\n    ...loadSelects(ctx).map((f) => `  ${f.name}LoadOptions: true,`),\"\"\"\nassert o in s\ns = s.replace(o, \"\"\"    ...optionsSelects(ctx).map((f) => `  ${f.name}Options: true,`),\n    ...loadSelects(ctx).map((f) => `  ${f.name}LoadOptions: true,`),\n    ...arraySubLoadModels(ctx.fields).map((f) => `  ${f.name}LoadOptions: true,`),\"\"\")\nopen(p, 'w').write(s)\nprint('mock flags extended')\nPYEOF\nnpm run verify:generator 2>&1 | tail -2"
}
```

**Output:**
```
mock flags extended
src/modules/verifygen-tmp/api/service.ts(14,81): error TS1005: ',' expected.


```

---

## Assistant (Build · Muse Spark 1.3 Free · 8.2s)

**Tool: bash**

**Input:**
```json
{
  "command": "node --input-type=module -e \"\nimport { createJiti } from 'jiti';\nimport { writeFileSync } from 'node:fs';\nconst ROOT = '/Users/nazmudinalkhamil/Documents/Projects/generator-module-app';\nconst jiti = createJiti(import.meta.url);\nconst mg = jiti(ROOT + '/src/modules/generator/engine/moduleGenerator.ts');\nconst config = {\n  parentName: null, moduleName: 'SvcT', type: 'crud', permissionKey: 'svct',\n  features: { list: true },\n  fields: [{ name: 'nama', label: 'Nama', type: 'textField', rules: [], source: 'none' }],\n};\nconst files = mg.generateModule(config);\nconst f = files.find((x) => x.path.includes('api/service'));\nwriteFileSync('/tmp/svcx.ts', f.content);\n\" && sed -n '1,20p' /tmp/svcx.ts",
  "workdir": "/Users/nazmudinalkhamil/Documents/Projects/generator-module-app"
}
```

**Output:**
```
import api from '../../../shared/lib/api';
import type {
  SvcT,
  SvcTMutationResult,
  CreateSvcTPayload,
  GetSvcTsParams,
  SvcTListItem,
} from '../types';
import type { ApiDetail, ApiList, ApiResponse } from '../../../shared/types';

export async function getSvcTs(params?: GetSvcTsParams): Promise<ApiList<SvcTListItem}> {
  const res = await api.get<ApiResponse<ApiList<SvcTListItem>>>('/api/v1/svc-ts', { params });
  return res.data.response_output ?? { list: { pagination: null, content: [] } };
}

export async function getSvcTById(id: string): Promise<SvcT> {
  const res = await api.get<ApiResponse<ApiDetail<SvcT>>>(`/api/v1/svc-ts/${id}`);
  return res.data.response_output!.detail;
}


```

---

## Assistant (Build · Muse Spark 1.3 Free · 9.8s)

_Thinking:_



**Tool: bash**

**Input:**
```json
{
  "command": "cat > /tmp/triple.ts <<'EOF'\ninterface ApiResponse<T> { d: T }\ninterface ApiList<T> { l: T }\ninterface Item { a: string }\ndeclare const api: { get<T>(u: string, o?: unknown): Promise<{ data: T }> };\nexport async function f(): Promise<void> {\n  const res = await api.get<ApiResponse<ApiList<Item>>>('/x', {});\n  console.log(res.data);\n}\nEOF\nnpx tsc --ignoreConfig --noEmit --strict --skipLibCheck --lib es2023,dom --target es2023 --moduleResolution bundler --module esnext /tmp/triple.ts 2>&1 | head -4; echo \"exit: $?\"; node -e \"console.log(require('/Users/nazmudinalkhamil/Documents/Projects/generator-module-app/node_modules/typescript/package.json').version)\"",
  "workdir": "/Users/nazmudinalkhamil/Documents/Projects/generator-module-app"
}
```

**Output:**
```
exit: 0
6.0.3

```

---

## Assistant (Build · Muse Spark 1.3 Free · 7.6s)

_Thinking:_



**Tool: bash**

**Input:**
```json
{
  "command": "npx tsc --ignoreConfig --noEmit --strict --skipLibCheck --lib es2023,dom --target es2023 --moduleResolution bundler --module esnext --jsx react-jsx /tmp/svcx.ts 2>&1 | head -8; echo \"exit: $?\"",
  "workdir": "/Users/nazmudinalkhamil/Documents/Projects/generator-module-app"
}
```

**Output:**
```
../../../../../tmp/svcx.ts(11,86): error TS1005: '>' expected.
../../../../../tmp/svcx.ts(11,87): error TS1109: Expression expected.
../../../../../tmp/svcx.ts(12,9): error TS1005: ':' expected.
../../../../../tmp/svcx.ts(12,94): error TS1005: ',' expected.
../../../../../tmp/svcx.ts(13,10): error TS1005: ':' expected.
../../../../../tmp/svcx.ts(13,81): error TS1005: ',' expected.
exit: 0

```

---

## Assistant (Build · Muse Spark 1.3 Free · 9.1s)

_Thinking:_



**Tool: bash**

**Input:**
```json
{
  "command": "cat > /tmp/sig.ts <<'EOF'\ninterface ApiList<T> { l: T }\ninterface SvcTListItem { a: string }\ninterface GetSvcTsParams { x?: string }\nexport async function getSvcTs(params?: GetSvcTsParams): Promise<ApiList<SvcTListItem>> {\n  return { l: [] as SvcTListItem[] } as ApiList<SvcTListItem>;\n}\nEOF\nnpx tsc --ignoreConfig --noEmit --strict --skipLibCheck --lib es2023,dom --target es2023 --moduleResolution bundler --module esnext /tmp/sig.ts 2>&1 | head -4; echo \"exit: $?\"; sed -n '11p' /tmp/svcx.ts | od -c | tail -3",
  "workdir": "/Users/nazmudinalkhamil/Documents/Projects/generator-module-app"
}
```

**Output:**
```
../../../../../tmp/sig.ts(5,10): error TS2352: Conversion of type '{ l: SvcTListItem[]; }' to type 'ApiList<SvcTListItem>' may be a mistake because neither type sufficiently overlaps with the other. If this was intentional, convert the expression to 'unknown' first.
  Types of property 'l' are incompatible.
    Property 'a' is missing in type 'SvcTListItem[]' but required in type 'SvcTListItem'.
exit: 0
0000100    <   A   p   i   L   i   s   t   <   S   v   c   T   L   i   s
0000120    t   I   t   e   m   }   >       {  \n                        
0000132

```

---

## Assistant (Build · Muse Spark 1.3 Free · 10.9s)

_Thinking:_



_Thinking:_



**Tool: bash**

**Input:**
```json
{
  "command": "cd /Users/nazmudinalkhamil/Documents/Projects/generator-module-app && python3 - <<'PYEOF'\np = 'src/modules/generator/templates/crud/api.ts'\ns = open(p).read()\no = 'Promise<ApiList<${names.listItem}} >'\nassert s.count(o) == 1, s.count(o)\ns = s.replace(o, 'Promise<ApiList<${names.listItem}}>>')\n# verify no other interpolation-then-brace anomalies in new code\nimport re\nfor m in re.finditer(r\"\\$\\{[a-zA-Z0-9_.]+\\}\\}(?=[\\s>,);])\", s):\n    print('CHECK:', repr(s[max(0,m.start()-50):m.end()+12]))\nopen(p, 'w').write(s)\nprint('fixed')\nPYEOF\nnpm run verify:generator 2>&1 | tail -2"
}
```

**Output:**
```
Traceback (most recent call last):
  File "<stdin>", line 4, in <module>
AssertionError: 0
src/modules/verifygen-tmp/api/service.ts(14,81): error TS1005: ',' expected.


```

---

## Assistant (Build · Muse Spark 1.3 Free · 5.4s)

_Thinking:_



**Tool: bash**

**Input:**
```json
{
  "command": "python3 - <<'PYEOF'\ns = open('src/modules/generator/templates/crud/api.ts').read()\ni = s.index('export async function get${names.entityPlural}')\nprint(repr(s[i:i+140]))\nPYEOF",
  "workdir": "/Users/nazmudinalkhamil/Documents/Projects/generator-module-app"
}
```

**Output:**
```
'export async function get${names.entityPlural}(params?: ${names.params}): Promise<ApiList<${names.listItem}}> {\n  const res = await api.get<'

```

---

## Assistant (Build · Muse Spark 1.3 Free · 18.1s)

_Thinking:_

Investigating a jiti cache invalidation mismatch between template source and emitted output.

_Thinking:_

Pinpointing a stray brace in the emitted type string from the naming context.

_Thinking:_



**Tool: bash**

**Input:**
```json
{
  "command": "cd /Users/nazmudinalkhamil/Documents/Projects/generator-module-app && python3 - <<'PYEOF'\np = 'src/modules/generator/templates/crud/api.ts'\ns = open(p).read()\no = '): Promise<ApiList<${names.listItem}}> {'\nassert s.count(o) == 1, s.count(o)\ns = s.replace(o, '): Promise<ApiList<${names.listItem}>> {')\nopen(p, 'w').write(s)\nprint('fixed missing bracket')\nPYEOF\nnpm run verify:generator 2>&1 | tail -2"
}
```

**Output:**
```
fixed missing bracket
  Source has 3 element(s) but target allows only 2.
src/modules/generator/templates/crud/api.ts(536,14): error TS2345: Argument of type '[string, string, string]' is not assignable to parameter of type '[string, string]'.

```

---

## Assistant (Build · Muse Spark 1.3 Free · 4.5s)

_Thinking:_



**Tool: edit**

**Input:**
```json
{
  "filePath": "/Users/nazmudinalkhamil/Documents/Projects/generator-module-app/src/modules/generator/templates/crud/api.ts",
  "newString": "  const ops: [string, string, string][] = [",
  "oldString": "  const ops: [string, string][] = ["
}
```

**Output:**
```
Edit applied successfully.
```

---

## Assistant (Build · Muse Spark 1.3 Free · 29.7s)

**Tool: bash**

**Input:**
```json
{
  "command": "npm run verify:generator 2>&1 | tail -2 && npm run lint 2>&1 | tail -1 && npm run build 2>&1 | grep -E \"error TS|✓ built\" | head -3",
  "workdir": "/Users/nazmudinalkhamil/Documents/Projects/generator-module-app"
}
```

**Output:**
```
src/modules/generator/templates/crud/api.ts(74,64): error TS2304: Cannot find name 'optionsEndpoint'.


src/modules/generator/templates/crud/api.ts(56,64): error TS2304: Cannot find name 'optionsEndpoint'.
src/modules/generator/templates/crud/api.ts(74,64): error TS2304: Cannot find name 'optionsEndpoint'.

```

---

## Assistant (Build · Muse Spark 1.3 Free · 5.3s)

_Thinking:_



**Tool: edit**

**Input:**
```json
{
  "filePath": "/Users/nazmudinalkhamil/Documents/Projects/generator-module-app/src/modules/generator/templates/crud/api.ts",
  "newString": "import {\n  mockFilterLine,\n  mockLoadOptionsFn,\n  mockOptionsConst,\n  mockRecordValue,\n  optionMapping,\n  optionsEndpoint,\n} from '../../engine/sourceGenerator';",
  "oldString": "import {\n  mockFilterLine,\n  mockLoadOptionsFn,\n  mockOptionsConst,\n  mockRecordValue,\n  optionMapping,\n} from '../../engine/sourceGenerator';"
}
```

**Output:**
```
Edit applied successfully.
```

---

## Assistant (Build · Muse Spark 1.3 Free · 20.5s)

**Tool: bash**

**Input:**
```json
{
  "command": "npm run verify:generator 2>&1 | tail -2 && npm run lint 2>&1 | tail -1 && npm run build 2>&1 | grep -E \"error TS|✓ built\" | head -3",
  "workdir": "/Users/nazmudinalkhamil/Documents/Projects/generator-module-app"
}
```

**Output:**
```
EMISSION PASS
COMPILE PASS (25 file)

✓ built in 750ms

```

---

## Assistant (Build · Muse Spark 1.3 Free · 8.9s)

_Thinking:_



_Thinking:_



**Tool: bash**

**Input:**
```json
{
  "command": "cd /Users/nazmudinalkhamil/Documents/Projects/generator-module-app && python3 - <<'PYEOF'\np = 'src/modules/generator/templates/crud/moduleIndex.ts'\ns = open(p).read()\no = \"\"\"## 5. API real (\\\\`api/service.ts\\\\`)\n\nSaklar sumber data ada di \\\\`api/resolver.ts\\\\` (\\\\`FORCE_REAL_API\\\\`, default \\\\`false\\\\` = mock\nlokal; override env via \\\\`VITE_USE_REAL_API=true\\\\`). Nama export resolver sama untuk\nmock maupun service, jadi \\\\`queries.ts\\\\`/\\\\`mutations.ts\\\\` tidak perlu berubah.\n\nKontrak endpoint standar \\\\`/api/[module]/[feature]\\\\`:\"\"\"\nassert o in s, 'integration anchor'\ns = s.replace(o, \"\"\"## 5. API real (\\\\`api/service.ts\\\\`)\n\nSaklar sumber data ada di \\\\`api/resolver.ts\\\\` via flag \\\\`USE_MOCK\\\\` (di \\\\`mock.ts\\\\`,\ndefault semua \\\\`true\\\\` = mock lokal tanpa backend): ubah flag yang relevan menjadi\n\\\\`false\\\\` untuk memakai Real API via \\\\`service.ts\\\\` (axios \\\\`shared/lib/api\\\\`).\nNama export resolver sama untuk kedua sumber, jadi \\\\`queries.ts\\\\`/\\\\`mutations.ts\\\\`\ntidak perlu berubah.\n\nKontrak endpoint (contoh module `${names.pluralKebab}`):\"\"\")\nreps = [\n  (\"| List | \\\\`GET /api/${names.pluralKebab}/list\\\\` | Query params sama seperti filter list; response \\\\`ApiList\\\\`. |\",\n   \"| List | \\\\`GET /api/v1/${names.pluralKebab}\\\\` | Query params sama seperti filter list; response \\\\`ApiList\\\\`. |\"),\n  (\"| Detail | \\\\`GET /api/${names.pluralKebab}/detail/:id\\\\` | Response entity. |\",\n   \"| Detail | \\\\`GET /api/v1/${names.pluralKebab}/:id\\\\` | Response entity. |\"),\n  (\"| Buat data | \\\\`POST /api/${names.pluralKebab}/create\\\\` | Body JSON payload; response \\\\`{ message, data }\\\\`. |\",\n   \"| Buat data | \\\\`POST /api/v1/${names.pluralKebab}\\\\` | Body JSON payload; response \\\\`{ message, data }\\\\`. |\"),\n  (\"| Ubah data | \\\\`PUT /api/${names.pluralKebab}/update/:id\\\\` | Body JSON payload; response \\\\`{ message, data }\\\\`. |\",\n   \"| Ubah data | \\\\`PUT /api/v1/${names.pluralKebab}/:id\\\\` | Body JSON payload; response \\\\`{ message, data }\\\\`. |\"),\n  (\"| Hapus (soft) | \\\\`POST /api/${names.pluralKebab}/delete/:id\\\\` | Response \\\\`{ message }\\\\`. |\",\n   \"| Hapus (soft) | \\\\`DELETE /api/v1/${names.pluralKebab}/:id\\\\` | Response \\\\`{ message }\\\\`. |\"),\n  (\"| Restore | \\\\`POST /api/${names.pluralKebab}/restore/:id\\\\` | Response \\\\`{ message, data }\\\\`. |\",\n   \"| Restore | \\\\`PATCH /api/v1/${names.pluralKebab}/:id/restore\\\\` | Response \\\\`{ message, data }\\\\`. |\"),\n  (\"| Export | \\\\`GET /api/${names.pluralKebab}/export\\\\` |\",\n   \"| Export | \\\\`GET /api/v1/${names.pluralKebab}/export\\\\` |\"),\n  (\"| Bulk upload | \\\\`POST /api/${names.pluralKebab}/bulk-upload\\\\` |\",\n   \"| Bulk upload | \\\\`POST /api/v1/${names.pluralKebab}/bulk-upload\\\\` |\"),\n  (\"| Template bulk | \\\\`GET /api/${names.pluralKebab}/template\\\\` |\",\n   \"| Template bulk | \\\\`GET /api/v1/${names.pluralKebab}/bulk-template\\\\` |\"),\n  (\"| Opsi field | \\\\`GET /api/${names.pluralKebab}/options/:field?search=&page=&size=\\\\` |\",\n   \"| Opsi field | \\\\`GET\\\\` endpoint per field (lihat \\\\`service.ts\\\\`) |\"),\n  (\"Error mengikuti envelope axios-like\",\n   \"Error mengikuti envelope axios\"),\n]\nfor o, n in reps:\n    assert o in s, 'MISS doc: ' + o[:60]\n    s = s.replace(o, n)\nopen(p, 'w').write(s)\nprint('integration docs updated')\nPYEOF\nnpm run verify:generator 2>&1 | tail -2"
}
```

**Output:**
```
...output truncated...

Full output saved to: /Users/nazmudinalkhamil/.local/share/opencode/tool-output/tool_105a5e4dd001wld1ssO64yUgii

ৱৼਅ-ਊਏਐਓ-ਨਪ-ਰਲਲ਼ਵਸ਼ਸਹਖ਼-ੜਫ਼ੲ-ੴઅ-ઍએ-ઑઓ-નપ-રલળવ-હઽૐૠૡૹଅ-ଌଏଐଓ-ନପ-ରଲଳଵ-ହଽଡ଼ଢ଼ୟ-ୡୱஃஅ-ஊஎ-ஐஒ-கஙசஜஞடணதந-பம-ஹௐఅ-ఌఎ-ఐఒ-నప-హఽౘ-ౚ౜ౝౠౡಀಅ-ಌಎ-ಐಒ-ನಪ-ಳವ-ಹಽ೜-ೞೠೡೱೲഄ-ഌഎ-ഐഒ-ഺഽൎൔ-ൖൟ-ൡൺ-ൿඅ-ඖක-නඳ-රලව-ෆก-ะาำเ-ๆກຂຄຆ-ຊຌ-ຣລວ-ະາຳຽເ-ໄໆໜ-ໟༀཀ-ཇཉ-ཬྈ-ྌက-ဪဿၐ-ၕၚ-ၝၡၥၦၮ-ၰၵ-ႁႎႠ-ჅჇჍა-ჺჼ-ቈቊ-ቍቐ-ቖቘቚ-ቝበ-ኈኊ-ኍነ-ኰኲ-ኵኸ-ኾዀዂ-ዅወ-ዖዘ-ጐጒ-ጕጘ-ፚᎀ-ᎏᎠ-Ᏽᏸ-ᏽᐁ-ᙬᙯ-ᙿᚁ-ᚚᚠ-ᛪᛮ-ᛸᜀ-ᜑᜟ-ᜱᝀ-ᝑᝠ-ᝬᝮ-ᝰក-ឳៗៜᠠ-ᡸᢀ-ᢨᢪᢰ-ᣵᤀ-ᤞᥐ-ᥭᥰ-ᥴᦀ-ᦫᦰ-ᧉᨀ-ᨖᨠ-ᩔᪧᬅ-ᬳᭅ-ᭌᮃ-ᮠᮮᮯᮺ-ᯥᰀ-ᰣᱍ-ᱏᱚ-ᱽᲀ-ᲊᲐ-ᲺᲽ-Ჿᳩ-ᳬᳮ-ᳳᳵᳶᳺᴀ-ᶿḀ-ἕἘ-Ἕἠ-ὅὈ-Ὅὐ-ὗὙὛὝὟ-ώᾀ-ᾴᾶ-ᾼιῂ-ῄῆ-ῌῐ-ΐῖ-Ίῠ-Ῥῲ-ῴῶ-ῼⁱⁿₐ-ₜℂℇℊ-ℓℕ℘-ℝℤΩℨK-ℹℼ-ℿⅅ-ⅉⅎⅠ-ↈⰀ-ⳤⳫ-ⳮⳲⳳⴀ-ⴥⴧⴭⴰ-ⵧⵯⶀ-ⶖⶠ-ⶦⶨ-ⶮⶰ-ⶶⶸ-ⶾⷀ-ⷆⷈ-ⷎⷐ-ⷖⷘ-ⷞ々-〇〡-〩〱-〵〸-〼ぁ-ゖ゛-ゟァ-ヺー-ヿㄅ-ㄯㄱ-ㆎㆠ-ㆿㇰ-ㇿ㐀-䶿一-ꒌꓐ-ꓽꔀ-ꘌꘐ-ꘟꘪꘫꙀ-ꙮꙿ-ꚝꚠ-ꛯꜗ-ꜟꜢ-ꞈꞋ-Ƛ꟱-ꠁꠃ-ꠅꠇ-ꠊꠌ-ꠢꡀ-ꡳꢂ-ꢳꣲ-ꣷꣻꣽꣾꤊ-ꤥꤰ-ꥆꥠ-ꥼꦄ-ꦲꧏꧠ-ꧤꧦ-ꧯꧺ-ꧾꨀ-ꨨꩀ-ꩂꩄ-ꩋꩠ-ꩶꩺꩾ-ꪯꪱꪵꪶꪹ-ꪽꫀꫂꫛ-ꫝꫠ-ꫪꫲ-ꫴꬁ-ꬆꬉ-ꬎꬑ-ꬖꬠ-ꬦꬨ-ꬮꬰ-ꭚꭜ-ꭩꭰ-ꯢ가-힣ힰ-ퟆퟋ-ퟻ豈-舘並-龎ﬀ-ﬆﬓ-ﬗיִײַ-ﬨשׁ-זּטּ-לּמּנּסּףּפּצּ-ﮱﯓ-ﴽﵐ-ﶏﶒ-ﷇﷰ-ﷻﹰ-ﹴﹶ-ﻼＡ-Ｚａ-ｚｦ-ﾾￂ-ￇￊ-ￏￒ-ￗￚ-ￜ",c={3:"abstract boolean byte char class double enum export extends final float goto implements import int interface long native package private protected public short static super synchronized throws transient volatile",5:"class enum extends super const export import",6:"enum",strict:"implements interface let package private protected public static yield",strictBind:"eval arguments"},l="break case catch continue debugger default do else finally for function if return switch throw try var while with null true false instanceof typeof void delete new in this",y={5:l,"5module":l+" export import",6:l+" const class extends export import super"},E=/^in(stanceof)?$/,w=new RegExp("["+a+"]"),C=new RegExp("["+a+"‌‍·̀-ͯ·҃-֑҇-ׇֽֿׁׂׅׄؐ-ًؚ-٩ٰۖ-ۜ۟-۪ۤۧۨ-ۭ۰-۹ܑܰ-݊ަ-ް߀-߉߫-߽߳ࠖ-࠙ࠛ-ࠣࠥ-ࠧࠩ-࡙࠭-࡛ࢗ-࢟࣊-ࣣ࣡-ःऺ-़ा-ॏ॑-ॗॢॣ०-९ঁ-ঃ়া-ৄেৈো-্ৗৢৣ০-৯৾ਁ-ਃ਼ਾ-ੂੇੈੋ-੍ੑ੦-ੱੵઁ-ઃ઼ા-ૅે-ૉો-્ૢૣ૦-૯ૺ-૿ଁ-ଃ଼ା-ୄେୈୋ-୍୕-ୗୢୣ୦-୯ஂா-ூெ-ைொ-்ௗ௦-௯ఀ-ఄ఼ా-ౄె-ైొ-్ౕౖౢౣ౦-౯ಁ-ಃ಼ಾ-ೄೆ-ೈೊ-್ೕೖೢೣ೦-೯ೳഀ-ഃ഻഼ാ-ൄെ-ൈൊ-്ൗൢൣ൦-൯ඁ-ඃ්ා-ුූෘ-ෟ෦-෯ෲෳัิ-ฺ็-๎๐-๙ັິ-ຼ່-໎໐-໙༘༙༠-༩༹༵༷༾༿ཱ-྄྆྇ྍ-ྗྙ-ྼ࿆ါ-ှ၀-၉ၖ-ၙၞ-ၠၢ-ၤၧ-ၭၱ-ၴႂ-ႍႏ-ႝ፝-፟፩-፱ᜒ-᜕ᜲ-᜴ᝒᝓᝲᝳ឴-៓៝០-៩᠋-᠍᠏-᠙ᢩᤠ-ᤫᤰ-᤻᥆-᥏᧐-᧚ᨗ-ᨛᩕ-ᩞ᩠-᩿᩼-᪉᪐-᪙᪰-᪽ᪿ-᫝᫠-᫫ᬀ-ᬄ᬴-᭄᭐-᭙᭫-᭳ᮀ-ᮂᮡ-ᮭ᮰-᮹᯦-᯳ᰤ-᰷᱀-᱉᱐-᱙᳐-᳔᳒-᳨᳭᳴᳷-᳹᷀-᷿‌‍‿⁀⁔⃐-⃥⃜⃡-⃰⳯-⵿⳱ⷠ-〪ⷿ-゙゚〯・꘠-꘩꙯ꙴ-꙽ꚞꚟ꛰꛱ꠂ꠆ꠋꠣ-ꠧ꠬ꢀꢁꢴ-ꣅ꣐-꣙꣠-꣱ꣿ-꤉ꤦ-꤭ꥇ-꥓ꦀ-ꦃ꦳-꧀꧐-꧙ꧥ꧰-꧹ꨩ-ꨶꩃꩌꩍ꩐-꩙ꩻ-ꩽꪰꪲ-ꪴꪷꪸꪾ꪿꫁ꫫ-ꫯꫵ꫶ꯣ-ꯪ꯬꯭꯰-꯹ﬞ︀-️︠-︯︳︴﹍-﹏０-９＿･]");function isInAstralSet(e,t){for(var i=65536,n=0;n<t.length;n+=2){if((i+=t[n])>e)return!1;if((i+=t[n+1])>=e)return!0}return!1}function isIdentifierStart(e,t){return e<65?36===e:e<91||(e<97?95===e:e<123||(e<=65535?e>=170&&w.test(String.fromCharCode(e)):!1!==t&&isInAstralSet(e,n)))}function isIdentifierChar(e,i){return e<48?36===e:e<58||!(e<65)&&(e<91||(e<97?95===e:e<123||(e<=65535?e>=170&&C.test(String.fromCharCode(e)):!1!==i&&(isInAstralSet(e,n)||isInAstralSet(e,t)))))}var acorn_TokenType=function(e,t){void 0===t&&(t={}),this.label=e,this.keyword=t.keyword,this.beforeExpr=!!t.beforeExpr,this.startsExpr=!!t.startsExpr,this.isLoop=!!t.isLoop,this.isAssign=!!t.isAssign,this.prefix=!!t.prefix,this.postfix=!!t.postfix,this.binop=t.binop||null,this.updateContext=null};function binop(e,t){return new acorn_TokenType(e,{beforeExpr:!0,binop:t})}var S={beforeExpr:!0},I={startsExpr:!0},N={};function kw(e,t){return void 0===t&&(t={}),t.keyword=e,N[e]=new acorn_TokenType(e,t)}var O={num:new acorn_TokenType("num",I),regexp:new acorn_TokenType("regexp",I),string:new acorn_TokenType("string",I),name:new acorn_TokenType("name",I),privateId:new acorn_TokenType("privateId",I),eof:new acorn_TokenType("eof"),bracketL:new acorn_TokenType("[",{beforeExpr:!0,startsExpr:!0}),bracketR:new acorn_TokenType("]"),braceL:new acorn_TokenType("{",{beforeExpr:!0,startsExpr:!0}),braceR:new acorn_TokenType("}"),parenL:new acorn_TokenType("(",{beforeExpr:!0,startsExpr:!0}),parenR:new acorn_TokenType(")"),comma:new acorn_TokenType(",",S),semi:new acorn_TokenType(";",S),colon:new acorn_TokenType(":",S),dot:new acorn_TokenType("."),question:new acorn_TokenType("?",S),questionDot:new acorn_TokenType("?."),arrow:new acorn_TokenType("=>",S),template:new acorn_TokenType("template"),invalidTemplate:new acorn_TokenType("invalidTemplate"),ellipsis:new acorn_TokenType("...",S),backQuote:new acorn_TokenType("`",I),dollarBraceL:new acorn_TokenType("${",{beforeExpr:!0,startsExpr:!0}),eq:new acorn_TokenType("=",{beforeExpr:!0,isAssign:!0}),assign:new acorn_TokenType("_=",{beforeExpr:!0,isAssign:!0}),incDec:new acorn_TokenType("++/--",{prefix:!0,postfix:!0,startsExpr:!0}),prefix:new acorn_TokenType("!/~",{beforeExpr:!0,prefix:!0,startsExpr:!0}),logicalOR:binop("||",1),logicalAND:binop("&&",2),bitwiseOR:binop("|",3),bitwiseXOR:binop("^",4),bitwiseAND:binop("&",5),equality:binop("==/!=/===/!==",6),relational:binop("</>/<=/>=",7),bitShift:binop("<</>>/>>>",8),plusMin:new acorn_TokenType("+/-",{beforeExpr:!0,binop:9,prefix:!0,startsExpr:!0}),modulo:binop("%",10),star:binop("*",10),slash:binop("/",10),starstar:new acorn_TokenType("**",{beforeExpr:!0}),coalesce:binop("??",1),_break:kw("break"),_case:kw("case",S),_catch:kw("catch"),_continue:kw("continue"),_debugger:kw("debugger"),_default:kw("default",S),_do:kw("do",{isLoop:!0,beforeExpr:!0}),_else:kw("else",S),_finally:kw("finally"),_for:kw("for",{isLoop:!0}),_function:kw("function",I),_if:kw("if"),_return:kw("return",S),_switch:kw("switch"),_throw:kw("throw",S),_try:kw("try"),_var:kw("var"),_const:kw("const"),_while:kw("while",{isLoop:!0}),_with:kw("with"),_new:kw("new",{beforeExpr:!0,startsExpr:!0}),_this:kw("this",I),_super:kw("super",I),_class:kw("class",I),_extends:kw("extends",S),_export:kw("export"),_import:kw("import",I),_null:kw("null",I),_true:kw("true",I),_false:kw("false",I),_in:kw("in",{beforeExpr:!0,binop:7}),_instanceof:kw("instanceof",{beforeExpr:!0,binop:7}),_typeof:kw("typeof",{beforeExpr:!0,prefix:!0,startsExpr:!0}),_void:kw("void",{beforeExpr:!0,prefix:!0,startsExpr:!0}),_delete:kw("delete",{beforeExpr:!0,prefix:!0,startsExpr:!0})},j=/\r\n?|\n|\u2028|\u2029/,F=new RegExp(j.source,"g");function isNewLine(e){return 10===e||13===e||8232===e||8233===e}function nextLineBreak(e,t,i){void 0===i&&(i=e.length);for(var n=t;n<i;n++){var a=e.charCodeAt(n);if(isNewLine(a))return n<i-1&&13===a&&10===e.charCodeAt(n+1)?n+2:n+1}return-1}var B=/[\u1680\u2000-\u200a\u202f\u205f\u3000\ufeff]/,$=/(?:\s|\/\/.*|\/\*[^]*?\*\/)*/g,q=Object.prototype,W=q.hasOwnProperty,K=q.toString,H=Object.hasOwn||function(e,t){return W.call(e,t)},Y=Array.isArray||function(e){return"[object Array]"===K.call(e)},Q=Object.create(null);function wordsRegexp(e){return Q[e]||(Q[e]=new RegExp("^(?:"+e.replace(/ /g,"|")+")$"))}function codePointToString(e){return e<=65535?String.fromCharCode(e):(e-=65536,String.fromCharCode(55296+(e>>10),56320+(1023&e)))}var Z=/(?:[\uD800-\uDBFF](?![\uDC00-\uDFFF])|(?:[^\uD800-\uDBFF]|^)[\uDC00-\uDFFF])/,acorn_Position=function(e,t){this.line=e,this.column=t};acorn_Position.prototype.offset=function(e){return new acorn_Position(this.line,this.column+e)};var acorn_SourceLocation=function(e,t,i){this.start=t,this.end=i,null!==e.sourceFile&&(this.source=e.sourceFile)};function getLineInfo(e,t){for(var i=1,n=0;;){var a=nextLineBreak(e,n,t);if(a<0)return new acorn_Position(i,t-n);++i,n=a}}var X={ecmaVersion:null,sourceType:"script",onInsertedSemicolon:null,onTrailingComma:null,allowReserved:null,allowReturnOutsideFunction:!1,allowImportExportEverywhere:!1,allowAwaitOutsideFunction:null,allowSuperOutsideMethod:null,allowHashBang:!1,checkPrivateFields:!0,locations:!1,onToken:null,onComment:null,ranges:!1,program:null,sourceFile:null,directSourceFile:null,preserveParens:!1},te=!1;function getOptions(e){var t={};for(var i in X)t[i]=e&&H(e,i)?e[i]:X[i];if("latest"===t.ecmaVersion?t.ecmaVersion=1e8:null==t.ecmaVersion?(!te&&"object"==typeof console&&console.warn&&(te=!0,console.warn("Since Acorn 8.0.0, options.ecmaVersion is required.\nDefaulting to 2020, but this will stop working in the future.")),t.ecmaVersion=11):t.ecmaVersion>=2015&&(t.ecmaVersion-=2009),null==t.allowReserved&&(t.allowReserved=t.ecmaVersion<5),e&&null!=e.allowHashBang||(t.allowHashBang=t.ecmaVersion>=14),Y(t.onToken)){var n=t.onToken;t.onToken=function(e){return n.push(e)}}if(Y(t.onComment)&&(t.onComment=function(e,t){return function(i,n,a,c,l,y){var E={type:i?"Block":"Line",value:n,start:a,end:c};e.locations&&(E.loc=new acorn_SourceLocation(this,l,y)),e.ranges&&(E.range=[a,c]),t.push(E)}}(t,t.onComment)),"commonjs"===t.sourceType&&t.allowAwaitOutsideFunction)throw new Error("Cannot use allowAwaitOutsideFunction with sourceType: commonjs");return t}var ie=256,se=259;function functionFlags(e,t){return 2|(e?4:0)|(t?8:0)}var acorn_Parser=function(e,t,i){this.options=e=getOptions(e),this.sourceFile=e.sourceFile,this.keywords=wordsRegexp(y[e.ecmaVersion>=6?6:"module"===e.sourceType?"5module":5]);var n="";!0!==e.allowReserved&&(n=c[e.ecmaVersion>=6?6:5===e.ecmaVersion?5:3],"module"===e.sourceType&&(n+=" await")),this.reservedWords=wordsRegexp(n);var a=(n?n+" ":"")+c.strict;this.reservedWordsStrict=wordsRegexp(a),this.reservedWordsStrictBind=wordsRegexp(a+" "+c.strictBind),this.input=String(t),this.containsEsc=!1,i?(this.pos=i,this.lineStart=this.input.lastIndexOf("\n",i-1)+1,this.curLine=this.input.slice(0,this.lineStart).split(j).length):(this.pos=this.lineStart=0,this.curLine=1),this.type=O.eof,this.value=null,this.start=this.end=this.pos,this.startLoc=this.endLoc=this.curPosition(),this.lastTokEndLoc=this.lastTokStartLoc=null,this.lastTokStart=this.lastTokEnd=this.pos,this.context=this.initialContext(),this.exprAllowed=!0,this.inModule="module"===e.sourceType,this.strict=this.inModule||this.strictDirective(this.pos),this.potentialArrowAt=-1,this.potentialArrowInForAwait=!1,this.yieldPos=this.awaitPos=this.awaitIdentPos=0,this.labels=[],this.undefinedExports=Object.create(null),0===this.pos&&e.allowHashBang&&"#!"===this.input.slice(0,2)&&this.skipLineComment(2),this.scopeStack=[],this.enterScope("commonjs"===this.options.sourceType?2:1),this.regexpState=null,this.privateNameStack=[]},re={inFunction:{configurable:!0},inGenerator:{configurable:!0},inAsync:{configurable:!0},canAwait:{configurable:!0},allowReturn:{configurable:!0},allowSuper:{configurable:!0},allowDirectSuper:{configurable:!0},treatFunctionsAsVar:{configurable:!0},allowNewDotTarget:{configurable:!0},allowUsing:{configurable:!0},inClassStaticBlock:{configurable:!0}};acorn_Parser.prototype.parse=function(){var e=this.options.program||this.startNode();return this.nextToken(),this.parseTopLevel(e)},re.inFunction.get=function(){return(2&this.currentVarScope().flags)>0},re.inGenerator.get=function(){return(8&this.currentVarScope().flags)>0},re.inAsync.get=function(){return(4&this.currentVarScope().flags)>0},re.canAwait.get=function(){for(var e=this.scopeStack.length-1;e>=0;e--){var t=this.scopeStack[e].flags;if(768&t)return!1;if(2&t)return(4&t)>0}return this.inModule&&this.options.ecmaVersion>=13||this.options.allowAwaitOutsideFunction},re.allowReturn.get=function(){return!!this.inFunction||!!(this.options.allowReturnOutsideFunction&&1&this.currentVarScope().flags)},re.allowSuper.get=function(){return(64&this.currentThisScope().flags)>0||this.options.allowSuperOutsideMethod},re.allowDirectSuper.get=function(){return(128&this.currentThisScope().flags)>0},re.treatFunctionsAsVar.get=function(){return this.treatFunctionsAsVarInScope(this.currentScope())},re.allowNewDotTarget.get=function(){for(var e=this.scopeStack.length-1;e>=0;e--){var t=this.scopeStack[e].flags;if(768&t||2&t&&!(16&t))return!0}return!1},re.allowUsing.get=function(){var e=this.currentScope().flags;return!(1024&e)&&!(!this.inModule&&1&e)},re.inClassStaticBlock.get=function(){return(this.currentVarScope().flags&ie)>0},acorn_Parser.extend=function(){for(var e=[],t=arguments.length;t--;)e[t]=arguments[t];for(var i=this,n=0;n<e.length;n++)i=e[n](i);return i},acorn_Parser.parse=function(e,t){return new this(t,e).parse()},acorn_Parser.parseExpressionAt=function(e,t,i){var n=new this(i,e,t);return n.nextToken(),n.parseExpression()},acorn_Parser.tokenizer=function(e,t){return new this(t,e)},Object.defineProperties(acorn_Parser.prototype,re);var ne=acorn_Parser.prototype,ae=/^(?:'((?:\\[^]|[^'\\])*?)'|"((?:\\[^]|[^"\\])*?)")/;ne.strictDirective=function(e){if(this.options.ecmaVersion<5)return!1;for(;;){$.lastIndex=e,e+=$.exec(this.input)[0].length;var t=ae.exec(this.input.slice(e));if(!t)return!1;if("use strict"===(t[1]||t[2])){$.lastIndex=e+t[0].length;var i=$.exec(this.input),n=i.index+i[0].length,a=this.input.charAt(n);return";"===a||"}"===a||j.test(i[0])&&!(/[(`.[+\-/*%<>=,?^&]/.test(a)||"!"===a&&"="===this.input.charAt(n+1))}e+=t[0].length,$.lastIndex=e,e+=$.exec(this.input)[0].length,";"===this.input[e]&&e++}},ne.eat=function(e){return this.type===e&&(this.next(),!0)},ne.isContextual=function(e){return this.type===O.name&&this.value===e&&!this.containsEsc},ne.eatContextual=function(e){return!!this.isContextual(e)&&(this.next(),!0)},ne.expectContextual=function(e){this.eatContextual(e)||this.unexpected()},ne.canInsertSemicolon=function(){return this.type===O.eof||this.type===O.braceR||j.test(this.input.slice(this.lastTokEnd,this.start))},ne.insertSemicolon=function(){if(this.canInsertSemicolon())return this.options.onInsertedSemicolon&&this.options.onInsertedSemicolon(this.lastTokEnd,this.lastTokEndLoc),!0},ne.semicolon=function(){this.eat(O.semi)||this.insertSemicolon()||this.unexpected()},ne.afterTrailingComma=function(e,t){if(this.type===e)return this.options.onTrailingComma&&this.options.onTrailingComma(this.lastTokStart,this.lastTokStartLoc),t||this.next(),!0},ne.expect=function(e){this.eat(e)||this.unexpected()},ne.unexpected=function(e){this.raise(null!=e?e:this.start,"Unexpected token")};var acorn_DestructuringErrors=function(){this.shorthandAssign=this.trailingComma=this.parenthesizedAssign=this.parenthesizedBind=this.doubleProto=-1};ne.checkPatternErrors=function(e,t){if(e){e.trailingComma>-1&&this.raiseRecoverable(e.trailingComma,"Comma is not permitted after the rest element");var i=t?e.parenthesizedAssign:e.parenthesizedBind;i>-1&&this.raiseRecoverable(i,t?"Assigning to rvalue":"Parenthesized pattern")}},ne.checkExpressionErrors=function(e,t){if(!e)return!1;var i=e.shorthandAssign,n=e.doubleProto;if(!t)return i>=0||n>=0;i>=0&&this.raise(i,"Shorthand property assignments are valid only in destructuring patterns"),n>=0&&this.raiseRecoverable(n,"Redefinition of __proto__ property")},ne.checkYieldAwaitInDefaultParams=function(){this.yieldPos&&(!this.awaitPos||this.yieldPos<this.awaitPos)&&this.raise(this.yieldPos,"Yield expression cannot be a default value"),this.awaitPos&&this.raise(this.awaitPos,"Await expression cannot be a default value")},ne.isSimpleAssignTarget=function(e){return"ParenthesizedExpression"===e.type?this.isSimpleAssignTarget(e.expression):"Identifier"===e.type||"MemberExpression"===e.type};var oe=acorn_Parser.prototype;oe.parseTopLevel=function(e){var t=Object.create(null);for(e.body||(e.body=[]);this.type!==O.eof;){var i=this.parseStatement(null,!0,t);e.body.push(i)}if(this.inModule)for(var n=0,a=Object.keys(this.undefinedExports);n<a.length;n+=1){var c=a[n];this.raiseRecoverable(this.undefinedExports[c].start,"Export '"+c+"' is not defined")}return this.adaptDirectivePrologue(e.body),this.next(),e.sourceType="commonjs"===this.options.sourceType?"script":this.options.sourceType,this.finishNode(e,"Program")};var ce={kind:"loop"},he={kind:"switch"};oe.isLet=function(e){if(this.options.ecmaVersion<6||!this.isContextual("let"))return!1;$.lastIndex=this.pos;var t=$.exec(this.input),i=this.pos+t[0].length,n=this.fullCharCodeAt(i);if(91===n||92===n)return!0;if(e)return!1;if(123===n)return!0;if(isIdentifierStart(n)){var a=i;do{i+=n<=65535?1:2}while(isIdentifierChar(n=this.fullCharCodeAt(i)));if(92===n)return!0;var c=this.input.slice(a,i);if(!E.test(c))return!0}return!1},oe.isAsyncFunction=function(){if(this.options.ecmaVersion<8||!this.isContextual("async"))return!1;$.lastIndex=this.pos;var e,t=$.exec(this.input),i=this.pos+t[0].length;return!(j.test(this.input.slice(this.pos,i))||"function"!==this.input.slice(i,i+8)||i+8!==this.input.length&&(isIdentifierChar(e=this.fullCharCodeAt(i+8))||92===e))},oe.isUsingKeyword=function(e,t){if(this.options.ecmaVersion<17||!this.isContextual(e?"await":"using"))return!1;$.lastIndex=this.pos;var i=$.exec(this.input),n=this.pos+i[0].length;if(j.test(this.input.slice(this.pos,n)))return!1;if(e){var a,c=n+5;if("using"!==this.input.slice(n,c)||c===this.input.length||isIdentifierChar(a=this.fullCharCodeAt(c))||92===a)return!1;$.lastIndex=c;var l=$.exec(this.input);if(n=c+l[0].length,l&&j.test(this.input.slice(c,n)))return!1}var y=this.fullCharCodeAt(n);if(!isIdentifierStart(y)&&92!==y)return!1;var w=n;do{n+=y<=65535?1:2}while(isIdentifierChar(y=this.fullCharCodeAt(n)));if(92===y)return!0;var C=this.input.slice(w,n);return!(E.test(C)||t&&"of"===C)},oe.isAwaitUsing=function(e){return this.isUsingKeyword(!0,e)},oe.isUsing=function(e){return this.isUsingKeyword(!1,e)},oe.parseStatement=function(e,t,i){var n,a=this.type,c=this.startNode();switch(this.isLet(e)&&(a=O._var,n="let"),a){case O._break:case O._continue:return this.parseBreakContinueStatement(c,a.keyword);case O._debugger:return this.parseDebuggerStatement(c);case O._do:return this.parseDoStatement(c);case O._for:return this.parseForStatement(c);case O._function:return e&&(this.strict||"if"!==e&&"label"!==e)&&this.options.ecmaVersion>=6&&this.unexpected(),this.parseFunctionStatement(c,!1,!e);case O._class:return e&&this.unexpected(),this.parseClass(c,!0);case O._if:return this.parseIfStatement(c);case O._return:return this.parseReturnStatement(c);case O._switch:return this.parseSwitchStatement(c);case O._throw:return this.parseThrowStatement(c);case O._try:return this.parseTryStatement(c);case O._const:case O._var:return n=n||this.value,e&&"var"!==n&&this.unexpected(),this.parseVarStatement(c,n);case O._while:return this.parseWhileStatement(c);case O._with:return this.parseWithStatement(c);case O.braceL:return this.parseBlock(!0,c);case O.semi:return this.parseEmptyStatement(c);case O._export:case O._import:if(this.options.ecmaVersion>10&&a===O._import){$.lastIndex=this.pos;var l=$.exec(this.input),y=this.pos+l[0].length,E=this.input.charCodeAt(y);if(40===E||46===E)return this.parseExpressionStatement(c,this.parseExpression())}return this.options.allowImportExportEverywhere||(t||this.raise(this.start,"'import' and 'export' may only appear at the top level"),this.inModule||this.raise(this.start,"'import' and 'export' may appear only with 'sourceType: module'")),a===O._import?this.parseImport(c):this.parseExport(c,i);default:if(this.isAsyncFunction())return e&&this.unexpected(),this.next(),this.parseFunctionStatement(c,!0,!e);var w=this.isAwaitUsing(!1)?"await using":this.isUsing(!1)?"using":null;if(w)return this.allowUsing||this.raise(this.start,"Using declaration cannot appear in the top level when source type is `script` or in the bare case statement"),"await using"===w&&(this.canAwait||this.raise(this.start,"Await using cannot appear outside of async function"),this.next()),this.next(),this.parseVar(c,!1,w),this.semicolon(),this.finishNode(c,"VariableDeclaration");var C=this.value,S=this.parseExpression();return a===O.name&&"Identifier"===S.type&&this.eat(O.colon)?this.parseLabeledStatement(c,C,S,e):this.parseExpressionStatement(c,S)}},oe.parseBreakContinueStatement=function(e,t){var i="break"===t;this.next(),this.eat(O.semi)||this.insertSemicolon()?e.label=null:this.type!==O.name?this.unexpected():(e.label=this.parseIdent(),this.semicolon());for(var n=0;n<this.labels.length;++n){var a=this.labels[n];if(null==e.label||a.name===e.label.name){if(null!=a.kind&&(i||"loop"===a.kind))break;if(e.label&&i)break}}return n===this.labels.length&&this.raise(e.start,"Unsyntactic "+t),this.finishNode(e,i?"BreakStatement":"ContinueStatement")},oe.parseDebuggerStatement=function(e){return this.next(),this.semicolon(),this.finishNode(e,"DebuggerStatement")},oe.parseDoStatement=function(e){return this.next(),this.labels.push(ce),e.body=this.parseStatement("do"),this.labels.pop(),this.expect(O._while),e.test=this.parseParenExpression(),this.options.ecmaVersion>=6?this.eat(O.semi):this.semicolon(),this.finishNode(e,"DoWhileStatement")},oe.parseForStatement=function(e){this.next();var t=this.options.ecmaVersion>=9&&this.canAwait&&this.eatContextual("await")?this.lastTokStart:-1;if(this.labels.push(ce),this.enterScope(0),this.expect(O.parenL),this.type===O.semi)return t>-1&&this.unexpected(t),this.parseFor(e,null);var i=this.isLet();if(this.type===O._var||this.type===O._const||i){var n=this.startNode(),a=i?"let":this.value;return this.next(),this.parseVar(n,!0,a),this.finishNode(n,"VariableDeclaration"),this.parseForAfterInit(e,n,t)}var c=this.isContextual("let"),l=!1,y=this.isUsing(!0)?"using":this.isAwaitUsing(!0)?"await using":null;if(y){var E=this.startNode();return this.next(),"await using"===y&&(this.canAwait||this.raise(this.start,"Await using cannot appear outside of async function"),this.next()),this.parseVar(E,!0,y),this.finishNode(E,"VariableDeclaration"),this.parseForAfterInit(e,E,t)}var w=this.containsEsc,C=new acorn_DestructuringErrors,S=this.start,I=t>-1?this.parseExprSubscripts(C,"await"):this.parseExpression(!0,C);return this.type===O._in||(l=this.options.ecmaVersion>=6&&this.isContextual("of"))?(t>-1?(this.type===O._in&&this.unexpected(t),e.await=!0):l&&this.options.ecmaVersion>=8&&(I.start!==S||w||"Identifier"!==I.type||"async"!==I.name?this.options.ecmaVersion>=9&&(e.await=!1):this.unexpected()),c&&l&&this.raise(I.start,"The left-hand side of a for-of loop may not start with 'let'."),this.toAssignable(I,!1,C),this.checkLValPattern(I),this.parseForIn(e,I)):(this.checkExpressionErrors(C,!0),t>-1&&this.unexpected(t),this.parseFor(e,I))},oe.parseForAfterInit=function(e,t,i){return(this.type===O._in||this.options.ecmaVersion>=6&&this.isContextual("of"))&&1===t.declarations.length?(this.options.ecmaVersion>=9&&(this.type===O._in?i>-1&&this.unexpected(i):e.await=i>-1),this.parseForIn(e,t)):(i>-1&&this.unexpected(i),this.parseFor(e,t))},oe.parseFunctionStatement=function(e,t,i){return this.next(),this.parseFunction(e,pe|(i?0:ue),!1,t)},oe.parseIfStatement=function(e){return this.next(),e.test=this.parseParenExpression(),e.consequent=this.parseStatement("if"),e.alternate=this.eat(O._else)?this.parseStatement("if"):null,this.finishNode(e,"IfStatement")},oe.parseReturnStatement=function(e){return this.allowReturn||this.raise(this.start,"'return' outside of function"),this.next(),this.eat(O.semi)||this.insertSemicolon()?e.argument=null:(e.argument=this.parseExpression(),this.semicolon()),this.finishNode(e,"ReturnStatement")},oe.parseSwitchStatement=function(e){var t;this.next(),e.discriminant=this.parseParenExpression(),e.cases=[],this.expect(O.braceL),this.labels.push(he),this.enterScope(1024);for(var i=!1;this.type!==O.braceR;)if(this.type===O._case||this.type===O._default){var n=this.type===O._case;t&&this.finishNode(t,"SwitchCase"),e.cases.push(t=this.startNode()),t.consequent=[],this.next(),n?t.test=this.parseExpression():(i&&this.raiseRecoverable(this.lastTokStart,"Multiple default clauses"),i=!0,t.test=null),this.expect(O.colon)}else t||this.unexpected(),t.consequent.push(this.parseStatement(null));return this.exitScope(),t&&this.finishNode(t,"SwitchCase"),this.next(),this.labels.pop(),this.finishNode(e,"SwitchStatement")},oe.parseThrowStatement=function(e){return this.next(),j.test(this.input.slice(this.lastTokEnd,this.start))&&this.raise(this.lastTokEnd,"Illegal newline after throw"),e.argument=this.parseExpression(),this.semicolon(),this.finishNode(e,"ThrowStatement")};var le=[];oe.parseCatchClauseParam=function(){var e=this.parseBindingAtom(),t="Identifier"===e.type;return this.enterScope(t?32:0),this.checkLValPattern(e,t?4:2),this.expect(O.parenR),e},oe.parseTryStatement=function(e){if(this.next(),e.block=this.parseBlock(),e.handler=null,this.type===O._catch){var t=this.startNode();this.next(),this.eat(O.parenL)?t.param=this.parseCatchClauseParam():(this.options.ecmaVersion<10&&this.unexpected(),t.param=null,this.enterScope(0)),t.body=this.parseBlock(!1),this.exitScope(),e.handler=this.finishNode(t,"CatchClause")}return e.finalizer=this.eat(O._finally)?this.parseBlock():null,e.handler||e.finalizer||this.raise(e.start,"Missing catch or finally clause"),this.finishNode(e,"TryStatement")},oe.parseVarStatement=function(e,t,i){return this.next(),this.parseVar(e,!1,t,i),this.semicolon(),this.finishNode(e,"VariableDeclaration")},oe.parseWhileStatement=function(e){return this.next(),e.test=this.parseParenExpression(),this.labels.push(ce),e.body=this.parseStatement("while"),this.labels.pop(),this.finishNode(e,"WhileStatement")},oe.parseWithStatement=function(e){return this.strict&&this.raise(this.start,"'with' in strict mode"),this.next(),e.object=this.parseParenExpression(),e.body=this.parseStatement("with"),this.finishNode(e,"WithStatement")},oe.parseEmptyStatement=function(e){return this.next(),this.finishNode(e,"EmptyStatement")},oe.parseLabeledStatement=function(e,t,i,n){for(var a=0,c=this.labels;a<c.length;a+=1){c[a].name===t&&this.raise(i.start,"Label '"+t+"' is already declared")}for(var l=this.type.isLoop?"loop":this.type===O._switch?"switch":null,y=this.labels.length-1;y>=0;y--){var E=this.labels[y];if(E.statementStart!==e.start)break;E.statementStart=this.start,E.kind=l}return this.labels.push({name:t,kind:l,statementStart:this.start}),e.body=this.parseStatement(n?-1===n.indexOf("label")?n+"label":n:"label"),this.labels.pop(),e.label=i,this.finishNode(e,"LabeledStatement")},oe.parseExpressionStatement=function(e,t){return e.expression=t,this.semicolon(),this.finishNode(e,"ExpressionStatement")},oe.parseBlock=function(e,t,i){for(void 0===e&&(e=!0),void 0===t&&(t=this.startNode()),t.body=[],this.expect(O.braceL),e&&this.enterScope(0);this.type!==O.braceR;){var n=this.parseStatement(null);t.body.push(n)}return i&&(this.strict=!1),this.next(),e&&this.exitScope(),this.finishNode(t,"BlockStatement")},oe.parseFor=function(e,t){return e.init=t,this.expect(O.semi),e.test=this.type===O.semi?null:this.parseExpression(),this.expect(O.semi),e.update=this.type===O.parenR?null:this.parseExpression(),this.expect(O.parenR),e.body=this.parseStatement("for"),this.exitScope(),this.labels.pop(),this.finishNode(e,"ForStatement")},oe.parseForIn=function(e,t){var i=this.type===O._in;return this.next(),"VariableDeclaration"===t.type&&null!=t.declarations[0].init&&(!i||this.options.ecmaVersion<8||this.strict||"var"!==t.kind||"Identifier"!==t.declarations[0].id.type)&&this.raise(t.start,(i?"for-in":"for-of")+" loop variable declaration may not have an initializer"),e.left=t,e.right=i?this.parseExpression():this.parseMaybeAssign(),this.expect(O.parenR),e.body=this.parseStatement("for"),this.exitScope(),this.labels.pop(),this.finishNode(e,i?"ForInStatement":"ForOfStatement")},oe.parseVar=function(e,t,i,n){for(e.declarations=[],e.kind=i;;){var a=this.startNode();if(this.parseVarId(a,i),this.eat(O.eq)?a.init=this.parseMaybeAssign(t):n||"const"!==i||this.type===O._in||this.options.ecmaVersion>=6&&this.isContextual("of")?n||"using"!==i&&"await using"!==i||!(this.options.ecmaVersion>=17)||this.type===O._in||this.isContextual("of")?n||"Identifier"===a.id.type||t&&(this.type===O._in||this.isContextual("of"))?a.init=null:this.raise(this.lastTokEnd,"Complex binding patterns require an initialization value"):this.raise(this.lastTokEnd,"Missing initializer in "+i+" declaration"):this.unexpected(),e.declarations.push(this.finishNode(a,"VariableDeclarator")),!this.eat(O.comma))break}return e},oe.parseVarId=function(e,t){e.id="using"===t||"await using"===t?this.parseIdent():this.parseBindingAtom(),this.checkLValPattern(e.id,"var"===t?1:2,!1)};var pe=1,ue=2;function isPrivateNameConflicted(e,t){var i=t.key.name,n=e[i],a="true";return"MethodDefinition"!==t.type||"get"!==t.kind&&"set"!==t.kind||(a=(t.static?"s":"i")+t.kind),"iget"===n&&"iset"===a||"iset"===n&&"iget"===a||"sget"===n&&"sset"===a||"sset"===n&&"sget"===a?(e[i]="true",!1):!!n||(e[i]=a,!1)}function checkKeyName(e,t){var i=e.computed,n=e.key;return!i&&("Identifier"===n.type&&n.name===t||"Literal"===n.type&&n.value===t)}oe.parseFunction=function(e,t,i,n,a){this.initFunction(e),(this.options.ecmaVersion>=9||this.options.ecmaVersion>=6&&!n)&&(this.type===O.star&&t&ue&&this.unexpected(),e.generator=this.eat(O.star)),this.options.ecmaVersion>=8&&(e.async=!!n),t&pe&&(e.id=4&t&&this.type!==O.name?null:this.parseIdent(),!e.id||t&ue||this.checkLValSimple(e.id,this.strict||e.generator||e.async?this.treatFunctionsAsVar?1:2:3));var c=this.yieldPos,l=this.awaitPos,y=this.awaitIdentPos;return this.yieldPos=0,this.awaitPos=0,this.awaitIdentPos=0,this.enterScope(functionFlags(e.async,e.generator)),t&pe||(e.id=this.type===O.name?this.parseIdent():null),this.parseFunctionParams(e),this.parseFunctionBody(e,i,!1,a),this.yieldPos=c,this.awaitPos=l,this.awaitIdentPos=y,this.finishNode(e,t&pe?"FunctionDeclaration":"FunctionExpression")},oe.parseFunctionParams=function(e){this.expect(O.parenL),e.params=this.parseBindingList(O.parenR,!1,this.options.ecmaVersion>=8),this.checkYieldAwaitInDefaultParams()},oe.parseClass=function(e,t){this.next();var i=this.strict;this.strict=!0,this.parseClassId(e,t),this.parseClassSuper(e);var n=this.enterClassBody(),a=this.startNode(),c=!1;for(a.body=[],this.expect(O.braceL);this.type!==O.braceR;){var l=this.parseClassElement(null!==e.superClass);l&&(a.body.push(l),"MethodDefinition"===l.type&&"constructor"===l.kind?(c&&this.raiseRecoverable(l.start,"Duplicate constructor in the same class"),c=!0):l.key&&"PrivateIdentifier"===l.key.type&&isPrivateNameConflicted(n,l)&&this.raiseRecoverable(l.key.start,"Identifier '#"+l.key.name+"' has already been declared"))}return this.strict=i,this.next(),e.body=this.finishNode(a,"ClassBody"),this.exitClassBody(),this.finishNode(e,t?"ClassDeclaration":"ClassExpression")},oe.parseClassElement=function(e){if(this.eat(O.semi))return null;var t=this.options.ecmaVersion,i=this.startNode(),n="",a=!1,c=!1,l="method",y=!1;if(this.eatContextual("static")){if(t>=13&&this.eat(O.braceL))return this.parseClassStaticBlock(i),i;this.isClassElementNameStart()||this.type===O.star?y=!0:n="static"}if(i.static=y,!n&&t>=8&&this.eatContextual("async")&&(!this.isClassElementNameStart()&&this.type!==O.star||this.canInsertSemicolon()?n="async":c=!0),!n&&(t>=9||!c)&&this.eat(O.star)&&(a=!0),!n&&!c&&!a){var E=this.value;(this.eatContextual("get")||this.eatContextual("set"))&&(this.isClassElementNameStart()?l=E:n=E)}if(n?(i.computed=!1,i.key=this.startNodeAt(this.lastTokStart,this.lastTokStartLoc),i.key.name=n,this.finishNode(i.key,"Identifier")):this.parseClassElementName(i),t<13||this.type===O.parenL||"method"!==l||a||c){var w=!i.static&&checkKeyName(i,"constructor"),C=w&&e;w&&"method"!==l&&this.raise(i.key.start,"Constructor can't have get/set modifier"),i.kind=w?"constructor":l,this.parseClassMethod(i,a,c,C)}else this.parseClassField(i);return i},oe.isClassElementNameStart=function(){return this.type===O.name||this.type===O.privateId||this.type===O.num||this.type===O.string||this.type===O.bracketL||this.type.keyword},oe.parseClassElementName=function(e){this.type===O.privateId?("constructor"===this.value&&this.raise(this.start,"Classes can't have an element named '#constructor'"),e.computed=!1,e.key=this.parsePrivateIdent()):this.parsePropertyName(e)},oe.parseClassMethod=function(e,t,i,n){var a=e.key;"constructor"===e.kind?(t&&this.raise(a.start,"Constructor can't be a generator"),i&&this.raise(a.start,"Constructor can't be an async method")):e.static&&checkKeyName(e,"prototype")&&this.raise(a.start,"Classes may not have a static property named prototype");var c=e.value=this.parseMethod(t,i,n);return"get"===e.kind&&0!==c.params.length&&this.raiseRecoverable(c.start,"getter should have no params"),"set"===e.kind&&1!==c.params.length&&this.raiseRecoverable(c.start,"setter should have exactly one param"),"set"===e.kind&&"RestElement"===c.params[0].type&&this.raiseRecoverable(c.params[0].start,"Setter cannot use rest params"),this.finishNode(e,"MethodDefinition")},oe.parseClassField=function(e){return checkKeyName(e,"constructor")?this.raise(e.key.start,"Classes can't have a field named 'constructor'"):e.static&&checkKeyName(e,"prototype")&&this.raise(e.key.start,"Classes can't have a static field named 'prototype'"),this.eat(O.eq)?(this.enterScope(576),e.value=this.parseMaybeAssign(),this.exitScope()):e.value=null,this.semicolon(),this.finishNode(e,"PropertyDefinition")},oe.parseClassStaticBlock=function(e){e.body=[];var t=this.labels;for(this.labels=[],this.enterScope(320);this.type!==O.braceR;){var i=this.parseStatement(null);e.body.push(i)}return this.next(),this.exitScope(),this.labels=t,this.finishNode(e,"StaticBlock")},oe.parseClassId=function(e,t){this.type===O.name?(e.id=this.parseIdent(),t&&this.checkLValSimple(e.id,2,!1)):(!0===t&&this.unexpected(),e.id=null)},oe.parseClassSuper=function(e){e.superClass=this.eat(O._extends)?this.parseExprSubscripts(null,!1):null},oe.enterClassBody=function(){var e={declared:Object.create(null),used:[]};return this.privateNameStack.push(e),e.declared},oe.exitClassBody=function(){var e=this.privateNameStack.pop(),t=e.declared,i=e.used;if(this.options.checkPrivateFields)for(var n=this.privateNameStack.length,a=0===n?null:this.privateNameStack[n-1],c=0;c<i.length;++c){var l=i[c];H(t,l.name)||(a?a.used.push(l):this.raiseRecoverable(l.start,"Private field '#"+l.name+"' must be declared in an enclosing class"))}},oe.parseExportAllDeclaration=function(e,t){return this.options.ecmaVersion>=11&&(this.eatContextual("as")?(e.exported=this.parseModuleExportName(),this.checkExport(t,e.exported,this.lastTokStart)):e.exported=null),this.expectContextual("from"),this.type!==O.string&&this.unexpected(),e.source=this.parseExprAtom(),this.options.ecmaVersion>=16&&(e.attributes=this.parseWithClause()),this.semicolon(),this.finishNode(e,"ExportAllDeclaration")},oe.parseExport=function(e,t){if(this.next(),this.eat(O.star))return this.parseExportAllDeclaration(e,t);if(this.eat(O._default))return this.checkExport(t,"default",this.lastTokStart),e.declaration=this.parseExportDefaultDeclaration(),this.finishNode(e,"ExportDefaultDeclaration");if(this.shouldParseExportStatement())e.declaration=this.parseExportDeclaration(e),"VariableDeclaration"===e.declaration.type?this.checkVariableExport(t,e.declaration.declarations):this.checkExport(t,e.declaration.id,e.declaration.id.start),e.specifiers=[],e.source=null,this.options.ecmaVersion>=16&&(e.attributes=[]);else{if(e.declaration=null,e.specifiers=this.parseExportSpecifiers(t),this.eatContextual("from"))this.type!==O.string&&this.unexpected(),e.source=this.parseExprAtom(),this.options.ecmaVersion>=16&&(e.attributes=this.parseWithClause());else{for(var i=0,n=e.specifiers;i<n.length;i+=1){var a=n[i];this.checkUnreserved(a.local),this.checkLocalExport(a.local),"Literal"===a.local.type&&this.raise(a.local.start,"A string literal cannot be used as an exported binding without `from`.")}e.source=null,this.options.ecmaVersion>=16&&(e.attributes=[])}this.semicolon()}return this.finishNode(e,"ExportNamedDeclaration")},oe.parseExportDeclaration=function(e){return this.parseStatement(null)},oe.parseExportDefaultDeclaration=function(){var e;if(this.type===O._function||(e=this.isAsyncFunction())){var t=this.startNode();return this.next(),e&&this.next(),this.parseFunction(t,4|pe,!1,e)}if(this.type===O._class){var i=this.startNode();return this.parseClass(i,"nullableID")}var n=this.parseMaybeAssign();return this.semicolon(),n},oe.checkExport=function(e,t,i){e&&("string"!=typeof t&&(t="Identifier"===t.type?t.name:t.value),H(e,t)&&this.raiseRecoverable(i,"Duplicate export '"+t+"'"),e[t]=!0)},oe.checkPatternExport=function(e,t){var i=t.type;if("Identifier"===i)this.checkExport(e,t,t.start);else if("ObjectPattern"===i)for(var n=0,a=t.properties;n<a.length;n+=1){var c=a[n];this.checkPatternExport(e,c)}else if("ArrayPattern"===i)for(var l=0,y=t.elements;l<y.length;l+=1){var E=y[l];E&&this.checkPatternExport(e,E)}else"Property"===i?this.checkPatternExport(e,t.value):"AssignmentPattern"===i?this.checkPatternExport(e,t.left):"RestElement"===i&&this.checkPatternExport(e,t.argument)},oe.checkVariableExport=function(e,t){if(e)for(var i=0,n=t;i<n.length;i+=1){var a=n[i];this.checkPatternExport(e,a.id)}},oe.shouldParseExportStatement=function(){return"var"===this.type.keyword||"const"===this.type.keyword||"class"===this.type.keyword||"function"===this.type.keyword||this.isLet()||this.isAsyncFunction()},oe.parseExportSpecifier=function(e){var t=this.startNode();return t.local=this.parseModuleExportName(),t.exported=this.eatContextual("as")?this.parseModuleExportName():t.local,this.checkExport(e,t.exported,t.exported.start),this.finishNode(t,"ExportSpecifier")},oe.parseExportSpecifiers=function(e){var t=[],i=!0;for(this.expect(O.braceL);!this.eat(O.braceR);){if(i)i=!1;else if(this.expect(O.comma),this.afterTrailingComma(O.braceR))break;t.push(this.parseExportSpecifier(e))}return t},oe.parseImport=function(e){return this.next(),this.type===O.string?(e.specifiers=le,e.source=this.parseExprAtom()):(e.specifiers=this.parseImportSpecifiers(),this.expectContextual("from"),e.source=this.type===O.string?this.parseExprAtom():this.unexpected()),this.options.ecmaVersion>=16&&(e.attributes=this.parseWithClause()),this.semicolon(),this.finishNode(e,"ImportDeclaration")},oe.parseImportSpecifier=function(){var e=this.startNode();return e.imported=this.parseModuleExportName(),this.eatContextual("as")?e.local=this.parseIdent():(this.checkUnreserved(e.imported),e.local=e.imported),this.checkLValSimple(e.local,2),this.finishNode(e,"ImportSpecifier")},oe.parseImportDefaultSpecifier=function(){var e=this.startNode();return e.local=this.parseIdent(),this.checkLValSimple(e.local,2),this.finishNode(e,"ImportDefaultSpecifier")},oe.parseImportNamespaceSpecifier=function(){var e=this.startNode();return this.next(),this.expectContextual("as"),e.local=this.parseIdent(),this.checkLValSimple(e.local,2),this.finishNode(e,"ImportNamespaceSpecifier")},oe.parseImportSpecifiers=function(){var e=[],t=!0;if(this.type===O.name&&(e.push(this.parseImportDefaultSpecifier()),!this.eat(O.comma)))return e;if(this.type===O.star)return e.push(this.parseImportNamespaceSpecifier()),e;for(this.expect(O.braceL);!this.eat(O.braceR);){if(t)t=!1;else if(this.expect(O.comma),this.afterTrailingComma(O.braceR))break;e.push(this.parseImportSpecifier())}return e},oe.parseWithClause=function(){var e=[];if(!this.eat(O._with))return e;this.expect(O.braceL);for(var t={},i=!0;!this.eat(O.braceR);){if(i)i=!1;else if(this.expect(O.comma),this.afterTrailingComma(O.braceR))break;var n=this.parseImportAttribute(),a="Identifier"===n.key.type?n.key.name:n.key.value;H(t,a)&&this.raiseRecoverable(n.key.start,"Duplicate attribute key '"+a+"'"),t[a]=!0,e.push(n)}return e},oe.parseImportAttribute=function(){var e=this.startNode();return e.key=this.type===O.string?this.parseExprAtom():this.parseIdent("never"!==this.options.allowReserved),this.expect(O.colon),this.type!==O.string&&this.unexpected(),e.value=this.parseExprAtom(),this.finishNode(e,"ImportAttribute")},oe.parseModuleExportName=function(){if(this.options.ecmaVersion>=13&&this.type===O.string){var e=this.parseLiteral(this.value);return Z.test(e.value)&&this.raise(e.start,"An export name cannot include a lone surrogate."),e}return this.parseIdent(!0)},oe.adaptDirectivePrologue=function(e){for(var t=0;t<e.length&&this.isDirectiveCandidate(e[t]);++t)e[t].directive=e[t].expression.raw.slice(1,-1)},oe.isDirectiveCandidate=function(e){return this.options.ecmaVersion>=5&&"ExpressionStatement"===e.type&&"Literal"===e.expression.type&&"string"==typeof e.expression.value&&('"'===this.input[e.start]||"'"===this.input[e.start])};var de=acorn_Parser.prototype;de.toAssignable=function(e,t,i){if(this.options.ecmaVersion>=6&&e)switch(e.type){case"Identifier":this.inAsync&&"await"===e.name&&this.raise(e.start,"Cannot use 'await' as identifier inside an async function");break;case"ObjectPattern":case"ArrayPattern":case"AssignmentPattern":case"RestElement":break;case"ObjectExpression":e.type="ObjectPattern",i&&this.checkPatternErrors(i,!0);for(var n=0,a=e.properties;n<a.length;n+=1){var c=a[n];this.toAssignable(c,t),"RestElement"!==c.type||"ArrayPattern"!==c.argument.type&&"ObjectPattern"!==c.argument.type||this.raise(c.argument.start,"Unexpected token")}break;case"Property":"init"!==e.kind&&this.raise(e.key.start,"Object pattern can't contain getter or setter"),this.toAssignable(e.value,t);break;case"ArrayExpression":e.type="ArrayPattern",i&&this.checkPatternErrors(i,!0),this.toAssignableList(e.elements,t);break;case"SpreadElement":e.type="RestElement",this.toAssignable(e.argument,t),"AssignmentPattern"===e.argument.type&&this.raise(e.argument.start,"Rest elements cannot have a default value");break;case"AssignmentExpression":"="!==e.operator&&this.raise(e.left.end,"Only '=' operator can be used for specifying default value."),e.type="AssignmentPattern",delete e.operator,this.toAssignable(e.left,t);break;case"ParenthesizedExpression":this.toAssignable(e.expression,t,i);break;case"ChainExpression":this.raiseRecoverable(e.start,"Optional chaining cannot appear in left-hand side");break;case"MemberExpression":if(!t)break;default:this.raise(e.start,"Assigning to rvalue")}else i&&this.checkPatternErrors(i,!0);return e},de.toAssignableList=function(e,t){for(var i=e.length,n=0;n<i;n++){var a=e[n];a&&this.toAssignable(a,t)}if(i){var c=e[i-1];6===this.options.ecmaVersion&&t&&c&&"RestElement"===c.type&&"Identifier"!==c.argument.type&&this.unexpected(c.argument.start)}return e},de.parseSpread=function(e){var t=this.startNode();return this.next(),t.argument=this.parseMaybeAssign(!1,e),this.finishNode(t,"SpreadElement")},de.parseRestBinding=function(){var e=this.startNode();return this.next(),6===this.options.ecmaVersion&&this.type!==O.name&&this.unexpected(),e.argument=this.parseBindingAtom(),this.finishNode(e,"RestElement")},de.parseBindingAtom=function(){if(this.options.ecmaVersion>=6)switch(this.type){case O.bracketL:var e=this.startNode();return this.next(),e.elements=this.parseBindingList(O.bracketR,!0,!0),this.finishNode(e,"ArrayPattern");case O.braceL:return this.parseObj(!0)}return this.parseIdent()},de.parseBindingList=function(e,t,i,n){for(var a=[],c=!0;!this.eat(e);)if(c?c=!1:this.expect(O.comma),t&&this.type===O.comma)a.push(null);else{if(i&&this.afterTrailingComma(e))break;if(this.type===O.ellipsis){var l=this.parseRestBinding();this.parseBindingListItem(l),a.push(l),this.type===O.comma&&this.raiseRecoverable(this.start,"Comma is not permitted after the rest element"),this.expect(e);break}a.push(this.parseAssignableListItem(n))}return a},de.parseAssignableListItem=function(e){var t=this.parseMaybeDefault(this.start,this.startLoc);return this.parseBindingListItem(t),t},de.parseBindingListItem=function(e){return e},de.parseMaybeDefault=function(e,t,i){if(i=i||this.parseBindingAtom(),this.options.ecmaVersion<6||!this.eat(O.eq))return i;var n=this.startNodeAt(e,t);return n.left=i,n.right=this.parseMaybeAssign(),this.finishNode(n,"AssignmentPattern")},de.checkLValSimple=function(e,t,i){void 0===t&&(t=0);var n=0!==t;switch(e.type){case"Identifier":this.strict&&this.reservedWordsStrictBind.test(e.name)&&this.raiseRecoverable(e.start,(n?"Binding ":"Assigning to ")+e.name+" in strict mode"),n&&(2===t&&"let"===e.name&&this.raiseRecoverable(e.start,"let is disallowed as a lexically bound name"),i&&(H(i,e.name)&&this.raiseRecoverable(e.start,"Argument name clash"),i[e.name]=!0),5!==t&&this.declareName(e.name,t,e.start));break;case"ChainExpression":this.raiseRecoverable(e.start,"Optional chaining cannot appear in left-hand side");break;case"MemberExpression":n&&this.raiseRecoverable(e.start,"Binding member expression");break;case"ParenthesizedExpression":return n&&this.raiseRecoverable(e.start,"Binding parenthesized expression"),this.checkLValSimple(e.expression,t,i);default:this.raise(e.start,(n?"Binding":"Assigning to")+" rvalue")}},de.checkLValPattern=function(e,t,i){switch(void 0===t&&(t=0),e.type){case"ObjectPattern":for(var n=0,a=e.properties;n<a.length;n+=1){var c=a[n];this.checkLValInnerPattern(c,t,i)}break;case"ArrayPattern":for(var l=0,y=e.elements;l<y.length;l+=1){var E=y[l];E&&this.checkLValInnerPattern(E,t,i)}break;default:this.checkLValSimple(e,t,i)}},de.checkLValInnerPattern=function(e,t,i){switch(void 0===t&&(t=0),e.type){case"Property":this.checkLValInnerPattern(e.value,t,i);break;case"AssignmentPattern":this.checkLValPattern(e.left,t,i);break;case"RestElement":this.checkLValPattern(e.argument,t,i);break;default:this.checkLValPattern(e,t,i)}};var acorn_TokContext=function(e,t,i,n,a){this.token=e,this.isExpr=!!t,this.preserveSpace=!!i,this.override=n,this.generator=!!a},fe={b_stat:new acorn_TokContext("{",!1),b_expr:new acorn_TokContext("{",!0),b_tmpl:new acorn_TokContext("${",!1),p_stat:new acorn_TokContext("(",!1),p_expr:new acorn_TokContext("(",!0),q_tmpl:new acorn_TokContext("`",!0,!0,function(e){return e.tryReadTemplateToken()}),f_stat:new acorn_TokContext("function",!1),f_expr:new acorn_TokContext("function",!0),f_expr_gen:new acorn_TokContext("function",!0,!1,null,!0),f_gen:new acorn_TokContext("function",!1,!1,null,!0)},me=acorn_Parser.prototype;me.initialContext=function(){return[fe.b_stat]},me.curContext=function(){return this.context[this.context.length-1]},me.braceIsBlock=function(e){var t=this.curContext();return t===fe.f_expr||t===fe.f_stat||(e!==O.colon||t!==fe.b_stat&&t!==fe.b_expr?e===O._return||e===O.name&&this.exprAllowed?j.test(this.input.slice(this.lastTokEnd,this.start)):e===O._else||e===O.semi||e===O.eof||e===O.parenR||e===O.arrow||(e===O.braceL?t===fe.b_stat:e!==O._var&&e!==O._const&&e!==O.name&&!this.exprAllowed):!t.isExpr)},me.inGeneratorContext=function(){for(var e=this.context.length-1;e>=1;e--){var t=this.context[e];if("function"===t.token)return t.generator}return!1},me.updateContext=function(e){var t,i=this.type;i.keyword&&e===O.dot?this.exprAllowed=!1:(t=i.updateContext)?t.call(this,e):this.exprAllowed=i.beforeExpr},me.overrideContext=function(e){this.curContext()!==e&&(this.context[this.context.length-1]=e)},O.parenR.updateContext=O.braceR.updateContext=function(){if(1!==this.context.length){var e=this.context.pop();e===fe.b_stat&&"function"===this.curContext().token&&(e=this.context.pop()),this.exprAllowed=!e.isExpr}else this.exprAllowed=!0},O.braceL.updateContext=function(e){this.context.push(this.braceIsBlock(e)?fe.b_stat:fe.b_expr),this.exprAllowed=!0},O.dollarBraceL.updateContext=function(){this.context.push(fe.b_tmpl),this.exprAllowed=!0},O.parenL.updateContext=function(e){var t=e===O._if||e===O._for||e===O._with||e===O._while;this.context.push(t?fe.p_stat:fe.p_expr),this.exprAllowed=!0},O.incDec.updateContext=function(){},O._function.updateContext=O._class.updateContext=function(e){!e.beforeExpr||e===O._else||e===O.semi&&this.curContext()!==fe.p_stat||e===O._return&&j.test(this.input.slice(this.lastTokEnd,this.start))||(e===O.colon||e===O.braceL)&&this.curContext()===fe.b_stat?this.context.push(fe.f_stat):this.context.push(fe.f_expr),this.exprAllowed=!1},O.colon.updateContext=function(){"function"===this.curContext().token&&this.context.pop(),this.exprAllowed=!0},O.backQuote.updateContext=function(){this.curContext()===fe.q_tmpl?this.context.pop():this.context.push(fe.q_tmpl),this.exprAllowed=!1},O.star.updateContext=function(e){if(e===O._function){var t=this.context.length-1;this.context[t]===fe.f_expr?this.context[t]=fe.f_expr_gen:this.context[t]=fe.f_gen}this.exprAllowed=!0},O.name.updateContext=function(e){var t=!1;this.options.ecmaVersion>=6&&e!==O.dot&&("of"===this.value&&!this.exprAllowed||"yield"===this.value&&this.inGeneratorContext())&&(t=!0),this.exprAllowed=t};var ge=acorn_Parser.prototype;function isLocalVariableAccess(e){return"Identifier"===e.type||"ParenthesizedExpression"===e.type&&isLocalVariableAccess(e.expression)}function isPrivateFieldAccess(e){return"MemberExpression"===e.type&&"PrivateIdentifier"===e.property.type||"ChainExpression"===e.type&&isPrivateFieldAccess(e.expression)||"ParenthesizedExpression"===e.type&&isPrivateFieldAccess(e.expression)}ge.checkPropClash=function(e,t,i){if(!(this.options.ecmaVersion>=9&&"SpreadElement"===e.type||this.options.ecmaVersion>=6&&(e.computed||e.method||e.shorthand))){var n,a=e.key;switch(a.type){case"Identifier":n=a.name;break;case"Literal":n=String(a.value);break;default:return}var c=e.kind;if(this.options.ecmaVersion>=6)"__proto__"===n&&"init"===c&&(t.proto&&(i?i.doubleProto<0&&(i.doubleProto=a.start):this.raiseRecoverable(a.start,"Redefinition of __proto__ property")),t.proto=!0);else{var l=t[n="$"+n];if(l)("init"===c?this.strict&&l.init||l.get||l.set:l.init||l[c])&&this.raiseRecoverable(a.start,"Redefinition of property");else l=t[n]={init:!1,get:!1,set:!1};l[c]=!0}}},ge.parseExpression=function(e,t){var i=this.start,n=this.startLoc,a=this.parseMaybeAssign(e,t);if(this.type===O.comma){var c=this.startNodeAt(i,n);for(c.expressions=[a];this.eat(O.comma);)c.expressions.push(this.parseMaybeAssign(e,t));return this.finishNode(c,"SequenceExpression")}return a},ge.parseMaybeAssign=function(e,t,i){if(this.isContextual("yield")){if(this.inGenerator)return this.parseYield(e);this.exprAllowed=!1}var n=!1,a=-1,c=-1,l=-1;t?(a=t.parenthesizedAssign,c=t.trailingComma,l=t.doubleProto,t.parenthesizedAssi
```

---

## Assistant (Build · Muse Spark 1.3 Free · 6.6s)

_Thinking:_



_Thinking:_



**Tool: bash**

**Input:**
```json
{
  "command": "npm run verify:generator 2>&1 | tail -3",
  "workdir": "/Users/nazmudinalkhamil/Documents/Projects/generator-module-app"
}
```

**Output:**
```
...output truncated...

Full output saved to: /Users/nazmudinalkhamil/.local/share/opencode/tool-output/tool_105a60185001qSX7cywXtk0d1t

 resolving configuration: ${c}`);i.add(c);const l=a.dirname(c),y=fe(c,n,i);delete y.references;const{compilerOptions:E}=y;if(E){const{baseUrl:e}=E;e&&!e.startsWith(ie)&&(E.baseUrl=le(t,l,e));const{outDir:i}=E;i&&!i.startsWith(ie)&&(E.outDir=le(t,l,i));const{declarationDir:n}=E;n&&!n.startsWith(ie)&&(E.declarationDir=le(t,l,n));const{rootDir:a}=E;a&&!a.startsWith(ie)&&(E.rootDir=le(t,l,a));const{rootDirs:c}=E;c&&(E.rootDirs=c.map(e=>e.startsWith(ie)?e:le(t,l,e)));const{typeRoots:y}=E;y&&(E.typeRoots=y.map(e=>e.startsWith(ie)?e:le(t,l,e)))}for(const e of he){const i=y[e];i&&(y[e]=i.map(e=>e.startsWith(ie)?e:pe(t,l,e)))}return y},"resolveExtends"),de=["outDir","declarationDir"],fe=r((e,t,i=new Set)=>{let n;try{n=X(e,t)||{}}catch{throw new Error(`Cannot resolve tsconfig at path: ${e}`)}if("object"!=typeof n)throw new SyntaxError(`Failed to parse tsconfig at: ${e}`);const c=a.dirname(e);if(n.compilerOptions){const{compilerOptions:e}=n;e.paths&&!e.baseUrl&&(e[te]=c)}if(n.extends){const e=Array.isArray(n.extends)?n.extends:[n.extends];delete n.extends;for(const a of e.reverse()){const e=ue(a,c,new Set(i),t),l={...e,...n,compilerOptions:{...e.compilerOptions,...n.compilerOptions}};e.watchOptions&&(l.watchOptions={...e.watchOptions,...n.watchOptions}),n=l}}if(n.compilerOptions){const{compilerOptions:e}=n,t=["baseUrl","rootDir"];for(const i of t){const t=e[i];if(t&&!t.startsWith(ie)){const n=a.resolve(c,t),l=ce(c,n);e[i]=l}}for(const t of de){let i=e[t];i&&(Array.isArray(n.exclude)||(n.exclude=de.map(t=>e[t]).filter(Boolean)),i.startsWith(ie)||(i=B(i)),e[t]=i)}}else n.compilerOptions={};if(n.include&&(n.include=n.include.map(h)),n.files&&(n.files=n.files.map(e=>e.startsWith(ie)?e:B(e))),n.watchOptions){const{watchOptions:e}=n;e.excludeDirectories&&(e.excludeDirectories=e.excludeDirectories.map(e=>h(a.resolve(c,e)))),e.excludeFiles&&(e.excludeFiles=e.excludeFiles.map(e=>h(a.resolve(c,e)))),e.watchFile&&(e.watchFile=e.watchFile.toLowerCase()),e.watchDirectory&&(e.watchDirectory=e.watchDirectory.toLowerCase()),e.fallbackPolling&&(e.fallbackPolling=e.fallbackPolling.toLowerCase())}return n},"_parseTsconfig"),me=r((e,t)=>{if(e.startsWith(ie))return h(a.join(t,e.slice(12)))},"interpolateConfigDir"),ge=["outDir","declarationDir","outFile","rootDir","baseUrl","tsBuildInfoFile"],xe=r(e=>{if(e.strict){const t=["noImplicitAny","noImplicitThis","strictNullChecks","strictFunctionTypes","strictBindCallApply","strictPropertyInitialization","strictBuiltinIteratorReturn","alwaysStrict","useUnknownInCatchVariables"];for(const i of t)void 0===e[i]&&(e[i]=!0)}if(e.composite&&(null!=e.declaration||(e.declaration=!0),null!=e.incremental||(e.incremental=!0)),e.target){let t=e.target.toLowerCase();"es2015"===t&&(t="es6"),e.target=t,"esnext"===t&&(null!=e.module||(e.module="es6"),null!=e.useDefineForClassFields||(e.useDefineForClassFields=!0)),("es6"===t||"es2016"===t||"es2017"===t||"es2018"===t||"es2019"===t||"es2020"===t||"es2021"===t||"es2022"===t||"es2023"===t||"es2024"===t)&&(null!=e.module||(e.module="es6")),("es2022"===t||"es2023"===t||"es2024"===t)&&(null!=e.useDefineForClassFields||(e.useDefineForClassFields=!0))}if(e.module){let t=e.module.toLowerCase();if("es2015"===t&&(t="es6"),e.module=t,("es6"===t||"es2020"===t||"es2022"===t||"esnext"===t||"none"===t||"system"===t||"umd"===t||"amd"===t)&&(null!=e.moduleResolution||(e.moduleResolution="classic")),"system"===t&&(null!=e.allowSyntheticDefaultImports||(e.allowSyntheticDefaultImports=!0)),("node16"===t||"node18"===t||"node20"===t||"nodenext"===t||"preserve"===t)&&(null!=e.esModuleInterop||(e.esModuleInterop=!0),null!=e.allowSyntheticDefaultImports||(e.allowSyntheticDefaultImports=!0)),("node16"===t||"node18"===t||"node20"===t||"nodenext"===t)&&(null!=e.moduleDetection||(e.moduleDetection="force")),"node16"===t&&(null!=e.target||(e.target="es2022"),null!=e.moduleResolution||(e.moduleResolution="node16")),"node18"===t&&(null!=e.target||(e.target="es2022"),null!=e.moduleResolution||(e.moduleResolution="node16")),"node20"===t&&(null!=e.target||(e.target="es2023"),null!=e.moduleResolution||(e.moduleResolution="node16"),null!=e.resolveJsonModule||(e.resolveJsonModule=!0)),"nodenext"===t&&(null!=e.target||(e.target="esnext"),null!=e.moduleResolution||(e.moduleResolution="nodenext"),null!=e.resolveJsonModule||(e.resolveJsonModule=!0)),"node16"===t||"node18"===t||"node20"===t||"nodenext"===t){const t=e.target;("es3"===t||"es2022"===t||"es2023"===t||"es2024"===t||"esnext"===t)&&(null!=e.useDefineForClassFields||(e.useDefineForClassFields=!0))}"preserve"===t&&(null!=e.moduleResolution||(e.moduleResolution="bundler"))}if(e.moduleResolution){let t=e.moduleResolution.toLowerCase();"node"===t&&(t="node10"),e.moduleResolution=t,("node16"===t||"nodenext"===t||"bundler"===t)&&(null!=e.resolvePackageJsonExports||(e.resolvePackageJsonExports=!0),null!=e.resolvePackageJsonImports||(e.resolvePackageJsonImports=!0)),"bundler"===t&&(null!=e.allowSyntheticDefaultImports||(e.allowSyntheticDefaultImports=!0),null!=e.resolveJsonModule||(e.resolveJsonModule=!0))}e.jsx&&(e.jsx=e.jsx.toLowerCase()),e.moduleDetection&&(e.moduleDetection=e.moduleDetection.toLowerCase()),e.importsNotUsedAsValues&&(e.importsNotUsedAsValues=e.importsNotUsedAsValues.toLowerCase()),e.newLine&&(e.newLine=e.newLine.toLowerCase()),e.esModuleInterop&&(null!=e.allowSyntheticDefaultImports||(e.allowSyntheticDefaultImports=!0)),e.verbatimModuleSyntax&&(null!=e.isolatedModules||(e.isolatedModules=!0),null!=e.preserveConstEnums||(e.preserveConstEnums=!0)),e.isolatedModules&&(null!=e.preserveConstEnums||(e.preserveConstEnums=!0)),e.rewriteRelativeImportExtensions&&(null!=e.allowImportingTsExtensions||(e.allowImportingTsExtensions=!0)),e.lib&&(e.lib=e.lib.map(e=>e.toLowerCase())),e.checkJs&&(null!=e.allowJs||(e.allowJs=!0))},"normalizeCompilerOptions"),ve=r((e,t=new Map)=>{const i=a.resolve(e),n=fe(i,t),c=a.dirname(i),{compilerOptions:l}=n;if(l){for(const e of ge){const t=l[e];if(t){const i=me(t,c);l[e]=i?ce(c,i):t}}for(const e of["rootDirs","typeRoots"]){const t=l[e];t&&(l[e]=t.map(e=>{const t=me(e,c);return t?ce(c,t):B(e)}))}const{paths:e}=l;if(e)for(const t of Object.keys(e))e[t]=e[t].map(e=>{var t;return null!=(t=me(e,c))?t:e});xe(l)}for(const e of he){const t=n[e];t&&(n[e]=t.map(e=>{var t;return null!=(t=me(e,c))?t:e}))}return n},"parseTsconfig");var ye=Object.defineProperty,_e=r((e,t)=>ye(e,"name",{value:t,configurable:!0}),"s");const Ee=_e(e=>{let t="";for(let i=0;i<e.length;i+=1){const n=e[i],a=n.toUpperCase();t+=n===a?n.toLowerCase():a}return t},"invertCase"),be=new Map,ke=_e((e,t)=>{const i=C.join(e,`.is-fs-case-sensitive-test-${process.pid}`);try{return t.writeFileSync(i,""),!t.existsSync(Ee(i))}finally{try{t.unlinkSync(i)}catch{}}},"checkDirectoryCaseWithWrite"),we=_e((e,t,i)=>{try{return ke(e,i)}catch(e){if(void 0===t)return ke(w.tmpdir(),i);throw e}},"checkDirectoryCaseWithFallback"),Ce=_e((e,t=E,i=!0)=>{const n=null!=e?e:process.cwd();if(i&&be.has(n))return be.get(n);let a;const c=Ee(n);return a=c!==n&&t.existsSync(n)?!t.existsSync(c):we(n,e,t),i&&be.set(n,a),a},"isFsCaseSensitive"),{join:Se}=a.posix,Ie={ts:[".ts",".tsx",".d.ts"],cts:[".cts",".d.cts"],mts:[".mts",".d.mts"]},Te=r(e=>{const t=[...Ie.ts],i=[...Ie.cts],n=[...Ie.mts];return null!=e&&e.allowJs&&(t.push(".js",".jsx"),i.push(".cjs"),n.push(".mjs")),[...t,...i,...n]},"getSupportedExtensions"),Re=r(e=>{const t=[];if(!e)return t;const{outDir:i,declarationDir:n}=e;return i&&t.push(i),n&&t.push(n),t},"getDefaultExcludeSpec"),Ae=r(e=>e.replaceAll(/[.*+?^${}()|[\]\\]/g,String.raw`\$&`),"escapeForRegexp"),Le=`(?!(${["node_modules","bower_components","jspm_packages"].join("|")})(/|$))`,Oe=/(?:^|\/)[^.*?]+$/,De="**/*",Ve="[^/]",Ue="[^./]",Me="win32"===process.platform,je=r(({config:e,path:t},i=Ce())=>{if("extends"in e)throw new Error("tsconfig#extends must be resolved. Use getTsconfig or parseTsconfig to resolve it.");if(!a.isAbsolute(t))throw new Error("The tsconfig path must be absolute");Me&&(t=h(t));const n=a.dirname(t),{files:c,include:l,exclude:y,compilerOptions:E}=e,w=r(e=>a.isAbsolute(e)?e:Se(n,e),"resolvePattern"),C=null==c?void 0:c.map(w),S=Te(E),I=i?"":"i",N=(y||Re(E)).map(e=>{const t=w(e),i=Ae(t).replaceAll(String.raw`\*\*/`,"(.+/)?").replaceAll(String.raw`\*`,`${Ve}*`).replaceAll(String.raw`\?`,Ve);return new RegExp(`^${i}($|/)`,I)}),O=c||l?l:[De],j=O?O.map(e=>{let t=w(e);Oe.test(t)&&(t=Se(t,De));const i=Ae(t).replaceAll(String.raw`/\*\*`,`(/${Le}${Ue}${Ve}*)*?`).replaceAll(/(\/)?\\\*/g,(e,t)=>{const i=`(${Ue}|(\\.(?!min\\.js$))?)*`;return t?`/${Le}${Ue}${i}`:i}).replaceAll(/(\/)?\\\?/g,(e,t)=>t?`/${Le}${Ve}`:Ve);return new RegExp(`^${i}$`,I)}):void 0;return t=>{if(!a.isAbsolute(t))throw new Error("filePath must be absolute");return Me&&(t=h(t)),null!=C&&C.includes(t)||S.some(e=>t.endsWith(e))&&!N.some(e=>e.test(t))&&j&&j.some(e=>e.test(t))?e:void 0}},"createFilesMatcher"),Fe=r((e,t,i)=>{const n=a.resolve(e);let c=h(e);for(;;){const e=j(c,t,i);if(!e)return;const l=a.resolve(e),y=ve(l,i),E={path:h(l),config:y};if(je(E)(n))return E;const w=a.dirname(e),C=a.dirname(w);if(C===w)return;c=C}},"findConfigApplicable"),Be=r((e=process.cwd(),t="tsconfig.json",i=new Map,n=!1)=>{var a;return n?null==(a=Fe(e,t,i))?void 0:a.path:j(h(e),t,i)},"findTsconfig"),$e=r((e=process.cwd(),t="tsconfig.json",i=new Map,n=!1)=>{var a;if(!n){const n=Be(e,t,i);if(!n)return null;return{path:n,config:ve(n,i)}}return null!=(a=Fe(e,t,i))?a:null},"getTsconfig"),qe=/\*/g,Ge=r((e,t)=>{const i=e.match(qe);if(i&&i.length>1)throw new Error(t)},"assertStarCount"),Ke=r(e=>{if(e.includes("*")){const[t,i]=e.split("*");return{prefix:t,suffix:i}}return e},"parsePattern"),He=r(({prefix:e,suffix:t},i)=>i.startsWith(e)&&i.endsWith(t),"isPatternMatch"),ze=r((e,t,i)=>Object.entries(e).map(([e,n])=>(Ge(e,`Pattern '${e}' can have at most one '*' character.`),{pattern:Ke(e),substitutions:n.map(n=>{if(Ge(n,`Substitution '${n}' in pattern '${e}' can have at most one '*' character.`),!t&&!F.test(n)&&!a.isAbsolute(n))throw new Error("Non-relative paths are not allowed when 'baseUrl' is not set. Did you forget a leading './'?");return a.resolve(i,n)})})),"parsePaths"),Je=r(e=>{const{compilerOptions:t}=e.config;if(!t)return null;const{baseUrl:i,paths:n}=t;if(!i&&!n)return null;const c=te in t&&t[te],l=a.resolve(a.dirname(e.path),i||c||"."),y=n?ze(n,i,l):[];return e=>{if(F.test(e))return[];const t=[];for(const i of y){if(i.pattern===e)return i.substitutions.map(h);"string"!=typeof i.pattern&&t.push(i)}let n,c=-1;for(const i of t)He(i.pattern,e)&&i.pattern.prefix.length>c&&(c=i.pattern.prefix.length,n=i);if(!n)return i?[h(a.join(l,e))]:[];const E=e.slice(n.pattern.prefix.length,e.length-n.pattern.suffix.length);return n.substitutions.map(e=>h(e.replace("*",E)))}},"createPathsMatcher");t.createPathsMatcher=Je,t.getTsconfig=$e},"./node_modules/.pnpm/resolve-pkg-maps@1.0.0/node_modules/resolve-pkg-maps/dist/index.cjs"(e,t){"use strict";Object.defineProperty(t,"__esModule",{value:!0});const d=e=>null!==e&&"object"==typeof e,s=(e,t)=>Object.assign(new Error(`[${e}]: ${t}`),{code:e}),i="ERR_INVALID_PACKAGE_CONFIG",n="ERR_INVALID_PACKAGE_TARGET",a=/^\d+$/,c=/^(\.{1,2}|node_modules)$/i,l=/\/|\\/;var y,E=((y=E||{}).Export="exports",y.Import="imports",y);const f=(e,t,y,E,w)=>{if(null==t)return[];if("string"==typeof t){const[i,...a]=t.split(l);if(".."===i||a.some(e=>c.test(e)))throw s(n,`Invalid "${e}" target "${t}" defined in the package config`);return[w?t.replace(/\*/g,w):t]}if(Array.isArray(t))return t.flatMap(t=>f(e,t,y,E,w));if(d(t)){for(const n of Object.keys(t)){if(a.test(n))throw s(i,"Cannot contain numeric property keys");if("default"===n||E.includes(n))return f(e,t[n],y,E,w)}return[]}throw s(n,`Invalid "${e}" target "${t}"`)},w="*",v=(e,t)=>{const i=e.indexOf(w),n=t.indexOf(w);return i===n?t.length>e.length:n>i};function A(e,t){if(!t.includes(w)&&e.hasOwnProperty(t))return[t];let i,n;for(const a of Object.keys(e))if(a.includes(w)){const[e,c,l]=a.split(w);if(void 0===l&&t.startsWith(e)&&t.endsWith(c)){const l=t.slice(e.length,-c.length||void 0);l&&(!i||v(i,a))&&(i=a,n=l)}}return[i,n]}const C=/^\w+:/;t.resolveExports=(e,t,a)=>{if(!e)throw new Error('"exports" is required');t=""===t?".":`./${t}`,("string"==typeof e||Array.isArray(e)||d(e)&&(e=>Object.keys(e).reduce((e,t)=>{const n=""===t||"."!==t[0];if(void 0===e||e===n)return n;throw s(i,'"exports" cannot contain some keys starting with "." and some not')},void 0))(e))&&(e={".":e});const[c,l]=A(e,t),y=f(E.Export,e[c],t,a,l);if(0===y.length)throw s("ERR_PACKAGE_PATH_NOT_EXPORTED","."===t?'No "exports" main defined':`Package subpath '${t}' is not defined by "exports"`);for(const e of y)if(!e.startsWith("./")&&!C.test(e))throw s(n,`Invalid "exports" target "${e}" defined in the package config`);return y},t.resolveImports=(e,t,i)=>{if(!e)throw new Error('"imports" is required');const[n,a]=A(e,t),c=f(E.Import,e[n],t,i,a);if(0===c.length)throw s("ERR_PACKAGE_IMPORT_NOT_DEFINED",`Package import specifier "${t}" is not defined in package`);return c}}},t={};function __webpack_require__(i){var n=t[i];if(void 0!==n)return n.exports;var a=t[i]={exports:{}};return e[i](a,a.exports,__webpack_require__),a.exports}__webpack_require__.n=e=>{var t=e&&e.__esModule?()=>e.default:()=>e;return __webpack_require__.d(t,{a:t}),t},__webpack_require__.d=(e,t)=>{for(var i in t)__webpack_require__.o(t,i)&&!__webpack_require__.o(e,i)&&Object.defineProperty(e,i,{enumerable:!0,get:t[i]})},__webpack_require__.o=(e,t)=>Object.prototype.hasOwnProperty.call(e,t);var i={};(()=>{"use strict";__webpack_require__.d(i,{default:()=>createJiti});const e=require("node:os");var t=[509,0,227,0,150,4,294,9,1368,2,2,1,6,3,41,2,5,0,166,1,574,3,9,9,7,9,32,4,318,1,78,5,71,10,50,3,123,2,54,14,32,10,3,1,11,3,46,10,8,0,46,9,7,2,37,13,2,9,6,1,45,0,13,2,49,13,9,3,2,11,83,11,7,0,3,0,158,11,6,9,7,3,56,1,2,6,3,1,3,2,10,0,11,1,3,6,4,4,68,8,2,0,3,0,2,3,2,4,2,0,15,1,83,17,10,9,5,0,82,19,13,9,214,6,3,8,28,1,83,16,16,9,82,12,9,9,7,19,58,14,5,9,243,14,166,9,71,5,2,1,3,3,2,0,2,1,13,9,120,6,3,6,4,0,29,9,41,6,2,3,9,0,10,10,47,15,199,7,137,9,54,7,2,7,17,9,57,21,2,13,123,5,4,0,2,1,2,6,2,0,9,9,49,4,2,1,2,4,9,9,55,9,266,3,10,1,2,0,49,6,4,4,14,10,5350,0,7,14,11465,27,2343,9,87,9,39,4,60,6,26,9,535,9,470,0,2,54,8,3,82,0,12,1,19628,1,4178,9,519,45,3,22,543,4,4,5,9,7,3,6,31,3,149,2,1418,49,513,54,5,49,9,0,15,0,23,4,2,14,1361,6,2,16,3,6,2,1,2,4,101,0,161,6,10,9,357,0,62,13,499,13,245,1,2,9,233,0,3,0,8,1,6,0,475,6,110,6,6,9,4759,9,787719,239],n=[0,11,2,25,2,18,2,1,2,14,3,13,35,122,70,52,268,28,4,48,48,31,14,29,6,37,11,29,3,35,5,7,2,4,43,157,19,35,5,35,5,39,9,51,13,10,2,14,2,6,2,1,2,10,2,14,2,6,2,1,4,51,13,310,10,21,11,7,25,5,2,41,2,8,70,5,3,0,2,43,2,1,4,0,3,22,11,22,10,30,66,18,2,1,11,21,11,25,7,25,39,55,7,1,65,0,16,3,2,2,2,28,43,28,4,28,36,7,2,27,28,53,11,21,11,18,14,17,111,72,56,50,14,50,14,35,39,27,10,22,251,41,7,1,17,5,57,28,11,0,9,21,43,17,47,20,28,22,13,52,58,1,3,0,14,44,33,24,27,35,30,0,3,0,9,34,4,0,13,47,15,3,22,0,2,0,36,17,2,24,20,1,64,6,2,0,2,3,2,14,2,9,8,46,39,7,3,1,3,21,2,6,2,1,2,4,4,0,19,0,13,4,31,9,2,0,3,0,2,37,2,0,26,0,2,0,45,52,19,3,21,2,31,47,21,1,2,0,185,46,42,3,37,47,21,0,60,42,14,0,72,26,38,6,186,43,117,63,32,7,3,0,3,7,2,1,2,23,16,0,2,0,95,7,3,38,17,0,2,0,29,0,11,39,8,0,22,0,12,45,20,0,19,72,200,32,32,8,2,36,18,0,50,29,113,6,2,1,2,37,22,0,26,5,2,1,2,31,15,0,24,43,261,18,16,0,2,12,2,33,125,0,80,921,103,110,18,195,2637,96,16,1071,18,5,26,3994,6,582,6842,29,1763,568,8,30,18,78,18,29,19,47,17,3,32,20,6,18,433,44,212,63,33,24,3,24,45,74,6,0,67,12,65,1,2,0,15,4,10,7381,42,31,98,114,8702,3,2,6,2,1,2,290,16,0,30,2,3,0,15,3,9,395,2309,106,6,12,4,8,8,9,5991,84,2,70,2,1,3,0,3,1,3,3,2,11,2,0,2,6,2,64,2,3,3,7,2,6,2,27,2,3,2,4,2,0,4,6,2,339,3,24,2,24,2,30,2,24,2,30,2,24,2,30,2,24,2,30,2,24,2,7,1845,30,7,5,262,61,147,44,11,6,17,0,322,29,19,43,485,27,229,29,3,0,208,30,2,2,2,1,2,6,3,4,10,1,225,6,2,3,2,1,2,14,2,196,60,67,8,0,1205,3,2,26,2,1,2,0,3,0,2,9,2,3,2,0,2,0,7,0,5,0,2,0,2,0,2,2,2,1,2,0,3,0,2,0,2,0,2,0,2,0,2,1,2,0,3,3,2,6,2,3,2,3,2,0,2,9,2,16,6,2,2,4,2,16,4421,42719,33,4381,3,5773,3,7472,16,621,2467,541,1507,4938,6,8489],a="ªµºÀ-ÖØ-öø-ˁˆ-ˑˠ-ˤˬˮͰ-ʹͶͷͺ-ͽͿΆΈ-ΊΌΎ-ΡΣ-ϵϷ-ҁҊ-ԯԱ-Ֆՙՠ-ֈא-תׯ-ײؠ-يٮٯٱ-ۓەۥۦۮۯۺ-ۼۿܐܒ-ܯݍ-ޥޱߊ-ߪߴߵߺࠀ-ࠕࠚࠤࠨࡀ-ࡘࡠ-ࡪࡰ-ࢇࢉ-࢏ࢠ-ࣉऄ-हऽॐक़-ॡॱ-ঀঅ-ঌএঐও-নপ-রলশ-হঽৎড়ঢ়য়-ৡৰৱৼਅ-ਊਏਐਓ-ਨਪ-ਰਲਲ਼ਵਸ਼ਸਹਖ਼-ੜਫ਼ੲ-ੴઅ-ઍએ-ઑઓ-નપ-રલળવ-હઽૐૠૡૹଅ-ଌଏଐଓ-ନପ-ରଲଳଵ-ହଽଡ଼ଢ଼ୟ-ୡୱஃஅ-ஊஎ-ஐஒ-கஙசஜஞடணதந-பம-ஹௐఅ-ఌఎ-ఐఒ-నప-హఽౘ-ౚ౜ౝౠౡಀಅ-ಌಎ-ಐಒ-ನಪ-ಳವ-ಹಽ೜-ೞೠೡೱೲഄ-ഌഎ-ഐഒ-ഺഽൎൔ-ൖൟ-ൡൺ-ൿඅ-ඖක-නඳ-රලව-ෆก-ะาำเ-ๆກຂຄຆ-ຊຌ-ຣລວ-ະາຳຽເ-ໄໆໜ-ໟༀཀ-ཇཉ-ཬྈ-ྌက-ဪဿၐ-ၕၚ-ၝၡၥၦၮ-ၰၵ-ႁႎႠ-ჅჇჍა-ჺჼ-ቈቊ-ቍቐ-ቖቘቚ-ቝበ-ኈኊ-ኍነ-ኰኲ-ኵኸ-ኾዀዂ-ዅወ-ዖዘ-ጐጒ-ጕጘ-ፚᎀ-ᎏᎠ-Ᏽᏸ-ᏽᐁ-ᙬᙯ-ᙿᚁ-ᚚᚠ-ᛪᛮ-ᛸᜀ-ᜑᜟ-ᜱᝀ-ᝑᝠ-ᝬᝮ-ᝰក-ឳៗៜᠠ-ᡸᢀ-ᢨᢪᢰ-ᣵᤀ-ᤞᥐ-ᥭᥰ-ᥴᦀ-ᦫᦰ-ᧉᨀ-ᨖᨠ-ᩔᪧᬅ-ᬳᭅ-ᭌᮃ-ᮠᮮᮯᮺ-ᯥᰀ-ᰣᱍ-ᱏᱚ-ᱽᲀ-ᲊᲐ-ᲺᲽ-Ჿᳩ-ᳬᳮ-ᳳᳵᳶᳺᴀ-ᶿḀ-ἕἘ-Ἕἠ-ὅὈ-Ὅὐ-ὗὙὛὝὟ-ώᾀ-ᾴᾶ-ᾼιῂ-ῄῆ-ῌῐ-ΐῖ-Ίῠ-Ῥῲ-ῴῶ-ῼⁱⁿₐ-ₜℂℇℊ-ℓℕ℘-ℝℤΩℨK-ℹℼ-ℿⅅ-ⅉⅎⅠ-ↈⰀ-ⳤⳫ-ⳮⳲⳳⴀ-ⴥⴧⴭⴰ-ⵧⵯⶀ-ⶖⶠ-ⶦⶨ-ⶮⶰ-ⶶⶸ-ⶾⷀ-ⷆⷈ-ⷎⷐ-ⷖⷘ-ⷞ々-〇〡-〩〱-〵〸-〼ぁ-ゖ゛-ゟァ-ヺー-ヿㄅ-ㄯㄱ-ㆎㆠ-ㆿㇰ-ㇿ㐀-䶿一-ꒌꓐ-ꓽꔀ-ꘌꘐ-ꘟꘪꘫꙀ-ꙮꙿ-ꚝꚠ-ꛯꜗ-ꜟꜢ-ꞈꞋ-Ƛ꟱-ꠁꠃ-ꠅꠇ-ꠊꠌ-ꠢꡀ-ꡳꢂ-ꢳꣲ-ꣷꣻꣽꣾꤊ-ꤥꤰ-ꥆꥠ-ꥼꦄ-ꦲꧏꧠ-ꧤꧦ-ꧯꧺ-ꧾꨀ-ꨨꩀ-ꩂꩄ-ꩋꩠ-ꩶꩺꩾ-ꪯꪱꪵꪶꪹ-ꪽꫀꫂꫛ-ꫝꫠ-ꫪꫲ-ꫴꬁ-ꬆꬉ-ꬎꬑ-ꬖꬠ-ꬦꬨ-ꬮꬰ-ꭚꭜ-ꭩꭰ-ꯢ가-힣ힰ-ퟆퟋ-ퟻ豈-舘並-龎ﬀ-ﬆﬓ-ﬗיִײַ-ﬨשׁ-זּטּ-לּמּנּסּףּפּצּ-ﮱﯓ-ﴽﵐ-ﶏﶒ-ﷇﷰ-ﷻﹰ-ﹴﹶ-ﻼＡ-Ｚａ-ｚｦ-ﾾￂ-ￇￊ-ￏￒ-ￗￚ-ￜ",c={3:"abstract boolean byte char class double enum export extends final float goto implements import int interface long native package private protected public short static super synchronized throws transient volatile",5:"class enum extends super const export import",6:"enum",strict:"implements interface let package private protected public static yield",strictBind:"eval arguments"},l="break case catch continue debugger default do else finally for function if return switch throw try var while with null true false instanceof typeof void delete new in this",y={5:l,"5module":l+" export import",6:l+" const class extends export import super"},E=/^in(stanceof)?$/,w=new RegExp("["+a+"]"),C=new RegExp("["+a+"‌‍·̀-ͯ·҃-֑҇-ׇֽֿׁׂׅׄؐ-ًؚ-٩ٰۖ-ۜ۟-۪ۤۧۨ-ۭ۰-۹ܑܰ-݊ަ-ް߀-߉߫-߽߳ࠖ-࠙ࠛ-ࠣࠥ-ࠧࠩ-࡙࠭-࡛ࢗ-࢟࣊-ࣣ࣡-ःऺ-़ा-ॏ॑-ॗॢॣ०-९ঁ-ঃ়া-ৄেৈো-্ৗৢৣ০-৯৾ਁ-ਃ਼ਾ-ੂੇੈੋ-੍ੑ੦-ੱੵઁ-ઃ઼ા-ૅે-ૉો-્ૢૣ૦-૯ૺ-૿ଁ-ଃ଼ା-ୄେୈୋ-୍୕-ୗୢୣ୦-୯ஂா-ூெ-ைொ-்ௗ௦-௯ఀ-ఄ఼ా-ౄె-ైొ-్ౕౖౢౣ౦-౯ಁ-ಃ಼ಾ-ೄೆ-ೈೊ-್ೕೖೢೣ೦-೯ೳഀ-ഃ഻഼ാ-ൄെ-ൈൊ-്ൗൢൣ൦-൯ඁ-ඃ්ා-ුූෘ-ෟ෦-෯ෲෳัิ-ฺ็-๎๐-๙ັິ-ຼ່-໎໐-໙༘༙༠-༩༹༵༷༾༿ཱ-྄྆྇ྍ-ྗྙ-ྼ࿆ါ-ှ၀-၉ၖ-ၙၞ-ၠၢ-ၤၧ-ၭၱ-ၴႂ-ႍႏ-ႝ፝-፟፩-፱ᜒ-᜕ᜲ-᜴ᝒᝓᝲᝳ឴-៓៝០-៩᠋-᠍᠏-᠙ᢩᤠ-ᤫᤰ-᤻᥆-᥏᧐-᧚ᨗ-ᨛᩕ-ᩞ᩠-᩿᩼-᪉᪐-᪙᪰-᪽ᪿ-᫝᫠-᫫ᬀ-ᬄ᬴-᭄᭐-᭙᭫-᭳ᮀ-ᮂᮡ-ᮭ᮰-᮹᯦-᯳ᰤ-᰷᱀-᱉᱐-᱙᳐-᳔᳒-᳨᳭᳴᳷-᳹᷀-᷿‌‍‿⁀⁔⃐-⃥⃜⃡-⃰⳯-⵿⳱ⷠ-〪ⷿ-゙゚〯・꘠-꘩꙯ꙴ-꙽ꚞꚟ꛰꛱ꠂ꠆ꠋꠣ-ꠧ꠬ꢀꢁꢴ-ꣅ꣐-꣙꣠-꣱ꣿ-꤉ꤦ-꤭ꥇ-꥓ꦀ-ꦃ꦳-꧀꧐-꧙ꧥ꧰-꧹ꨩ-ꨶꩃꩌꩍ꩐-꩙ꩻ-ꩽꪰꪲ-ꪴꪷꪸꪾ꪿꫁ꫫ-ꫯꫵ꫶ꯣ-ꯪ꯬꯭꯰-꯹ﬞ︀-️︠-︯︳︴﹍-﹏０-９＿･]");function isInAstralSet(e,t){for(var i=65536,n=0;n<t.length;n+=2){if((i+=t[n])>e)return!1;if((i+=t[n+1])>=e)return!0}return!1}function isIdentifierStart(e,t){return e<65?36===e:e<91||(e<97?95===e:e<123||(e<=65535?e>=170&&w.test(String.fromCharCode(e)):!1!==t&&isInAstralSet(e,n)))}function isIdentifierChar(e,i){return e<48?36===e:e<58||!(e<65)&&(e<91||(e<97?95===e:e<123||(e<=65535?e>=170&&C.test(String.fromCharCode(e)):!1!==i&&(isInAstralSet(e,n)||isInAstralSet(e,t)))))}var acorn_TokenType=function(e,t){void 0===t&&(t={}),this.label=e,this.keyword=t.keyword,this.beforeExpr=!!t.beforeExpr,this.startsExpr=!!t.startsExpr,this.isLoop=!!t.isLoop,this.isAssign=!!t.isAssign,this.prefix=!!t.prefix,this.postfix=!!t.postfix,this.binop=t.binop||null,this.updateContext=null};function binop(e,t){return new acorn_TokenType(e,{beforeExpr:!0,binop:t})}var S={beforeExpr:!0},I={startsExpr:!0},N={};function kw(e,t){return void 0===t&&(t={}),t.keyword=e,N[e]=new acorn_TokenType(e,t)}var O={num:new acorn_TokenType("num",I),regexp:new acorn_TokenType("regexp",I),string:new acorn_TokenType("string",I),name:new acorn_TokenType("name",I),privateId:new acorn_TokenType("privateId",I),eof:new acorn_TokenType("eof"),bracketL:new acorn_TokenType("[",{beforeExpr:!0,startsExpr:!0}),bracketR:new acorn_TokenType("]"),braceL:new acorn_TokenType("{",{beforeExpr:!0,startsExpr:!0}),braceR:new acorn_TokenType("}"),parenL:new acorn_TokenType("(",{beforeExpr:!0,startsExpr:!0}),parenR:new acorn_TokenType(")"),comma:new acorn_TokenType(",",S),semi:new acorn_TokenType(";",S),colon:new acorn_TokenType(":",S),dot:new acorn_TokenType("."),question:new acorn_TokenType("?",S),questionDot:new acorn_TokenType("?."),arrow:new acorn_TokenType("=>",S),template:new acorn_TokenType("template"),invalidTemplate:new acorn_TokenType("invalidTemplate"),ellipsis:new acorn_TokenType("...",S),backQuote:new acorn_TokenType("`",I),dollarBraceL:new acorn_TokenType("${",{beforeExpr:!0,startsExpr:!0}),eq:new acorn_TokenType("=",{beforeExpr:!0,isAssign:!0}),assign:new acorn_TokenType("_=",{beforeExpr:!0,isAssign:!0}),incDec:new acorn_TokenType("++/--",{prefix:!0,postfix:!0,startsExpr:!0}),prefix:new acorn_TokenType("!/~",{beforeExpr:!0,prefix:!0,startsExpr:!0}),logicalOR:binop("||",1),logicalAND:binop("&&",2),bitwiseOR:binop("|",3),bitwiseXOR:binop("^",4),bitwiseAND:binop("&",5),equality:binop("==/!=/===/!==",6),relational:binop("</>/<=/>=",7),bitShift:binop("<</>>/>>>",8),plusMin:new acorn_TokenType("+/-",{beforeExpr:!0,binop:9,prefix:!0,startsExpr:!0}),modulo:binop("%",10),star:binop("*",10),slash:binop("/",10),starstar:new acorn_TokenType("**",{beforeExpr:!0}),coalesce:binop("??",1),_break:kw("break"),_case:kw("case",S),_catch:kw("catch"),_continue:kw("continue"),_debugger:kw("debugger"),_default:kw("default",S),_do:kw("do",{isLoop:!0,beforeExpr:!0}),_else:kw("else",S),_finally:kw("finally"),_for:kw("for",{isLoop:!0}),_function:kw("function",I),_if:kw("if"),_return:kw("return",S),_switch:kw("switch"),_throw:kw("throw",S),_try:kw("try"),_var:kw("var"),_const:kw("const"),_while:kw("while",{isLoop:!0}),_with:kw("with"),_new:kw("new",{beforeExpr:!0,startsExpr:!0}),_this:kw("this",I),_super:kw("super",I),_class:kw("class",I),_extends:kw("extends",S),_export:kw("export"),_import:kw("import",I),_null:kw("null",I),_true:kw("true",I),_false:kw("false",I),_in:kw("in",{beforeExpr:!0,binop:7}),_instanceof:kw("instanceof",{beforeExpr:!0,binop:7}),_typeof:kw("typeof",{beforeExpr:!0,prefix:!0,startsExpr:!0}),_void:kw("void",{beforeExpr:!0,prefix:!0,startsExpr:!0}),_delete:kw("delete",{beforeExpr:!0,prefix:!0,startsExpr:!0})},j=/\r\n?|\n|\u2028|\u2029/,F=new RegExp(j.source,"g");function isNewLine(e){return 10===e||13===e||8232===e||8233===e}function nextLineBreak(e,t,i){void 0===i&&(i=e.length);for(var n=t;n<i;n++){var a=e.charCodeAt(n);if(isNewLine(a))return n<i-1&&13===a&&10===e.charCodeAt(n+1)?n+2:n+1}return-1}var B=/[\u1680\u2000-\u200a\u202f\u205f\u3000\ufeff]/,$=/(?:\s|\/\/.*|\/\*[^]*?\*\/)*/g,q=Object.prototype,W=q.hasOwnProperty,K=q.toString,H=Object.hasOwn||function(e,t){return W.call(e,t)},Y=Array.isArray||function(e){return"[object Array]"===K.call(e)},Q=Object.create(null);function wordsRegexp(e){return Q[e]||(Q[e]=new RegExp("^(?:"+e.replace(/ /g,"|")+")$"))}function codePointToString(e){return e<=65535?String.fromCharCode(e):(e-=65536,String.fromCharCode(55296+(e>>10),56320+(1023&e)))}var Z=/(?:[\uD800-\uDBFF](?![\uDC00-\uDFFF])|(?:[^\uD800-\uDBFF]|^)[\uDC00-\uDFFF])/,acorn_Position=function(e,t){this.line=e,this.column=t};acorn_Position.prototype.offset=function(e){return new acorn_Position(this.line,this.column+e)};var acorn_SourceLocation=function(e,t,i){this.start=t,this.end=i,null!==e.sourceFile&&(this.source=e.sourceFile)};function getLineInfo(e,t){for(var i=1,n=0;;){var a=nextLineBreak(e,n,t);if(a<0)return new acorn_Position(i,t-n);++i,n=a}}var X={ecmaVersion:null,sourceType:"script",onInsertedSemicolon:null,onTrailingComma:null,allowReserved:null,allowReturnOutsideFunction:!1,allowImportExportEverywhere:!1,allowAwaitOutsideFunction:null,allowSuperOutsideMethod:null,allowHashBang:!1,checkPrivateFields:!0,locations:!1,onToken:null,onComment:null,ranges:!1,program:null,sourceFile:null,directSourceFile:null,preserveParens:!1},te=!1;function getOptions(e){var t={};for(var i in X)t[i]=e&&H(e,i)?e[i]:X[i];if("latest"===t.ecmaVersion?t.ecmaVersion=1e8:null==t.ecmaVersion?(!te&&"object"==typeof console&&console.warn&&(te=!0,console.warn("Since Acorn 8.0.0, options.ecmaVersion is required.\nDefaulting to 2020, but this will stop working in the future.")),t.ecmaVersion=11):t.ecmaVersion>=2015&&(t.ecmaVersion-=2009),null==t.allowReserved&&(t.allowReserved=t.ecmaVersion<5),e&&null!=e.allowHashBang||(t.allowHashBang=t.ecmaVersion>=14),Y(t.onToken)){var n=t.onToken;t.onToken=function(e){return n.push(e)}}if(Y(t.onComment)&&(t.onComment=function(e,t){return function(i,n,a,c,l,y){var E={type:i?"Block":"Line",value:n,start:a,end:c};e.locations&&(E.loc=new acorn_SourceLocation(this,l,y)),e.ranges&&(E.range=[a,c]),t.push(E)}}(t,t.onComment)),"commonjs"===t.sourceType&&t.allowAwaitOutsideFunction)throw new Error("Cannot use allowAwaitOutsideFunction with sourceType: commonjs");return t}var ie=256,se=259;function functionFlags(e,t){return 2|(e?4:0)|(t?8:0)}var acorn_Parser=function(e,t,i){this.options=e=getOptions(e),this.sourceFile=e.sourceFile,this.keywords=wordsRegexp(y[e.ecmaVersion>=6?6:"module"===e.sourceType?"5module":5]);var n="";!0!==e.allowReserved&&(n=c[e.ecmaVersion>=6?6:5===e.ecmaVersion?5:3],"module"===e.sourceType&&(n+=" await")),this.reservedWords=wordsRegexp(n);var a=(n?n+" ":"")+c.strict;this.reservedWordsStrict=wordsRegexp(a),this.reservedWordsStrictBind=wordsRegexp(a+" "+c.strictBind),this.input=String(t),this.containsEsc=!1,i?(this.pos=i,this.lineStart=this.input.lastIndexOf("\n",i-1)+1,this.curLine=this.input.slice(0,this.lineStart).split(j).length):(this.pos=this.lineStart=0,this.curLine=1),this.type=O.eof,this.value=null,this.start=this.end=this.pos,this.startLoc=this.endLoc=this.curPosition(),this.lastTokEndLoc=this.lastTokStartLoc=null,this.lastTokStart=this.lastTokEnd=this.pos,this.context=this.initialContext(),this.exprAllowed=!0,this.inModule="module"===e.sourceType,this.strict=this.inModule||this.strictDirective(this.pos),this.potentialArrowAt=-1,this.potentialArrowInForAwait=!1,this.yieldPos=this.awaitPos=this.awaitIdentPos=0,this.labels=[],this.undefinedExports=Object.create(null),0===this.pos&&e.allowHashBang&&"#!"===this.input.slice(0,2)&&this.skipLineComment(2),this.scopeStack=[],this.enterScope("commonjs"===this.options.sourceType?2:1),this.regexpState=null,this.privateNameStack=[]},re={inFunction:{configurable:!0},inGenerator:{configurable:!0},inAsync:{configurable:!0},canAwait:{configurable:!0},allowReturn:{configurable:!0},allowSuper:{configurable:!0},allowDirectSuper:{configurable:!0},treatFunctionsAsVar:{configurable:!0},allowNewDotTarget:{configurable:!0},allowUsing:{configurable:!0},inClassStaticBlock:{configurable:!0}};acorn_Parser.prototype.parse=function(){var e=this.options.program||this.startNode();return this.nextToken(),this.parseTopLevel(e)},re.inFunction.get=function(){return(2&this.currentVarScope().flags)>0},re.inGenerator.get=function(){return(8&this.currentVarScope().flags)>0},re.inAsync.get=function(){return(4&this.currentVarScope().flags)>0},re.canAwait.get=function(){for(var e=this.scopeStack.length-1;e>=0;e--){var t=this.scopeStack[e].flags;if(768&t)return!1;if(2&t)return(4&t)>0}return this.inModule&&this.options.ecmaVersion>=13||this.options.allowAwaitOutsideFunction},re.allowReturn.get=function(){return!!this.inFunction||!!(this.options.allowReturnOutsideFunction&&1&this.currentVarScope().flags)},re.allowSuper.get=function(){return(64&this.currentThisScope().flags)>0||this.options.allowSuperOutsideMethod},re.allowDirectSuper.get=function(){return(128&this.currentThisScope().flags)>0},re.treatFunctionsAsVar.get=function(){return this.treatFunctionsAsVarInScope(this.currentScope())},re.allowNewDotTarget.get=function(){for(var e=this.scopeStack.length-1;e>=0;e--){var t=this.scopeStack[e].flags;if(768&t||2&t&&!(16&t))return!0}return!1},re.allowUsing.get=function(){var e=this.currentScope().flags;return!(1024&e)&&!(!this.inModule&&1&e)},re.inClassStaticBlock.get=function(){return(this.currentVarScope().flags&ie)>0},acorn_Parser.extend=function(){for(var e=[],t=arguments.length;t--;)e[t]=arguments[t];for(var i=this,n=0;n<e.length;n++)i=e[n](i);return i},acorn_Parser.parse=function(e,t){return new this(t,e).parse()},acorn_Parser.parseExpressionAt=function(e,t,i){var n=new this(i,e,t);return n.nextToken(),n.parseExpression()},acorn_Parser.tokenizer=function(e,t){return new this(t,e)},Object.defineProperties(acorn_Parser.prototype,re);var ne=acorn_Parser.prototype,ae=/^(?:'((?:\\[^]|[^'\\])*?)'|"((?:\\[^]|[^"\\])*?)")/;ne.strictDirective=function(e){if(this.options.ecmaVersion<5)return!1;for(;;){$.lastIndex=e,e+=$.exec(this.input)[0].length;var t=ae.exec(this.input.slice(e));if(!t)return!1;if("use strict"===(t[1]||t[2])){$.lastIndex=e+t[0].length;var i=$.exec(this.input),n=i.index+i[0].length,a=this.input.charAt(n);return";"===a||"}"===a||j.test(i[0])&&!(/[(`.[+\-/*%<>=,?^&]/.test(a)||"!"===a&&"="===this.input.charAt(n+1))}e+=t[0].length,$.lastIndex=e,e+=$.exec(this.input)[0].length,";"===this.input[e]&&e++}},ne.eat=function(e){return this.type===e&&(this.next(),!0)},ne.isContextual=function(e){return this.type===O.name&&this.value===e&&!this.containsEsc},ne.eatContextual=function(e){return!!this.isContextual(e)&&(this.next(),!0)},ne.expectContextual=function(e){this.eatContextual(e)||this.unexpected()},ne.canInsertSemicolon=function(){return this.type===O.eof||this.type===O.braceR||j.test(this.input.slice(this.lastTokEnd,this.start))},ne.insertSemicolon=function(){if(this.canInsertSemicolon())return this.options.onInsertedSemicolon&&this.options.onInsertedSemicolon(this.lastTokEnd,this.lastTokEndLoc),!0},ne.semicolon=function(){this.eat(O.semi)||this.insertSemicolon()||this.unexpected()},ne.afterTrailingComma=function(e,t){if(this.type===e)return this.options.onTrailingComma&&this.options.onTrailingComma(this.lastTokStart,this.lastTokStartLoc),t||this.next(),!0},ne.expect=function(e){this.eat(e)||this.unexpected()},ne.unexpected=function(e){this.raise(null!=e?e:this.start,"Unexpected token")};var acorn_DestructuringErrors=function(){this.shorthandAssign=this.trailingComma=this.parenthesizedAssign=this.parenthesizedBind=this.doubleProto=-1};ne.checkPatternErrors=function(e,t){if(e){e.trailingComma>-1&&this.raiseRecoverable(e.trailingComma,"Comma is not permitted after the rest element");var i=t?e.parenthesizedAssign:e.parenthesizedBind;i>-1&&this.raiseRecoverable(i,t?"Assigning to rvalue":"Parenthesized pattern")}},ne.checkExpressionErrors=function(e,t){if(!e)return!1;var i=e.shorthandAssign,n=e.doubleProto;if(!t)return i>=0||n>=0;i>=0&&this.raise(i,"Shorthand property assignments are valid only in destructuring patterns"),n>=0&&this.raiseRecoverable(n,"Redefinition of __proto__ property")},ne.checkYieldAwaitInDefaultParams=function(){this.yieldPos&&(!this.awaitPos||this.yieldPos<this.awaitPos)&&this.raise(this.yieldPos,"Yield expression cannot be a default value"),this.awaitPos&&this.raise(this.awaitPos,"Await expression cannot be a default value")},ne.isSimpleAssignTarget=function(e){return"ParenthesizedExpression"===e.type?this.isSimpleAssignTarget(e.expression):"Identifier"===e.type||"MemberExpression"===e.type};var oe=acorn_Parser.prototype;oe.parseTopLevel=function(e){var t=Object.create(null);for(e.body||(e.body=[]);this.type!==O.eof;){var i=this.parseStatement(null,!0,t);e.body.push(i)}if(this.inModule)for(var n=0,a=Object.keys(this.undefinedExports);n<a.length;n+=1){var c=a[n];this.raiseRecoverable(this.undefinedExports[c].start,"Export '"+c+"' is not defined")}return this.adaptDirectivePrologue(e.body),this.next(),e.sourceType="commonjs"===this.options.sourceType?"script":this.options.sourceType,this.finishNode(e,"Program")};var ce={kind:"loop"},he={kind:"switch"};oe.isLet=function(e){if(this.options.ecmaVersion<6||!this.isContextual("let"))return!1;$.lastIndex=this.pos;var t=$.exec(this.input),i=this.pos+t[0].length,n=this.fullCharCodeAt(i);if(91===n||92===n)return!0;if(e)return!1;if(123===n)return!0;if(isIdentifierStart(n)){var a=i;do{i+=n<=65535?1:2}while(isIdentifierChar(n=this.fullCharCodeAt(i)));if(92===n)return!0;var c=this.input.slice(a,i);if(!E.test(c))return!0}return!1},oe.isAsyncFunction=function(){if(this.options.ecmaVersion<8||!this.isContextual("async"))return!1;$.lastIndex=this.pos;var e,t=$.exec(this.input),i=this.pos+t[0].length;return!(j.test(this.input.slice(this.pos,i))||"function"!==this.input.slice(i,i+8)||i+8!==this.input.length&&(isIdentifierChar(e=this.fullCharCodeAt(i+8))||92===e))},oe.isUsingKeyword=function(e,t){if(this.options.ecmaVersion<17||!this.isContextual(e?"await":"using"))return!1;$.lastIndex=this.pos;var i=$.exec(this.input),n=this.pos+i[0].length;if(j.test(this.input.slice(this.pos,n)))return!1;if(e){var a,c=n+5;if("using"!==this.input.slice(n,c)||c===this.input.length||isIdentifierChar(a=this.fullCharCodeAt(c))||92===a)return!1;$.lastIndex=c;var l=$.exec(this.input);if(n=c+l[0].length,l&&j.test(this.input.slice(c,n)))return!1}var y=this.fullCharCodeAt(n);if(!isIdentifierStart(y)&&92!==y)return!1;var w=n;do{n+=y<=65535?1:2}while(isIdentifierChar(y=this.fullCharCodeAt(n)));if(92===y)return!0;var C=this.input.slice(w,n);return!(E.test(C)||t&&"of"===C)},oe.isAwaitUsing=function(e){return this.isUsingKeyword(!0,e)},oe.isUsing=function(e){return this.isUsingKeyword(!1,e)},oe.parseStatement=function(e,t,i){var n,a=this.type,c=this.startNode();switch(this.isLet(e)&&(a=O._var,n="let"),a){case O._break:case O._continue:return this.parseBreakContinueStatement(c,a.keyword);case O._debugger:return this.parseDebuggerStatement(c);case O._do:return this.parseDoStatement(c);case O._for:return this.parseForStatement(c);case O._function:return e&&(this.strict||"if"!==e&&"label"!==e)&&this.options.ecmaVersion>=6&&this.unexpected(),this.parseFunctionStatement(c,!1,!e);case O._class:return e&&this.unexpected(),this.parseClass(c,!0);case O._if:return this.parseIfStatement(c);case O._return:return this.parseReturnStatement(c);case O._switch:return this.parseSwitchStatement(c);case O._throw:return this.parseThrowStatement(c);case O._try:return this.parseTryStatement(c);case O._const:case O._var:return n=n||this.value,e&&"var"!==n&&this.unexpected(),this.parseVarStatement(c,n);case O._while:return this.parseWhileStatement(c);case O._with:return this.parseWithStatement(c);case O.braceL:return this.parseBlock(!0,c);case O.semi:return this.parseEmptyStatement(c);case O._export:case O._import:if(this.options.ecmaVersion>10&&a===O._import){$.lastIndex=this.pos;var l=$.exec(this.input),y=this.pos+l[0].length,E=this.input.charCodeAt(y);if(40===E||46===E)return this.parseExpressionStatement(c,this.parseExpression())}return this.options.allowImportExportEverywhere||(t||this.raise(this.start,"'import' and 'export' may only appear at the top level"),this.inModule||this.raise(this.start,"'import' and 'export' may appear only with 'sourceType: module'")),a===O._import?this.parseImport(c):this.parseExport(c,i);default:if(this.isAsyncFunction())return e&&this.unexpected(),this.next(),this.parseFunctionStatement(c,!0,!e);var w=this.isAwaitUsing(!1)?"await using":this.isUsing(!1)?"using":null;if(w)return this.allowUsing||this.raise(this.start,"Using declaration cannot appear in the top level when source type is `script` or in the bare case statement"),"await using"===w&&(this.canAwait||this.raise(this.start,"Await using cannot appear outside of async function"),this.next()),this.next(),this.parseVar(c,!1,w),this.semicolon(),this.finishNode(c,"VariableDeclaration");var C=this.value,S=this.parseExpression();return a===O.name&&"Identifier"===S.type&&this.eat(O.colon)?this.parseLabeledStatement(c,C,S,e):this.parseExpressionStatement(c,S)}},oe.parseBreakContinueStatement=function(e,t){var i="break"===t;this.next(),this.eat(O.semi)||this.insertSemicolon()?e.label=null:this.type!==O.name?this.unexpected():(e.label=this.parseIdent(),this.semicolon());for(var n=0;n<this.labels.length;++n){var a=this.labels[n];if(null==e.label||a.name===e.label.name){if(null!=a.kind&&(i||"loop"===a.kind))break;if(e.label&&i)break}}return n===this.labels.length&&this.raise(e.start,"Unsyntactic "+t),this.finishNode(e,i?"BreakStatement":"ContinueStatement")},oe.parseDebuggerStatement=function(e){return this.next(),this.semicolon(),this.finishNode(e,"DebuggerStatement")},oe.parseDoStatement=function(e){return this.next(),this.labels.push(ce),e.body=this.parseStatement("do"),this.labels.pop(),this.expect(O._while),e.test=this.parseParenExpression(),this.options.ecmaVersion>=6?this.eat(O.semi):this.semicolon(),this.finishNode(e,"DoWhileStatement")},oe.parseForStatement=function(e){this.next();var t=this.options.ecmaVersion>=9&&this.canAwait&&this.eatContextual("await")?this.lastTokStart:-1;if(this.labels.push(ce),this.enterScope(0),this.expect(O.parenL),this.type===O.semi)return t>-1&&this.unexpected(t),this.parseFor(e,null);var i=this.isLet();if(this.type===O._var||this.type===O._const||i){var n=this.startNode(),a=i?"let":this.value;return this.next(),this.parseVar(n,!0,a),this.finishNode(n,"VariableDeclaration"),this.parseForAfterInit(e,n,t)}var c=this.isContextual("let"),l=!1,y=this.isUsing(!0)?"using":this.isAwaitUsing(!0)?"await using":null;if(y){var E=this.startNode();return this.next(),"await using"===y&&(this.canAwait||this.raise(this.start,"Await using cannot appear outside of async function"),this.next()),this.parseVar(E,!0,y),this.finishNode(E,"VariableDeclaration"),this.parseForAfterInit(e,E,t)}var w=this.containsEsc,C=new acorn_DestructuringErrors,S=this.start,I=t>-1?this.parseExprSubscripts(C,"await"):this.parseExpression(!0,C);return this.type===O._in||(l=this.options.ecmaVersion>=6&&this.isContextual("of"))?(t>-1?(this.type===O._in&&this.unexpected(t),e.await=!0):l&&this.options.ecmaVersion>=8&&(I.start!==S||w||"Identifier"!==I.type||"async"!==I.name?this.options.ecmaVersion>=9&&(e.await=!1):this.unexpected()),c&&l&&this.raise(I.start,"The left-hand side of a for-of loop may not start with 'let'."),this.toAssignable(I,!1,C),this.checkLValPattern(I),this.parseForIn(e,I)):(this.checkExpressionErrors(C,!0),t>-1&&this.unexpected(t),this.parseFor(e,I))},oe.parseForAfterInit=function(e,t,i){return(this.type===O._in||this.options.ecmaVersion>=6&&this.isContextual("of"))&&1===t.declarations.length?(this.options.ecmaVersion>=9&&(this.type===O._in?i>-1&&this.unexpected(i):e.await=i>-1),this.parseForIn(e,t)):(i>-1&&this.unexpected(i),this.parseFor(e,t))},oe.parseFunctionStatement=function(e,t,i){return this.next(),this.parseFunction(e,pe|(i?0:ue),!1,t)},oe.parseIfStatement=function(e){return this.next(),e.test=this.parseParenExpression(),e.consequent=this.parseStatement("if"),e.alternate=this.eat(O._else)?this.parseStatement("if"):null,this.finishNode(e,"IfStatement")},oe.parseReturnStatement=function(e){return this.allowReturn||this.raise(this.start,"'return' outside of function"),this.next(),this.eat(O.semi)||this.insertSemicolon()?e.argument=null:(e.argument=this.parseExpression(),this.semicolon()),this.finishNode(e,"ReturnStatement")},oe.parseSwitchStatement=function(e){var t;this.next(),e.discriminant=this.parseParenExpression(),e.cases=[],this.expect(O.braceL),this.labels.push(he),this.enterScope(1024);for(var i=!1;this.type!==O.braceR;)if(this.type===O._case||this.type===O._default){var n=this.type===O._case;t&&this.finishNode(t,"SwitchCase"),e.cases.push(t=this.startNode()),t.consequent=[],this.next(),n?t.test=this.parseExpression():(i&&this.raiseRecoverable(this.lastTokStart,"Multiple default clauses"),i=!0,t.test=null),this.expect(O.colon)}else t||this.unexpected(),t.consequent.push(this.parseStatement(null));return this.exitScope(),t&&this.finishNode(t,"SwitchCase"),this.next(),this.labels.pop(),this.finishNode(e,"SwitchStatement")},oe.parseThrowStatement=function(e){return this.next(),j.test(this.input.slice(this.lastTokEnd,this.start))&&this.raise(this.lastTokEnd,"Illegal newline after throw"),e.argument=this.parseExpression(),this.semicolon(),this.finishNode(e,"ThrowStatement")};var le=[];oe.parseCatchClauseParam=function(){var e=this.parseBindingAtom(),t="Identifier"===e.type;return this.enterScope(t?32:0),this.checkLValPattern(e,t?4:2),this.expect(O.parenR),e},oe.parseTryStatement=function(e){if(this.next(),e.block=this.parseBlock(),e.handler=null,this.type===O._catch){var t=this.startNode();this.next(),this.eat(O.parenL)?t.param=this.parseCatchClauseParam():(this.options.ecmaVersion<10&&this.unexpected(),t.param=null,this.enterScope(0)),t.body=this.parseBlock(!1),this.exitScope(),e.handler=this.finishNode(t,"CatchClause")}return e.finalizer=this.eat(O._finally)?this.parseBlock():null,e.handler||e.finalizer||this.raise(e.start,"Missing catch or finally clause"),this.finishNode(e,"TryStatement")},oe.parseVarStatement=function(e,t,i){return this.next(),this.parseVar(e,!1,t,i),this.semicolon(),this.finishNode(e,"VariableDeclaration")},oe.parseWhileStatement=function(e){return this.next(),e.test=this.parseParenExpression(),this.labels.push(ce),e.body=this.parseStatement("while"),this.labels.pop(),this.finishNode(e,"WhileStatement")},oe.parseWithStatement=function(e){return this.strict&&this.raise(this.start,"'with' in strict mode"),this.next(),e.object=this.parseParenExpression(),e.body=this.parseStatement("with"),this.finishNode(e,"WithStatement")},oe.parseEmptyStatement=function(e){return this.next(),this.finishNode(e,"EmptyStatement")},oe.parseLabeledStatement=function(e,t,i,n){for(var a=0,c=this.labels;a<c.length;a+=1){c[a].name===t&&this.raise(i.start,"Label '"+t+"' is already declared")}for(var l=this.type.isLoop?"loop":this.type===O._switch?"switch":null,y=this.labels.length-1;y>=0;y--){var E=this.labels[y];if(E.statementStart!==e.start)break;E.statementStart=this.start,E.kind=l}return this.labels.push({name:t,kind:l,statementStart:this.start}),e.body=this.parseStatement(n?-1===n.indexOf("label")?n+"label":n:"label"),this.labels.pop(),e.label=i,this.finishNode(e,"LabeledStatement")},oe.parseExpressionStatement=function(e,t){return e.expression=t,this.semicolon(),this.finishNode(e,"ExpressionStatement")},oe.parseBlock=function(e,t,i){for(void 0===e&&(e=!0),void 0===t&&(t=this.startNode()),t.body=[],this.expect(O.braceL),e&&this.enterScope(0);this.type!==O.braceR;){var n=this.parseStatement(null);t.body.push(n)}return i&&(this.strict=!1),this.next(),e&&this.exitScope(),this.finishNode(t,"BlockStatement")},oe.parseFor=function(e,t){return e.init=t,this.expect(O.semi),e.test=this.type===O.semi?null:this.parseExpression(),this.expect(O.semi),e.update=this.type===O.parenR?null:this.parseExpression(),this.expect(O.parenR),e.body=this.parseStatement("for"),this.exitScope(),this.labels.pop(),this.finishNode(e,"ForStatement")},oe.parseForIn=function(e,t){var i=this.type===O._in;return this.next(),"VariableDeclaration"===t.type&&null!=t.declarations[0].init&&(!i||this.options.ecmaVersion<8||this.strict||"var"!==t.kind||"Identifier"!==t.declarations[0].id.type)&&this.raise(t.start,(i?"for-in":"for-of")+" loop variable declaration may not have an initializer"),e.left=t,e.right=i?this.parseExpression():this.parseMaybeAssign(),this.expect(O.parenR),e.body=this.parseStatement("for"),this.exitScope(),this.labels.pop(),this.finishNode(e,i?"ForInStatement":"ForOfStatement")},oe.parseVar=function(e,t,i,n){for(e.declarations=[],e.kind=i;;){var a=this.startNode();if(this.parseVarId(a,i),this.eat(O.eq)?a.init=this.parseMaybeAssign(t):n||"const"!==i||this.type===O._in||this.options.ecmaVersion>=6&&this.isContextual("of")?n||"using"!==i&&"await using"!==i||!(this.options.ecmaVersion>=17)||this.type===O._in||this.isContextual("of")?n||"Identifier"===a.id.type||t&&(this.type===O._in||this.isContextual("of"))?a.init=null:this.raise(this.lastTokEnd,"Complex binding patterns require an initialization value"):this.raise(this.lastTokEnd,"Missing initializer in "+i+" declaration"):this.unexpected(),e.declarations.push(this.finishNode(a,"VariableDeclarator")),!this.eat(O.comma))break}return e},oe.parseVarId=function(e,t){e.id="using"===t||"await using"===t?this.parseIdent():this.parseBindingAtom(),this.checkLValPattern(e.id,"var"===t?1:2,!1)};var pe=1,ue=2;function isPrivateNameConflicted(e,t){var i=t.key.name,n=e[i],a="true";return"MethodDefinition"!==t.type||"get"!==t.kind&&"set"!==t.kind||(a=(t.static?"s":"i")+t.kind),"iget"===n&&"iset"===a||"iset"===n&&"iget"===a||"sget"===n&&"sset"===a||"sset"===n&&"sget"===a?(e[i]="true",!1):!!n||(e[i]=a,!1)}function checkKeyName(e,t){var i=e.computed,n=e.key;return!i&&("Identifier"===n.type&&n.name===t||"Literal"===n.type&&n.value===t)}oe.parseFunction=function(e,t,i,n,a){this.initFunction(e),(this.options.ecmaVersion>=9||this.options.ecmaVersion>=6&&!n)&&(this.type===O.star&&t&ue&&this.unexpected(),e.generator=this.eat(O.star)),this.options.ecmaVersion>=8&&(e.async=!!n),t&pe&&(e.id=4&t&&this.type!==O.name?null:this.parseIdent(),!e.id||t&ue||this.checkLValSimple(e.id,this.strict||e.generator||e.async?this.treatFunctionsAsVar?1:2:3));var c=this.yieldPos,l=this.awaitPos,y=this.awaitIdentPos;return this.yieldPos=0,this.awaitPos=0,this.awaitIdentPos=0,this.enterScope(functionFlags(e.async,e.generator)),t&pe||(e.id=this.type===O.name?this.parseIdent():null),this.parseFunctionParams(e),this.parseFunctionBody(e,i,!1,a),this.yieldPos=c,this.awaitPos=l,this.awaitIdentPos=y,this.finishNode(e,t&pe?"FunctionDeclaration":"FunctionExpression")},oe.parseFunctionParams=function(e){this.expect(O.parenL),e.params=this.parseBindingList(O.parenR,!1,this.options.ecmaVersion>=8),this.checkYieldAwaitInDefaultParams()},oe.parseClass=function(e,t){this.next();var i=this.strict;this.strict=!0,this.parseClassId(e,t),this.parseClassSuper(e);var n=this.enterClassBody(),a=this.startNode(),c=!1;for(a.body=[],this.expect(O.braceL);this.type!==O.braceR;){var l=this.parseClassElement(null!==e.superClass);l&&(a.body.push(l),"MethodDefinition"===l.type&&"constructor"===l.kind?(c&&this.raiseRecoverable(l.start,"Duplicate constructor in the same class"),c=!0):l.key&&"PrivateIdentifier"===l.key.type&&isPrivateNameConflicted(n,l)&&this.raiseRecoverable(l.key.start,"Identifier '#"+l.key.name+"' has already been declared"))}return this.strict=i,this.next(),e.body=this.finishNode(a,"ClassBody"),this.exitClassBody(),this.finishNode(e,t?"ClassDeclaration":"ClassExpression")},oe.parseClassElement=function(e){if(this.eat(O.semi))return null;var t=this.options.ecmaVersion,i=this.startNode(),n="",a=!1,c=!1,l="method",y=!1;if(this.eatContextual("static")){if(t>=13&&this.eat(O.braceL))return this.parseClassStaticBlock(i),i;this.isClassElementNameStart()||this.type===O.star?y=!0:n="static"}if(i.static=y,!n&&t>=8&&this.eatContextual("async")&&(!this.isClassElementNameStart()&&this.type!==O.star||this.canInsertSemicolon()?n="async":c=!0),!n&&(t>=9||!c)&&this.eat(O.star)&&(a=!0),!n&&!c&&!a){var E=this.value;(this.eatContextual("get")||this.eatContextual("set"))&&(this.isClassElementNameStart()?l=E:n=E)}if(n?(i.computed=!1,i.key=this.startNodeAt(this.lastTokStart,this.lastTokStartLoc),i.key.name=n,this.finishNode(i.key,"Identifier")):this.parseClassElementName(i),t<13||this.type===O.parenL||"method"!==l||a||c){var w=!i.static&&checkKeyName(i,"constructor"),C=w&&e;w&&"method"!==l&&this.raise(i.key.start,"Constructor can't have get/set modifier"),i.kind=w?"constructor":l,this.parseClassMethod(i,a,c,C)}else this.parseClassField(i);return i},oe.isClassElementNameStart=function(){return this.type===O.name||this.type===O.privateId||this.type===O.num||this.type===O.string||this.type===O.bracketL||this.type.keyword},oe.parseClassElementName=function(e){this.type===O.privateId?("constructor"===this.value&&this.raise(this.start,"Classes can't have an element named '#constructor'"),e.computed=!1,e.key=this.parsePrivateIdent()):this.parsePropertyName(e)},oe.parseClassMethod=function(e,t,i,n){var a=e.key;"constructor"===e.kind?(t&&this.raise(a.start,"Constructor can't be a generator"),i&&this.raise(a.start,"Constructor can't be an async method")):e.static&&checkKeyName(e,"prototype")&&this.raise(a.start,"Classes may not have a static property named prototype");var c=e.value=this.parseMethod(t,i,n);return"get"===e.kind&&0!==c.params.length&&this.raiseRecoverable(c.start,"getter should have no params"),"set"===e.kind&&1!==c.params.length&&this.raiseRecoverable(c.start,"setter should have exactly one param"),"set"===e.kind&&"RestElement"===c.params[0].type&&this.raiseRecoverable(c.params[0].start,"Setter cannot use rest params"),this.finishNode(e,"MethodDefinition")},oe.parseClassField=function(e){return checkKeyName(e,"constructor")?this.raise(e.key.start,"Classes can't have a field named 'constructor'"):e.static&&checkKeyName(e,"prototype")&&this.raise(e.key.start,"Classes can't have a static field named 'prototype'"),this.eat(O.eq)?(this.enterScope(576),e.value=this.parseMaybeAssign(),this.exitScope()):e.value=null,this.semicolon(),this.finishNode(e,"PropertyDefinition")},oe.parseClassStaticBlock=function(e){e.body=[];var t=this.labels;for(this.labels=[],this.enterScope(320);this.type!==O.braceR;){var i=this.parseStatement(null);e.body.push(i)}return this.next(),this.exitScope(),this.labels=t,this.finishNode(e,"StaticBlock")},oe.parseClassId=function(e,t){this.type===O.name?(e.id=this.parseIdent(),t&&this.checkLValSimple(e.id,2,!1)):(!0===t&&this.unexpected(),e.id=null)},oe.parseClassSuper=function(e){e.superClass=this.eat(O._extends)?this.parseExprSubscripts(null,!1):null},oe.enterClassBody=function(){var e={declared:Object.crea
```

---

## Assistant (Build · Muse Spark 1.3 Free · 5.0s)

_Thinking:_



_Thinking:_



**Tool: bash**

**Input:**
```json
{
  "command": "echo OK && pwd"
}
```

**Output:**
```
OK
/Users/nazmudinalkhamil/Documents/Projects/generator-module-app

```

---

## Assistant (Build · Muse Spark 1.3 Free · 4.0s)

**Tool: bash**

**Input:**
```json
{
  "command": "npm run verify:generator 2>&1 | tail -3",
  "workdir": "/Users/nazmudinalkhamil/Documents/Projects/generator-module-app"
}
```

**Output:**
```
...output truncated...

Full output saved to: /Users/nazmudinalkhamil/.local/share/opencode/tool-output/tool_105a62b5c001k9s4pXT4sHFOli

 resolving configuration: ${c}`);i.add(c);const l=a.dirname(c),y=fe(c,n,i);delete y.references;const{compilerOptions:E}=y;if(E){const{baseUrl:e}=E;e&&!e.startsWith(ie)&&(E.baseUrl=le(t,l,e));const{outDir:i}=E;i&&!i.startsWith(ie)&&(E.outDir=le(t,l,i));const{declarationDir:n}=E;n&&!n.startsWith(ie)&&(E.declarationDir=le(t,l,n));const{rootDir:a}=E;a&&!a.startsWith(ie)&&(E.rootDir=le(t,l,a));const{rootDirs:c}=E;c&&(E.rootDirs=c.map(e=>e.startsWith(ie)?e:le(t,l,e)));const{typeRoots:y}=E;y&&(E.typeRoots=y.map(e=>e.startsWith(ie)?e:le(t,l,e)))}for(const e of he){const i=y[e];i&&(y[e]=i.map(e=>e.startsWith(ie)?e:pe(t,l,e)))}return y},"resolveExtends"),de=["outDir","declarationDir"],fe=r((e,t,i=new Set)=>{let n;try{n=X(e,t)||{}}catch{throw new Error(`Cannot resolve tsconfig at path: ${e}`)}if("object"!=typeof n)throw new SyntaxError(`Failed to parse tsconfig at: ${e}`);const c=a.dirname(e);if(n.compilerOptions){const{compilerOptions:e}=n;e.paths&&!e.baseUrl&&(e[te]=c)}if(n.extends){const e=Array.isArray(n.extends)?n.extends:[n.extends];delete n.extends;for(const a of e.reverse()){const e=ue(a,c,new Set(i),t),l={...e,...n,compilerOptions:{...e.compilerOptions,...n.compilerOptions}};e.watchOptions&&(l.watchOptions={...e.watchOptions,...n.watchOptions}),n=l}}if(n.compilerOptions){const{compilerOptions:e}=n,t=["baseUrl","rootDir"];for(const i of t){const t=e[i];if(t&&!t.startsWith(ie)){const n=a.resolve(c,t),l=ce(c,n);e[i]=l}}for(const t of de){let i=e[t];i&&(Array.isArray(n.exclude)||(n.exclude=de.map(t=>e[t]).filter(Boolean)),i.startsWith(ie)||(i=B(i)),e[t]=i)}}else n.compilerOptions={};if(n.include&&(n.include=n.include.map(h)),n.files&&(n.files=n.files.map(e=>e.startsWith(ie)?e:B(e))),n.watchOptions){const{watchOptions:e}=n;e.excludeDirectories&&(e.excludeDirectories=e.excludeDirectories.map(e=>h(a.resolve(c,e)))),e.excludeFiles&&(e.excludeFiles=e.excludeFiles.map(e=>h(a.resolve(c,e)))),e.watchFile&&(e.watchFile=e.watchFile.toLowerCase()),e.watchDirectory&&(e.watchDirectory=e.watchDirectory.toLowerCase()),e.fallbackPolling&&(e.fallbackPolling=e.fallbackPolling.toLowerCase())}return n},"_parseTsconfig"),me=r((e,t)=>{if(e.startsWith(ie))return h(a.join(t,e.slice(12)))},"interpolateConfigDir"),ge=["outDir","declarationDir","outFile","rootDir","baseUrl","tsBuildInfoFile"],xe=r(e=>{if(e.strict){const t=["noImplicitAny","noImplicitThis","strictNullChecks","strictFunctionTypes","strictBindCallApply","strictPropertyInitialization","strictBuiltinIteratorReturn","alwaysStrict","useUnknownInCatchVariables"];for(const i of t)void 0===e[i]&&(e[i]=!0)}if(e.composite&&(null!=e.declaration||(e.declaration=!0),null!=e.incremental||(e.incremental=!0)),e.target){let t=e.target.toLowerCase();"es2015"===t&&(t="es6"),e.target=t,"esnext"===t&&(null!=e.module||(e.module="es6"),null!=e.useDefineForClassFields||(e.useDefineForClassFields=!0)),("es6"===t||"es2016"===t||"es2017"===t||"es2018"===t||"es2019"===t||"es2020"===t||"es2021"===t||"es2022"===t||"es2023"===t||"es2024"===t)&&(null!=e.module||(e.module="es6")),("es2022"===t||"es2023"===t||"es2024"===t)&&(null!=e.useDefineForClassFields||(e.useDefineForClassFields=!0))}if(e.module){let t=e.module.toLowerCase();if("es2015"===t&&(t="es6"),e.module=t,("es6"===t||"es2020"===t||"es2022"===t||"esnext"===t||"none"===t||"system"===t||"umd"===t||"amd"===t)&&(null!=e.moduleResolution||(e.moduleResolution="classic")),"system"===t&&(null!=e.allowSyntheticDefaultImports||(e.allowSyntheticDefaultImports=!0)),("node16"===t||"node18"===t||"node20"===t||"nodenext"===t||"preserve"===t)&&(null!=e.esModuleInterop||(e.esModuleInterop=!0),null!=e.allowSyntheticDefaultImports||(e.allowSyntheticDefaultImports=!0)),("node16"===t||"node18"===t||"node20"===t||"nodenext"===t)&&(null!=e.moduleDetection||(e.moduleDetection="force")),"node16"===t&&(null!=e.target||(e.target="es2022"),null!=e.moduleResolution||(e.moduleResolution="node16")),"node18"===t&&(null!=e.target||(e.target="es2022"),null!=e.moduleResolution||(e.moduleResolution="node16")),"node20"===t&&(null!=e.target||(e.target="es2023"),null!=e.moduleResolution||(e.moduleResolution="node16"),null!=e.resolveJsonModule||(e.resolveJsonModule=!0)),"nodenext"===t&&(null!=e.target||(e.target="esnext"),null!=e.moduleResolution||(e.moduleResolution="nodenext"),null!=e.resolveJsonModule||(e.resolveJsonModule=!0)),"node16"===t||"node18"===t||"node20"===t||"nodenext"===t){const t=e.target;("es3"===t||"es2022"===t||"es2023"===t||"es2024"===t||"esnext"===t)&&(null!=e.useDefineForClassFields||(e.useDefineForClassFields=!0))}"preserve"===t&&(null!=e.moduleResolution||(e.moduleResolution="bundler"))}if(e.moduleResolution){let t=e.moduleResolution.toLowerCase();"node"===t&&(t="node10"),e.moduleResolution=t,("node16"===t||"nodenext"===t||"bundler"===t)&&(null!=e.resolvePackageJsonExports||(e.resolvePackageJsonExports=!0),null!=e.resolvePackageJsonImports||(e.resolvePackageJsonImports=!0)),"bundler"===t&&(null!=e.allowSyntheticDefaultImports||(e.allowSyntheticDefaultImports=!0),null!=e.resolveJsonModule||(e.resolveJsonModule=!0))}e.jsx&&(e.jsx=e.jsx.toLowerCase()),e.moduleDetection&&(e.moduleDetection=e.moduleDetection.toLowerCase()),e.importsNotUsedAsValues&&(e.importsNotUsedAsValues=e.importsNotUsedAsValues.toLowerCase()),e.newLine&&(e.newLine=e.newLine.toLowerCase()),e.esModuleInterop&&(null!=e.allowSyntheticDefaultImports||(e.allowSyntheticDefaultImports=!0)),e.verbatimModuleSyntax&&(null!=e.isolatedModules||(e.isolatedModules=!0),null!=e.preserveConstEnums||(e.preserveConstEnums=!0)),e.isolatedModules&&(null!=e.preserveConstEnums||(e.preserveConstEnums=!0)),e.rewriteRelativeImportExtensions&&(null!=e.allowImportingTsExtensions||(e.allowImportingTsExtensions=!0)),e.lib&&(e.lib=e.lib.map(e=>e.toLowerCase())),e.checkJs&&(null!=e.allowJs||(e.allowJs=!0))},"normalizeCompilerOptions"),ve=r((e,t=new Map)=>{const i=a.resolve(e),n=fe(i,t),c=a.dirname(i),{compilerOptions:l}=n;if(l){for(const e of ge){const t=l[e];if(t){const i=me(t,c);l[e]=i?ce(c,i):t}}for(const e of["rootDirs","typeRoots"]){const t=l[e];t&&(l[e]=t.map(e=>{const t=me(e,c);return t?ce(c,t):B(e)}))}const{paths:e}=l;if(e)for(const t of Object.keys(e))e[t]=e[t].map(e=>{var t;return null!=(t=me(e,c))?t:e});xe(l)}for(const e of he){const t=n[e];t&&(n[e]=t.map(e=>{var t;return null!=(t=me(e,c))?t:e}))}return n},"parseTsconfig");var ye=Object.defineProperty,_e=r((e,t)=>ye(e,"name",{value:t,configurable:!0}),"s");const Ee=_e(e=>{let t="";for(let i=0;i<e.length;i+=1){const n=e[i],a=n.toUpperCase();t+=n===a?n.toLowerCase():a}return t},"invertCase"),be=new Map,ke=_e((e,t)=>{const i=C.join(e,`.is-fs-case-sensitive-test-${process.pid}`);try{return t.writeFileSync(i,""),!t.existsSync(Ee(i))}finally{try{t.unlinkSync(i)}catch{}}},"checkDirectoryCaseWithWrite"),we=_e((e,t,i)=>{try{return ke(e,i)}catch(e){if(void 0===t)return ke(w.tmpdir(),i);throw e}},"checkDirectoryCaseWithFallback"),Ce=_e((e,t=E,i=!0)=>{const n=null!=e?e:process.cwd();if(i&&be.has(n))return be.get(n);let a;const c=Ee(n);return a=c!==n&&t.existsSync(n)?!t.existsSync(c):we(n,e,t),i&&be.set(n,a),a},"isFsCaseSensitive"),{join:Se}=a.posix,Ie={ts:[".ts",".tsx",".d.ts"],cts:[".cts",".d.cts"],mts:[".mts",".d.mts"]},Te=r(e=>{const t=[...Ie.ts],i=[...Ie.cts],n=[...Ie.mts];return null!=e&&e.allowJs&&(t.push(".js",".jsx"),i.push(".cjs"),n.push(".mjs")),[...t,...i,...n]},"getSupportedExtensions"),Re=r(e=>{const t=[];if(!e)return t;const{outDir:i,declarationDir:n}=e;return i&&t.push(i),n&&t.push(n),t},"getDefaultExcludeSpec"),Ae=r(e=>e.replaceAll(/[.*+?^${}()|[\]\\]/g,String.raw`\$&`),"escapeForRegexp"),Le=`(?!(${["node_modules","bower_components","jspm_packages"].join("|")})(/|$))`,Oe=/(?:^|\/)[^.*?]+$/,De="**/*",Ve="[^/]",Ue="[^./]",Me="win32"===process.platform,je=r(({config:e,path:t},i=Ce())=>{if("extends"in e)throw new Error("tsconfig#extends must be resolved. Use getTsconfig or parseTsconfig to resolve it.");if(!a.isAbsolute(t))throw new Error("The tsconfig path must be absolute");Me&&(t=h(t));const n=a.dirname(t),{files:c,include:l,exclude:y,compilerOptions:E}=e,w=r(e=>a.isAbsolute(e)?e:Se(n,e),"resolvePattern"),C=null==c?void 0:c.map(w),S=Te(E),I=i?"":"i",N=(y||Re(E)).map(e=>{const t=w(e),i=Ae(t).replaceAll(String.raw`\*\*/`,"(.+/)?").replaceAll(String.raw`\*`,`${Ve}*`).replaceAll(String.raw`\?`,Ve);return new RegExp(`^${i}($|/)`,I)}),O=c||l?l:[De],j=O?O.map(e=>{let t=w(e);Oe.test(t)&&(t=Se(t,De));const i=Ae(t).replaceAll(String.raw`/\*\*`,`(/${Le}${Ue}${Ve}*)*?`).replaceAll(/(\/)?\\\*/g,(e,t)=>{const i=`(${Ue}|(\\.(?!min\\.js$))?)*`;return t?`/${Le}${Ue}${i}`:i}).replaceAll(/(\/)?\\\?/g,(e,t)=>t?`/${Le}${Ve}`:Ve);return new RegExp(`^${i}$`,I)}):void 0;return t=>{if(!a.isAbsolute(t))throw new Error("filePath must be absolute");return Me&&(t=h(t)),null!=C&&C.includes(t)||S.some(e=>t.endsWith(e))&&!N.some(e=>e.test(t))&&j&&j.some(e=>e.test(t))?e:void 0}},"createFilesMatcher"),Fe=r((e,t,i)=>{const n=a.resolve(e);let c=h(e);for(;;){const e=j(c,t,i);if(!e)return;const l=a.resolve(e),y=ve(l,i),E={path:h(l),config:y};if(je(E)(n))return E;const w=a.dirname(e),C=a.dirname(w);if(C===w)return;c=C}},"findConfigApplicable"),Be=r((e=process.cwd(),t="tsconfig.json",i=new Map,n=!1)=>{var a;return n?null==(a=Fe(e,t,i))?void 0:a.path:j(h(e),t,i)},"findTsconfig"),$e=r((e=process.cwd(),t="tsconfig.json",i=new Map,n=!1)=>{var a;if(!n){const n=Be(e,t,i);if(!n)return null;return{path:n,config:ve(n,i)}}return null!=(a=Fe(e,t,i))?a:null},"getTsconfig"),qe=/\*/g,Ge=r((e,t)=>{const i=e.match(qe);if(i&&i.length>1)throw new Error(t)},"assertStarCount"),Ke=r(e=>{if(e.includes("*")){const[t,i]=e.split("*");return{prefix:t,suffix:i}}return e},"parsePattern"),He=r(({prefix:e,suffix:t},i)=>i.startsWith(e)&&i.endsWith(t),"isPatternMatch"),ze=r((e,t,i)=>Object.entries(e).map(([e,n])=>(Ge(e,`Pattern '${e}' can have at most one '*' character.`),{pattern:Ke(e),substitutions:n.map(n=>{if(Ge(n,`Substitution '${n}' in pattern '${e}' can have at most one '*' character.`),!t&&!F.test(n)&&!a.isAbsolute(n))throw new Error("Non-relative paths are not allowed when 'baseUrl' is not set. Did you forget a leading './'?");return a.resolve(i,n)})})),"parsePaths"),Je=r(e=>{const{compilerOptions:t}=e.config;if(!t)return null;const{baseUrl:i,paths:n}=t;if(!i&&!n)return null;const c=te in t&&t[te],l=a.resolve(a.dirname(e.path),i||c||"."),y=n?ze(n,i,l):[];return e=>{if(F.test(e))return[];const t=[];for(const i of y){if(i.pattern===e)return i.substitutions.map(h);"string"!=typeof i.pattern&&t.push(i)}let n,c=-1;for(const i of t)He(i.pattern,e)&&i.pattern.prefix.length>c&&(c=i.pattern.prefix.length,n=i);if(!n)return i?[h(a.join(l,e))]:[];const E=e.slice(n.pattern.prefix.length,e.length-n.pattern.suffix.length);return n.substitutions.map(e=>h(e.replace("*",E)))}},"createPathsMatcher");t.createPathsMatcher=Je,t.getTsconfig=$e},"./node_modules/.pnpm/resolve-pkg-maps@1.0.0/node_modules/resolve-pkg-maps/dist/index.cjs"(e,t){"use strict";Object.defineProperty(t,"__esModule",{value:!0});const d=e=>null!==e&&"object"==typeof e,s=(e,t)=>Object.assign(new Error(`[${e}]: ${t}`),{code:e}),i="ERR_INVALID_PACKAGE_CONFIG",n="ERR_INVALID_PACKAGE_TARGET",a=/^\d+$/,c=/^(\.{1,2}|node_modules)$/i,l=/\/|\\/;var y,E=((y=E||{}).Export="exports",y.Import="imports",y);const f=(e,t,y,E,w)=>{if(null==t)return[];if("string"==typeof t){const[i,...a]=t.split(l);if(".."===i||a.some(e=>c.test(e)))throw s(n,`Invalid "${e}" target "${t}" defined in the package config`);return[w?t.replace(/\*/g,w):t]}if(Array.isArray(t))return t.flatMap(t=>f(e,t,y,E,w));if(d(t)){for(const n of Object.keys(t)){if(a.test(n))throw s(i,"Cannot contain numeric property keys");if("default"===n||E.includes(n))return f(e,t[n],y,E,w)}return[]}throw s(n,`Invalid "${e}" target "${t}"`)},w="*",v=(e,t)=>{const i=e.indexOf(w),n=t.indexOf(w);return i===n?t.length>e.length:n>i};function A(e,t){if(!t.includes(w)&&e.hasOwnProperty(t))return[t];let i,n;for(const a of Object.keys(e))if(a.includes(w)){const[e,c,l]=a.split(w);if(void 0===l&&t.startsWith(e)&&t.endsWith(c)){const l=t.slice(e.length,-c.length||void 0);l&&(!i||v(i,a))&&(i=a,n=l)}}return[i,n]}const C=/^\w+:/;t.resolveExports=(e,t,a)=>{if(!e)throw new Error('"exports" is required');t=""===t?".":`./${t}`,("string"==typeof e||Array.isArray(e)||d(e)&&(e=>Object.keys(e).reduce((e,t)=>{const n=""===t||"."!==t[0];if(void 0===e||e===n)return n;throw s(i,'"exports" cannot contain some keys starting with "." and some not')},void 0))(e))&&(e={".":e});const[c,l]=A(e,t),y=f(E.Export,e[c],t,a,l);if(0===y.length)throw s("ERR_PACKAGE_PATH_NOT_EXPORTED","."===t?'No "exports" main defined':`Package subpath '${t}' is not defined by "exports"`);for(const e of y)if(!e.startsWith("./")&&!C.test(e))throw s(n,`Invalid "exports" target "${e}" defined in the package config`);return y},t.resolveImports=(e,t,i)=>{if(!e)throw new Error('"imports" is required');const[n,a]=A(e,t),c=f(E.Import,e[n],t,i,a);if(0===c.length)throw s("ERR_PACKAGE_IMPORT_NOT_DEFINED",`Package import specifier "${t}" is not defined in package`);return c}}},t={};function __webpack_require__(i){var n=t[i];if(void 0!==n)return n.exports;var a=t[i]={exports:{}};return e[i](a,a.exports,__webpack_require__),a.exports}__webpack_require__.n=e=>{var t=e&&e.__esModule?()=>e.default:()=>e;return __webpack_require__.d(t,{a:t}),t},__webpack_require__.d=(e,t)=>{for(var i in t)__webpack_require__.o(t,i)&&!__webpack_require__.o(e,i)&&Object.defineProperty(e,i,{enumerable:!0,get:t[i]})},__webpack_require__.o=(e,t)=>Object.prototype.hasOwnProperty.call(e,t);var i={};(()=>{"use strict";__webpack_require__.d(i,{default:()=>createJiti});const e=require("node:os");var t=[509,0,227,0,150,4,294,9,1368,2,2,1,6,3,41,2,5,0,166,1,574,3,9,9,7,9,32,4,318,1,78,5,71,10,50,3,123,2,54,14,32,10,3,1,11,3,46,10,8,0,46,9,7,2,37,13,2,9,6,1,45,0,13,2,49,13,9,3,2,11,83,11,7,0,3,0,158,11,6,9,7,3,56,1,2,6,3,1,3,2,10,0,11,1,3,6,4,4,68,8,2,0,3,0,2,3,2,4,2,0,15,1,83,17,10,9,5,0,82,19,13,9,214,6,3,8,28,1,83,16,16,9,82,12,9,9,7,19,58,14,5,9,243,14,166,9,71,5,2,1,3,3,2,0,2,1,13,9,120,6,3,6,4,0,29,9,41,6,2,3,9,0,10,10,47,15,199,7,137,9,54,7,2,7,17,9,57,21,2,13,123,5,4,0,2,1,2,6,2,0,9,9,49,4,2,1,2,4,9,9,55,9,266,3,10,1,2,0,49,6,4,4,14,10,5350,0,7,14,11465,27,2343,9,87,9,39,4,60,6,26,9,535,9,470,0,2,54,8,3,82,0,12,1,19628,1,4178,9,519,45,3,22,543,4,4,5,9,7,3,6,31,3,149,2,1418,49,513,54,5,49,9,0,15,0,23,4,2,14,1361,6,2,16,3,6,2,1,2,4,101,0,161,6,10,9,357,0,62,13,499,13,245,1,2,9,233,0,3,0,8,1,6,0,475,6,110,6,6,9,4759,9,787719,239],n=[0,11,2,25,2,18,2,1,2,14,3,13,35,122,70,52,268,28,4,48,48,31,14,29,6,37,11,29,3,35,5,7,2,4,43,157,19,35,5,35,5,39,9,51,13,10,2,14,2,6,2,1,2,10,2,14,2,6,2,1,4,51,13,310,10,21,11,7,25,5,2,41,2,8,70,5,3,0,2,43,2,1,4,0,3,22,11,22,10,30,66,18,2,1,11,21,11,25,7,25,39,55,7,1,65,0,16,3,2,2,2,28,43,28,4,28,36,7,2,27,28,53,11,21,11,18,14,17,111,72,56,50,14,50,14,35,39,27,10,22,251,41,7,1,17,5,57,28,11,0,9,21,43,17,47,20,28,22,13,52,58,1,3,0,14,44,33,24,27,35,30,0,3,0,9,34,4,0,13,47,15,3,22,0,2,0,36,17,2,24,20,1,64,6,2,0,2,3,2,14,2,9,8,46,39,7,3,1,3,21,2,6,2,1,2,4,4,0,19,0,13,4,31,9,2,0,3,0,2,37,2,0,26,0,2,0,45,52,19,3,21,2,31,47,21,1,2,0,185,46,42,3,37,47,21,0,60,42,14,0,72,26,38,6,186,43,117,63,32,7,3,0,3,7,2,1,2,23,16,0,2,0,95,7,3,38,17,0,2,0,29,0,11,39,8,0,22,0,12,45,20,0,19,72,200,32,32,8,2,36,18,0,50,29,113,6,2,1,2,37,22,0,26,5,2,1,2,31,15,0,24,43,261,18,16,0,2,12,2,33,125,0,80,921,103,110,18,195,2637,96,16,1071,18,5,26,3994,6,582,6842,29,1763,568,8,30,18,78,18,29,19,47,17,3,32,20,6,18,433,44,212,63,33,24,3,24,45,74,6,0,67,12,65,1,2,0,15,4,10,7381,42,31,98,114,8702,3,2,6,2,1,2,290,16,0,30,2,3,0,15,3,9,395,2309,106,6,12,4,8,8,9,5991,84,2,70,2,1,3,0,3,1,3,3,2,11,2,0,2,6,2,64,2,3,3,7,2,6,2,27,2,3,2,4,2,0,4,6,2,339,3,24,2,24,2,30,2,24,2,30,2,24,2,30,2,24,2,30,2,24,2,7,1845,30,7,5,262,61,147,44,11,6,17,0,322,29,19,43,485,27,229,29,3,0,208,30,2,2,2,1,2,6,3,4,10,1,225,6,2,3,2,1,2,14,2,196,60,67,8,0,1205,3,2,26,2,1,2,0,3,0,2,9,2,3,2,0,2,0,7,0,5,0,2,0,2,0,2,2,2,1,2,0,3,0,2,0,2,0,2,0,2,0,2,1,2,0,3,3,2,6,2,3,2,3,2,0,2,9,2,16,6,2,2,4,2,16,4421,42719,33,4381,3,5773,3,7472,16,621,2467,541,1507,4938,6,8489],a="ªµºÀ-ÖØ-öø-ˁˆ-ˑˠ-ˤˬˮͰ-ʹͶͷͺ-ͽͿΆΈ-ΊΌΎ-ΡΣ-ϵϷ-ҁҊ-ԯԱ-Ֆՙՠ-ֈא-תׯ-ײؠ-يٮٯٱ-ۓەۥۦۮۯۺ-ۼۿܐܒ-ܯݍ-ޥޱߊ-ߪߴߵߺࠀ-ࠕࠚࠤࠨࡀ-ࡘࡠ-ࡪࡰ-ࢇࢉ-࢏ࢠ-ࣉऄ-हऽॐक़-ॡॱ-ঀঅ-ঌএঐও-নপ-রলশ-হঽৎড়ঢ়য়-ৡৰৱৼਅ-ਊਏਐਓ-ਨਪ-ਰਲਲ਼ਵਸ਼ਸਹਖ਼-ੜਫ਼ੲ-ੴઅ-ઍએ-ઑઓ-નપ-રલળવ-હઽૐૠૡૹଅ-ଌଏଐଓ-ନପ-ରଲଳଵ-ହଽଡ଼ଢ଼ୟ-ୡୱஃஅ-ஊஎ-ஐஒ-கஙசஜஞடணதந-பம-ஹௐఅ-ఌఎ-ఐఒ-నప-హఽౘ-ౚ౜ౝౠౡಀಅ-ಌಎ-ಐಒ-ನಪ-ಳವ-ಹಽ೜-ೞೠೡೱೲഄ-ഌഎ-ഐഒ-ഺഽൎൔ-ൖൟ-ൡൺ-ൿඅ-ඖක-නඳ-රලව-ෆก-ะาำเ-ๆກຂຄຆ-ຊຌ-ຣລວ-ະາຳຽເ-ໄໆໜ-ໟༀཀ-ཇཉ-ཬྈ-ྌက-ဪဿၐ-ၕၚ-ၝၡၥၦၮ-ၰၵ-ႁႎႠ-ჅჇჍა-ჺჼ-ቈቊ-ቍቐ-ቖቘቚ-ቝበ-ኈኊ-ኍነ-ኰኲ-ኵኸ-ኾዀዂ-ዅወ-ዖዘ-ጐጒ-ጕጘ-ፚᎀ-ᎏᎠ-Ᏽᏸ-ᏽᐁ-ᙬᙯ-ᙿᚁ-ᚚᚠ-ᛪᛮ-ᛸᜀ-ᜑᜟ-ᜱᝀ-ᝑᝠ-ᝬᝮ-ᝰក-ឳៗៜᠠ-ᡸᢀ-ᢨᢪᢰ-ᣵᤀ-ᤞᥐ-ᥭᥰ-ᥴᦀ-ᦫᦰ-ᧉᨀ-ᨖᨠ-ᩔᪧᬅ-ᬳᭅ-ᭌᮃ-ᮠᮮᮯᮺ-ᯥᰀ-ᰣᱍ-ᱏᱚ-ᱽᲀ-ᲊᲐ-ᲺᲽ-Ჿᳩ-ᳬᳮ-ᳳᳵᳶᳺᴀ-ᶿḀ-ἕἘ-Ἕἠ-ὅὈ-Ὅὐ-ὗὙὛὝὟ-ώᾀ-ᾴᾶ-ᾼιῂ-ῄῆ-ῌῐ-ΐῖ-Ίῠ-Ῥῲ-ῴῶ-ῼⁱⁿₐ-ₜℂℇℊ-ℓℕ℘-ℝℤΩℨK-ℹℼ-ℿⅅ-ⅉⅎⅠ-ↈⰀ-ⳤⳫ-ⳮⳲⳳⴀ-ⴥⴧⴭⴰ-ⵧⵯⶀ-ⶖⶠ-ⶦⶨ-ⶮⶰ-ⶶⶸ-ⶾⷀ-ⷆⷈ-ⷎⷐ-ⷖⷘ-ⷞ々-〇〡-〩〱-〵〸-〼ぁ-ゖ゛-ゟァ-ヺー-ヿㄅ-ㄯㄱ-ㆎㆠ-ㆿㇰ-ㇿ㐀-䶿一-ꒌꓐ-ꓽꔀ-ꘌꘐ-ꘟꘪꘫꙀ-ꙮꙿ-ꚝꚠ-ꛯꜗ-ꜟꜢ-ꞈꞋ-Ƛ꟱-ꠁꠃ-ꠅꠇ-ꠊꠌ-ꠢꡀ-ꡳꢂ-ꢳꣲ-ꣷꣻꣽꣾꤊ-ꤥꤰ-ꥆꥠ-ꥼꦄ-ꦲꧏꧠ-ꧤꧦ-ꧯꧺ-ꧾꨀ-ꨨꩀ-ꩂꩄ-ꩋꩠ-ꩶꩺꩾ-ꪯꪱꪵꪶꪹ-ꪽꫀꫂꫛ-ꫝꫠ-ꫪꫲ-ꫴꬁ-ꬆꬉ-ꬎꬑ-ꬖꬠ-ꬦꬨ-ꬮꬰ-ꭚꭜ-ꭩꭰ-ꯢ가-힣ힰ-ퟆퟋ-ퟻ豈-舘並-龎ﬀ-ﬆﬓ-ﬗיִײַ-ﬨשׁ-זּטּ-לּמּנּסּףּפּצּ-ﮱﯓ-ﴽﵐ-ﶏﶒ-ﷇﷰ-ﷻﹰ-ﹴﹶ-ﻼＡ-Ｚａ-ｚｦ-ﾾￂ-ￇￊ-ￏￒ-ￗￚ-ￜ",c={3:"abstract boolean byte char class double enum export extends final float goto implements import int interface long native package private protected public short static super synchronized throws transient volatile",5:"class enum extends super const export import",6:"enum",strict:"implements interface let package private protected public static yield",strictBind:"eval arguments"},l="break case catch continue debugger default do else finally for function if return switch throw try var while with null true false instanceof typeof void delete new in this",y={5:l,"5module":l+" export import",6:l+" const class extends export import super"},E=/^in(stanceof)?$/,w=new RegExp("["+a+"]"),C=new RegExp("["+a+"‌‍·̀-ͯ·҃-֑҇-ׇֽֿׁׂׅׄؐ-ًؚ-٩ٰۖ-ۜ۟-۪ۤۧۨ-ۭ۰-۹ܑܰ-݊ަ-ް߀-߉߫-߽߳ࠖ-࠙ࠛ-ࠣࠥ-ࠧࠩ-࡙࠭-࡛ࢗ-࢟࣊-ࣣ࣡-ःऺ-़ा-ॏ॑-ॗॢॣ०-९ঁ-ঃ়া-ৄেৈো-্ৗৢৣ০-৯৾ਁ-ਃ਼ਾ-ੂੇੈੋ-੍ੑ੦-ੱੵઁ-ઃ઼ા-ૅે-ૉો-્ૢૣ૦-૯ૺ-૿ଁ-ଃ଼ା-ୄେୈୋ-୍୕-ୗୢୣ୦-୯ஂா-ூெ-ைொ-்ௗ௦-௯ఀ-ఄ఼ా-ౄె-ైొ-్ౕౖౢౣ౦-౯ಁ-ಃ಼ಾ-ೄೆ-ೈೊ-್ೕೖೢೣ೦-೯ೳഀ-ഃ഻഼ാ-ൄെ-ൈൊ-്ൗൢൣ൦-൯ඁ-ඃ්ා-ුූෘ-ෟ෦-෯ෲෳัิ-ฺ็-๎๐-๙ັິ-ຼ່-໎໐-໙༘༙༠-༩༹༵༷༾༿ཱ-྄྆྇ྍ-ྗྙ-ྼ࿆ါ-ှ၀-၉ၖ-ၙၞ-ၠၢ-ၤၧ-ၭၱ-ၴႂ-ႍႏ-ႝ፝-፟፩-፱ᜒ-᜕ᜲ-᜴ᝒᝓᝲᝳ឴-៓៝០-៩᠋-᠍᠏-᠙ᢩᤠ-ᤫᤰ-᤻᥆-᥏᧐-᧚ᨗ-ᨛᩕ-ᩞ᩠-᩿᩼-᪉᪐-᪙᪰-᪽ᪿ-᫝᫠-᫫ᬀ-ᬄ᬴-᭄᭐-᭙᭫-᭳ᮀ-ᮂᮡ-ᮭ᮰-᮹᯦-᯳ᰤ-᰷᱀-᱉᱐-᱙᳐-᳔᳒-᳨᳭᳴᳷-᳹᷀-᷿‌‍‿⁀⁔⃐-⃥⃜⃡-⃰⳯-⵿⳱ⷠ-〪ⷿ-゙゚〯・꘠-꘩꙯ꙴ-꙽ꚞꚟ꛰꛱ꠂ꠆ꠋꠣ-ꠧ꠬ꢀꢁꢴ-ꣅ꣐-꣙꣠-꣱ꣿ-꤉ꤦ-꤭ꥇ-꥓ꦀ-ꦃ꦳-꧀꧐-꧙ꧥ꧰-꧹ꨩ-ꨶꩃꩌꩍ꩐-꩙ꩻ-ꩽꪰꪲ-ꪴꪷꪸꪾ꪿꫁ꫫ-ꫯꫵ꫶ꯣ-ꯪ꯬꯭꯰-꯹ﬞ︀-️︠-︯︳︴﹍-﹏０-９＿･]");function isInAstralSet(e,t){for(var i=65536,n=0;n<t.length;n+=2){if((i+=t[n])>e)return!1;if((i+=t[n+1])>=e)return!0}return!1}function isIdentifierStart(e,t){return e<65?36===e:e<91||(e<97?95===e:e<123||(e<=65535?e>=170&&w.test(String.fromCharCode(e)):!1!==t&&isInAstralSet(e,n)))}function isIdentifierChar(e,i){return e<48?36===e:e<58||!(e<65)&&(e<91||(e<97?95===e:e<123||(e<=65535?e>=170&&C.test(String.fromCharCode(e)):!1!==i&&(isInAstralSet(e,n)||isInAstralSet(e,t)))))}var acorn_TokenType=function(e,t){void 0===t&&(t={}),this.label=e,this.keyword=t.keyword,this.beforeExpr=!!t.beforeExpr,this.startsExpr=!!t.startsExpr,this.isLoop=!!t.isLoop,this.isAssign=!!t.isAssign,this.prefix=!!t.prefix,this.postfix=!!t.postfix,this.binop=t.binop||null,this.updateContext=null};function binop(e,t){return new acorn_TokenType(e,{beforeExpr:!0,binop:t})}var S={beforeExpr:!0},I={startsExpr:!0},N={};function kw(e,t){return void 0===t&&(t={}),t.keyword=e,N[e]=new acorn_TokenType(e,t)}var O={num:new acorn_TokenType("num",I),regexp:new acorn_TokenType("regexp",I),string:new acorn_TokenType("string",I),name:new acorn_TokenType("name",I),privateId:new acorn_TokenType("privateId",I),eof:new acorn_TokenType("eof"),bracketL:new acorn_TokenType("[",{beforeExpr:!0,startsExpr:!0}),bracketR:new acorn_TokenType("]"),braceL:new acorn_TokenType("{",{beforeExpr:!0,startsExpr:!0}),braceR:new acorn_TokenType("}"),parenL:new acorn_TokenType("(",{beforeExpr:!0,startsExpr:!0}),parenR:new acorn_TokenType(")"),comma:new acorn_TokenType(",",S),semi:new acorn_TokenType(";",S),colon:new acorn_TokenType(":",S),dot:new acorn_TokenType("."),question:new acorn_TokenType("?",S),questionDot:new acorn_TokenType("?."),arrow:new acorn_TokenType("=>",S),template:new acorn_TokenType("template"),invalidTemplate:new acorn_TokenType("invalidTemplate"),ellipsis:new acorn_TokenType("...",S),backQuote:new acorn_TokenType("`",I),dollarBraceL:new acorn_TokenType("${",{beforeExpr:!0,startsExpr:!0}),eq:new acorn_TokenType("=",{beforeExpr:!0,isAssign:!0}),assign:new acorn_TokenType("_=",{beforeExpr:!0,isAssign:!0}),incDec:new acorn_TokenType("++/--",{prefix:!0,postfix:!0,startsExpr:!0}),prefix:new acorn_TokenType("!/~",{beforeExpr:!0,prefix:!0,startsExpr:!0}),logicalOR:binop("||",1),logicalAND:binop("&&",2),bitwiseOR:binop("|",3),bitwiseXOR:binop("^",4),bitwiseAND:binop("&",5),equality:binop("==/!=/===/!==",6),relational:binop("</>/<=/>=",7),bitShift:binop("<</>>/>>>",8),plusMin:new acorn_TokenType("+/-",{beforeExpr:!0,binop:9,prefix:!0,startsExpr:!0}),modulo:binop("%",10),star:binop("*",10),slash:binop("/",10),starstar:new acorn_TokenType("**",{beforeExpr:!0}),coalesce:binop("??",1),_break:kw("break"),_case:kw("case",S),_catch:kw("catch"),_continue:kw("continue"),_debugger:kw("debugger"),_default:kw("default",S),_do:kw("do",{isLoop:!0,beforeExpr:!0}),_else:kw("else",S),_finally:kw("finally"),_for:kw("for",{isLoop:!0}),_function:kw("function",I),_if:kw("if"),_return:kw("return",S),_switch:kw("switch"),_throw:kw("throw",S),_try:kw("try"),_var:kw("var"),_const:kw("const"),_while:kw("while",{isLoop:!0}),_with:kw("with"),_new:kw("new",{beforeExpr:!0,startsExpr:!0}),_this:kw("this",I),_super:kw("super",I),_class:kw("class",I),_extends:kw("extends",S),_export:kw("export"),_import:kw("import",I),_null:kw("null",I),_true:kw("true",I),_false:kw("false",I),_in:kw("in",{beforeExpr:!0,binop:7}),_instanceof:kw("instanceof",{beforeExpr:!0,binop:7}),_typeof:kw("typeof",{beforeExpr:!0,prefix:!0,startsExpr:!0}),_void:kw("void",{beforeExpr:!0,prefix:!0,startsExpr:!0}),_delete:kw("delete",{beforeExpr:!0,prefix:!0,startsExpr:!0})},j=/\r\n?|\n|\u2028|\u2029/,F=new RegExp(j.source,"g");function isNewLine(e){return 10===e||13===e||8232===e||8233===e}function nextLineBreak(e,t,i){void 0===i&&(i=e.length);for(var n=t;n<i;n++){var a=e.charCodeAt(n);if(isNewLine(a))return n<i-1&&13===a&&10===e.charCodeAt(n+1)?n+2:n+1}return-1}var B=/[\u1680\u2000-\u200a\u202f\u205f\u3000\ufeff]/,$=/(?:\s|\/\/.*|\/\*[^]*?\*\/)*/g,q=Object.prototype,W=q.hasOwnProperty,K=q.toString,H=Object.hasOwn||function(e,t){return W.call(e,t)},Y=Array.isArray||function(e){return"[object Array]"===K.call(e)},Q=Object.create(null);function wordsRegexp(e){return Q[e]||(Q[e]=new RegExp("^(?:"+e.replace(/ /g,"|")+")$"))}function codePointToString(e){return e<=65535?String.fromCharCode(e):(e-=65536,String.fromCharCode(55296+(e>>10),56320+(1023&e)))}var Z=/(?:[\uD800-\uDBFF](?![\uDC00-\uDFFF])|(?:[^\uD800-\uDBFF]|^)[\uDC00-\uDFFF])/,acorn_Position=function(e,t){this.line=e,this.column=t};acorn_Position.prototype.offset=function(e){return new acorn_Position(this.line,this.column+e)};var acorn_SourceLocation=function(e,t,i){this.start=t,this.end=i,null!==e.sourceFile&&(this.source=e.sourceFile)};function getLineInfo(e,t){for(var i=1,n=0;;){var a=nextLineBreak(e,n,t);if(a<0)return new acorn_Position(i,t-n);++i,n=a}}var X={ecmaVersion:null,sourceType:"script",onInsertedSemicolon:null,onTrailingComma:null,allowReserved:null,allowReturnOutsideFunction:!1,allowImportExportEverywhere:!1,allowAwaitOutsideFunction:null,allowSuperOutsideMethod:null,allowHashBang:!1,checkPrivateFields:!0,locations:!1,onToken:null,onComment:null,ranges:!1,program:null,sourceFile:null,directSourceFile:null,preserveParens:!1},te=!1;function getOptions(e){var t={};for(var i in X)t[i]=e&&H(e,i)?e[i]:X[i];if("latest"===t.ecmaVersion?t.ecmaVersion=1e8:null==t.ecmaVersion?(!te&&"object"==typeof console&&console.warn&&(te=!0,console.warn("Since Acorn 8.0.0, options.ecmaVersion is required.\nDefaulting to 2020, but this will stop working in the future.")),t.ecmaVersion=11):t.ecmaVersion>=2015&&(t.ecmaVersion-=2009),null==t.allowReserved&&(t.allowReserved=t.ecmaVersion<5),e&&null!=e.allowHashBang||(t.allowHashBang=t.ecmaVersion>=14),Y(t.onToken)){var n=t.onToken;t.onToken=function(e){return n.push(e)}}if(Y(t.onComment)&&(t.onComment=function(e,t){return function(i,n,a,c,l,y){var E={type:i?"Block":"Line",value:n,start:a,end:c};e.locations&&(E.loc=new acorn_SourceLocation(this,l,y)),e.ranges&&(E.range=[a,c]),t.push(E)}}(t,t.onComment)),"commonjs"===t.sourceType&&t.allowAwaitOutsideFunction)throw new Error("Cannot use allowAwaitOutsideFunction with sourceType: commonjs");return t}var ie=256,se=259;function functionFlags(e,t){return 2|(e?4:0)|(t?8:0)}var acorn_Parser=function(e,t,i){this.options=e=getOptions(e),this.sourceFile=e.sourceFile,this.keywords=wordsRegexp(y[e.ecmaVersion>=6?6:"module"===e.sourceType?"5module":5]);var n="";!0!==e.allowReserved&&(n=c[e.ecmaVersion>=6?6:5===e.ecmaVersion?5:3],"module"===e.sourceType&&(n+=" await")),this.reservedWords=wordsRegexp(n);var a=(n?n+" ":"")+c.strict;this.reservedWordsStrict=wordsRegexp(a),this.reservedWordsStrictBind=wordsRegexp(a+" "+c.strictBind),this.input=String(t),this.containsEsc=!1,i?(this.pos=i,this.lineStart=this.input.lastIndexOf("\n",i-1)+1,this.curLine=this.input.slice(0,this.lineStart).split(j).length):(this.pos=this.lineStart=0,this.curLine=1),this.type=O.eof,this.value=null,this.start=this.end=this.pos,this.startLoc=this.endLoc=this.curPosition(),this.lastTokEndLoc=this.lastTokStartLoc=null,this.lastTokStart=this.lastTokEnd=this.pos,this.context=this.initialContext(),this.exprAllowed=!0,this.inModule="module"===e.sourceType,this.strict=this.inModule||this.strictDirective(this.pos),this.potentialArrowAt=-1,this.potentialArrowInForAwait=!1,this.yieldPos=this.awaitPos=this.awaitIdentPos=0,this.labels=[],this.undefinedExports=Object.create(null),0===this.pos&&e.allowHashBang&&"#!"===this.input.slice(0,2)&&this.skipLineComment(2),this.scopeStack=[],this.enterScope("commonjs"===this.options.sourceType?2:1),this.regexpState=null,this.privateNameStack=[]},re={inFunction:{configurable:!0},inGenerator:{configurable:!0},inAsync:{configurable:!0},canAwait:{configurable:!0},allowReturn:{configurable:!0},allowSuper:{configurable:!0},allowDirectSuper:{configurable:!0},treatFunctionsAsVar:{configurable:!0},allowNewDotTarget:{configurable:!0},allowUsing:{configurable:!0},inClassStaticBlock:{configurable:!0}};acorn_Parser.prototype.parse=function(){var e=this.options.program||this.startNode();return this.nextToken(),this.parseTopLevel(e)},re.inFunction.get=function(){return(2&this.currentVarScope().flags)>0},re.inGenerator.get=function(){return(8&this.currentVarScope().flags)>0},re.inAsync.get=function(){return(4&this.currentVarScope().flags)>0},re.canAwait.get=function(){for(var e=this.scopeStack.length-1;e>=0;e--){var t=this.scopeStack[e].flags;if(768&t)return!1;if(2&t)return(4&t)>0}return this.inModule&&this.options.ecmaVersion>=13||this.options.allowAwaitOutsideFunction},re.allowReturn.get=function(){return!!this.inFunction||!!(this.options.allowReturnOutsideFunction&&1&this.currentVarScope().flags)},re.allowSuper.get=function(){return(64&this.currentThisScope().flags)>0||this.options.allowSuperOutsideMethod},re.allowDirectSuper.get=function(){return(128&this.currentThisScope().flags)>0},re.treatFunctionsAsVar.get=function(){return this.treatFunctionsAsVarInScope(this.currentScope())},re.allowNewDotTarget.get=function(){for(var e=this.scopeStack.length-1;e>=0;e--){var t=this.scopeStack[e].flags;if(768&t||2&t&&!(16&t))return!0}return!1},re.allowUsing.get=function(){var e=this.currentScope().flags;return!(1024&e)&&!(!this.inModule&&1&e)},re.inClassStaticBlock.get=function(){return(this.currentVarScope().flags&ie)>0},acorn_Parser.extend=function(){for(var e=[],t=arguments.length;t--;)e[t]=arguments[t];for(var i=this,n=0;n<e.length;n++)i=e[n](i);return i},acorn_Parser.parse=function(e,t){return new this(t,e).parse()},acorn_Parser.parseExpressionAt=function(e,t,i){var n=new this(i,e,t);return n.nextToken(),n.parseExpression()},acorn_Parser.tokenizer=function(e,t){return new this(t,e)},Object.defineProperties(acorn_Parser.prototype,re);var ne=acorn_Parser.prototype,ae=/^(?:'((?:\\[^]|[^'\\])*?)'|"((?:\\[^]|[^"\\])*?)")/;ne.strictDirective=function(e){if(this.options.ecmaVersion<5)return!1;for(;;){$.lastIndex=e,e+=$.exec(this.input)[0].length;var t=ae.exec(this.input.slice(e));if(!t)return!1;if("use strict"===(t[1]||t[2])){$.lastIndex=e+t[0].length;var i=$.exec(this.input),n=i.index+i[0].length,a=this.input.charAt(n);return";"===a||"}"===a||j.test(i[0])&&!(/[(`.[+\-/*%<>=,?^&]/.test(a)||"!"===a&&"="===this.input.charAt(n+1))}e+=t[0].length,$.lastIndex=e,e+=$.exec(this.input)[0].length,";"===this.input[e]&&e++}},ne.eat=function(e){return this.type===e&&(this.next(),!0)},ne.isContextual=function(e){return this.type===O.name&&this.value===e&&!this.containsEsc},ne.eatContextual=function(e){return!!this.isContextual(e)&&(this.next(),!0)},ne.expectContextual=function(e){this.eatContextual(e)||this.unexpected()},ne.canInsertSemicolon=function(){return this.type===O.eof||this.type===O.braceR||j.test(this.input.slice(this.lastTokEnd,this.start))},ne.insertSemicolon=function(){if(this.canInsertSemicolon())return this.options.onInsertedSemicolon&&this.options.onInsertedSemicolon(this.lastTokEnd,this.lastTokEndLoc),!0},ne.semicolon=function(){this.eat(O.semi)||this.insertSemicolon()||this.unexpected()},ne.afterTrailingComma=function(e,t){if(this.type===e)return this.options.onTrailingComma&&this.options.onTrailingComma(this.lastTokStart,this.lastTokStartLoc),t||this.next(),!0},ne.expect=function(e){this.eat(e)||this.unexpected()},ne.unexpected=function(e){this.raise(null!=e?e:this.start,"Unexpected token")};var acorn_DestructuringErrors=function(){this.shorthandAssign=this.trailingComma=this.parenthesizedAssign=this.parenthesizedBind=this.doubleProto=-1};ne.checkPatternErrors=function(e,t){if(e){e.trailingComma>-1&&this.raiseRecoverable(e.trailingComma,"Comma is not permitted after the rest element");var i=t?e.parenthesizedAssign:e.parenthesizedBind;i>-1&&this.raiseRecoverable(i,t?"Assigning to rvalue":"Parenthesized pattern")}},ne.checkExpressionErrors=function(e,t){if(!e)return!1;var i=e.shorthandAssign,n=e.doubleProto;if(!t)return i>=0||n>=0;i>=0&&this.raise(i,"Shorthand property assignments are valid only in destructuring patterns"),n>=0&&this.raiseRecoverable(n,"Redefinition of __proto__ property")},ne.checkYieldAwaitInDefaultParams=function(){this.yieldPos&&(!this.awaitPos||this.yieldPos<this.awaitPos)&&this.raise(this.yieldPos,"Yield expression cannot be a default value"),this.awaitPos&&this.raise(this.awaitPos,"Await expression cannot be a default value")},ne.isSimpleAssignTarget=function(e){return"ParenthesizedExpression"===e.type?this.isSimpleAssignTarget(e.expression):"Identifier"===e.type||"MemberExpression"===e.type};var oe=acorn_Parser.prototype;oe.parseTopLevel=function(e){var t=Object.create(null);for(e.body||(e.body=[]);this.type!==O.eof;){var i=this.parseStatement(null,!0,t);e.body.push(i)}if(this.inModule)for(var n=0,a=Object.keys(this.undefinedExports);n<a.length;n+=1){var c=a[n];this.raiseRecoverable(this.undefinedExports[c].start,"Export '"+c+"' is not defined")}return this.adaptDirectivePrologue(e.body),this.next(),e.sourceType="commonjs"===this.options.sourceType?"script":this.options.sourceType,this.finishNode(e,"Program")};var ce={kind:"loop"},he={kind:"switch"};oe.isLet=function(e){if(this.options.ecmaVersion<6||!this.isContextual("let"))return!1;$.lastIndex=this.pos;var t=$.exec(this.input),i=this.pos+t[0].length,n=this.fullCharCodeAt(i);if(91===n||92===n)return!0;if(e)return!1;if(123===n)return!0;if(isIdentifierStart(n)){var a=i;do{i+=n<=65535?1:2}while(isIdentifierChar(n=this.fullCharCodeAt(i)));if(92===n)return!0;var c=this.input.slice(a,i);if(!E.test(c))return!0}return!1},oe.isAsyncFunction=function(){if(this.options.ecmaVersion<8||!this.isContextual("async"))return!1;$.lastIndex=this.pos;var e,t=$.exec(this.input),i=this.pos+t[0].length;return!(j.test(this.input.slice(this.pos,i))||"function"!==this.input.slice(i,i+8)||i+8!==this.input.length&&(isIdentifierChar(e=this.fullCharCodeAt(i+8))||92===e))},oe.isUsingKeyword=function(e,t){if(this.options.ecmaVersion<17||!this.isContextual(e?"await":"using"))return!1;$.lastIndex=this.pos;var i=$.exec(this.input),n=this.pos+i[0].length;if(j.test(this.input.slice(this.pos,n)))return!1;if(e){var a,c=n+5;if("using"!==this.input.slice(n,c)||c===this.input.length||isIdentifierChar(a=this.fullCharCodeAt(c))||92===a)return!1;$.lastIndex=c;var l=$.exec(this.input);if(n=c+l[0].length,l&&j.test(this.input.slice(c,n)))return!1}var y=this.fullCharCodeAt(n);if(!isIdentifierStart(y)&&92!==y)return!1;var w=n;do{n+=y<=65535?1:2}while(isIdentifierChar(y=this.fullCharCodeAt(n)));if(92===y)return!0;var C=this.input.slice(w,n);return!(E.test(C)||t&&"of"===C)},oe.isAwaitUsing=function(e){return this.isUsingKeyword(!0,e)},oe.isUsing=function(e){return this.isUsingKeyword(!1,e)},oe.parseStatement=function(e,t,i){var n,a=this.type,c=this.startNode();switch(this.isLet(e)&&(a=O._var,n="let"),a){case O._break:case O._continue:return this.parseBreakContinueStatement(c,a.keyword);case O._debugger:return this.parseDebuggerStatement(c);case O._do:return this.parseDoStatement(c);case O._for:return this.parseForStatement(c);case O._function:return e&&(this.strict||"if"!==e&&"label"!==e)&&this.options.ecmaVersion>=6&&this.unexpected(),this.parseFunctionStatement(c,!1,!e);case O._class:return e&&this.unexpected(),this.parseClass(c,!0);case O._if:return this.parseIfStatement(c);case O._return:return this.parseReturnStatement(c);case O._switch:return this.parseSwitchStatement(c);case O._throw:return this.parseThrowStatement(c);case O._try:return this.parseTryStatement(c);case O._const:case O._var:return n=n||this.value,e&&"var"!==n&&this.unexpected(),this.parseVarStatement(c,n);case O._while:return this.parseWhileStatement(c);case O._with:return this.parseWithStatement(c);case O.braceL:return this.parseBlock(!0,c);case O.semi:return this.parseEmptyStatement(c);case O._export:case O._import:if(this.options.ecmaVersion>10&&a===O._import){$.lastIndex=this.pos;var l=$.exec(this.input),y=this.pos+l[0].length,E=this.input.charCodeAt(y);if(40===E||46===E)return this.parseExpressionStatement(c,this.parseExpression())}return this.options.allowImportExportEverywhere||(t||this.raise(this.start,"'import' and 'export' may only appear at the top level"),this.inModule||this.raise(this.start,"'import' and 'export' may appear only with 'sourceType: module'")),a===O._import?this.parseImport(c):this.parseExport(c,i);default:if(this.isAsyncFunction())return e&&this.unexpected(),this.next(),this.parseFunctionStatement(c,!0,!e);var w=this.isAwaitUsing(!1)?"await using":this.isUsing(!1)?"using":null;if(w)return this.allowUsing||this.raise(this.start,"Using declaration cannot appear in the top level when source type is `script` or in the bare case statement"),"await using"===w&&(this.canAwait||this.raise(this.start,"Await using cannot appear outside of async function"),this.next()),this.next(),this.parseVar(c,!1,w),this.semicolon(),this.finishNode(c,"VariableDeclaration");var C=this.value,S=this.parseExpression();return a===O.name&&"Identifier"===S.type&&this.eat(O.colon)?this.parseLabeledStatement(c,C,S,e):this.parseExpressionStatement(c,S)}},oe.parseBreakContinueStatement=function(e,t){var i="break"===t;this.next(),this.eat(O.semi)||this.insertSemicolon()?e.label=null:this.type!==O.name?this.unexpected():(e.label=this.parseIdent(),this.semicolon());for(var n=0;n<this.labels.length;++n){var a=this.labels[n];if(null==e.label||a.name===e.label.name){if(null!=a.kind&&(i||"loop"===a.kind))break;if(e.label&&i)break}}return n===this.labels.length&&this.raise(e.start,"Unsyntactic "+t),this.finishNode(e,i?"BreakStatement":"ContinueStatement")},oe.parseDebuggerStatement=function(e){return this.next(),this.semicolon(),this.finishNode(e,"DebuggerStatement")},oe.parseDoStatement=function(e){return this.next(),this.labels.push(ce),e.body=this.parseStatement("do"),this.labels.pop(),this.expect(O._while),e.test=this.parseParenExpression(),this.options.ecmaVersion>=6?this.eat(O.semi):this.semicolon(),this.finishNode(e,"DoWhileStatement")},oe.parseForStatement=function(e){this.next();var t=this.options.ecmaVersion>=9&&this.canAwait&&this.eatContextual("await")?this.lastTokStart:-1;if(this.labels.push(ce),this.enterScope(0),this.expect(O.parenL),this.type===O.semi)return t>-1&&this.unexpected(t),this.parseFor(e,null);var i=this.isLet();if(this.type===O._var||this.type===O._const||i){var n=this.startNode(),a=i?"let":this.value;return this.next(),this.parseVar(n,!0,a),this.finishNode(n,"VariableDeclaration"),this.parseForAfterInit(e,n,t)}var c=this.isContextual("let"),l=!1,y=this.isUsing(!0)?"using":this.isAwaitUsing(!0)?"await using":null;if(y){var E=this.startNode();return this.next(),"await using"===y&&(this.canAwait||this.raise(this.start,"Await using cannot appear outside of async function"),this.next()),this.parseVar(E,!0,y),this.finishNode(E,"VariableDeclaration"),this.parseForAfterInit(e,E,t)}var w=this.containsEsc,C=new acorn_DestructuringErrors,S=this.start,I=t>-1?this.parseExprSubscripts(C,"await"):this.parseExpression(!0,C);return this.type===O._in||(l=this.options.ecmaVersion>=6&&this.isContextual("of"))?(t>-1?(this.type===O._in&&this.unexpected(t),e.await=!0):l&&this.options.ecmaVersion>=8&&(I.start!==S||w||"Identifier"!==I.type||"async"!==I.name?this.options.ecmaVersion>=9&&(e.await=!1):this.unexpected()),c&&l&&this.raise(I.start,"The left-hand side of a for-of loop may not start with 'let'."),this.toAssignable(I,!1,C),this.checkLValPattern(I),this.parseForIn(e,I)):(this.checkExpressionErrors(C,!0),t>-1&&this.unexpected(t),this.parseFor(e,I))},oe.parseForAfterInit=function(e,t,i){return(this.type===O._in||this.options.ecmaVersion>=6&&this.isContextual("of"))&&1===t.declarations.length?(this.options.ecmaVersion>=9&&(this.type===O._in?i>-1&&this.unexpected(i):e.await=i>-1),this.parseForIn(e,t)):(i>-1&&this.unexpected(i),this.parseFor(e,t))},oe.parseFunctionStatement=function(e,t,i){return this.next(),this.parseFunction(e,pe|(i?0:ue),!1,t)},oe.parseIfStatement=function(e){return this.next(),e.test=this.parseParenExpression(),e.consequent=this.parseStatement("if"),e.alternate=this.eat(O._else)?this.parseStatement("if"):null,this.finishNode(e,"IfStatement")},oe.parseReturnStatement=function(e){return this.allowReturn||this.raise(this.start,"'return' outside of function"),this.next(),this.eat(O.semi)||this.insertSemicolon()?e.argument=null:(e.argument=this.parseExpression(),this.semicolon()),this.finishNode(e,"ReturnStatement")},oe.parseSwitchStatement=function(e){var t;this.next(),e.discriminant=this.parseParenExpression(),e.cases=[],this.expect(O.braceL),this.labels.push(he),this.enterScope(1024);for(var i=!1;this.type!==O.braceR;)if(this.type===O._case||this.type===O._default){var n=this.type===O._case;t&&this.finishNode(t,"SwitchCase"),e.cases.push(t=this.startNode()),t.consequent=[],this.next(),n?t.test=this.parseExpression():(i&&this.raiseRecoverable(this.lastTokStart,"Multiple default clauses"),i=!0,t.test=null),this.expect(O.colon)}else t||this.unexpected(),t.consequent.push(this.parseStatement(null));return this.exitScope(),t&&this.finishNode(t,"SwitchCase"),this.next(),this.labels.pop(),this.finishNode(e,"SwitchStatement")},oe.parseThrowStatement=function(e){return this.next(),j.test(this.input.slice(this.lastTokEnd,this.start))&&this.raise(this.lastTokEnd,"Illegal newline after throw"),e.argument=this.parseExpression(),this.semicolon(),this.finishNode(e,"ThrowStatement")};var le=[];oe.parseCatchClauseParam=function(){var e=this.parseBindingAtom(),t="Identifier"===e.type;return this.enterScope(t?32:0),this.checkLValPattern(e,t?4:2),this.expect(O.parenR),e},oe.parseTryStatement=function(e){if(this.next(),e.block=this.parseBlock(),e.handler=null,this.type===O._catch){var t=this.startNode();this.next(),this.eat(O.parenL)?t.param=this.parseCatchClauseParam():(this.options.ecmaVersion<10&&this.unexpected(),t.param=null,this.enterScope(0)),t.body=this.parseBlock(!1),this.exitScope(),e.handler=this.finishNode(t,"CatchClause")}return e.finalizer=this.eat(O._finally)?this.parseBlock():null,e.handler||e.finalizer||this.raise(e.start,"Missing catch or finally clause"),this.finishNode(e,"TryStatement")},oe.parseVarStatement=function(e,t,i){return this.next(),this.parseVar(e,!1,t,i),this.semicolon(),this.finishNode(e,"VariableDeclaration")},oe.parseWhileStatement=function(e){return this.next(),e.test=this.parseParenExpression(),this.labels.push(ce),e.body=this.parseStatement("while"),this.labels.pop(),this.finishNode(e,"WhileStatement")},oe.parseWithStatement=function(e){return this.strict&&this.raise(this.start,"'with' in strict mode"),this.next(),e.object=this.parseParenExpression(),e.body=this.parseStatement("with"),this.finishNode(e,"WithStatement")},oe.parseEmptyStatement=function(e){return this.next(),this.finishNode(e,"EmptyStatement")},oe.parseLabeledStatement=function(e,t,i,n){for(var a=0,c=this.labels;a<c.length;a+=1){c[a].name===t&&this.raise(i.start,"Label '"+t+"' is already declared")}for(var l=this.type.isLoop?"loop":this.type===O._switch?"switch":null,y=this.labels.length-1;y>=0;y--){var E=this.labels[y];if(E.statementStart!==e.start)break;E.statementStart=this.start,E.kind=l}return this.labels.push({name:t,kind:l,statementStart:this.start}),e.body=this.parseStatement(n?-1===n.indexOf("label")?n+"label":n:"label"),this.labels.pop(),e.label=i,this.finishNode(e,"LabeledStatement")},oe.parseExpressionStatement=function(e,t){return e.expression=t,this.semicolon(),this.finishNode(e,"ExpressionStatement")},oe.parseBlock=function(e,t,i){for(void 0===e&&(e=!0),void 0===t&&(t=this.startNode()),t.body=[],this.expect(O.braceL),e&&this.enterScope(0);this.type!==O.braceR;){var n=this.parseStatement(null);t.body.push(n)}return i&&(this.strict=!1),this.next(),e&&this.exitScope(),this.finishNode(t,"BlockStatement")},oe.parseFor=function(e,t){return e.init=t,this.expect(O.semi),e.test=this.type===O.semi?null:this.parseExpression(),this.expect(O.semi),e.update=this.type===O.parenR?null:this.parseExpression(),this.expect(O.parenR),e.body=this.parseStatement("for"),this.exitScope(),this.labels.pop(),this.finishNode(e,"ForStatement")},oe.parseForIn=function(e,t){var i=this.type===O._in;return this.next(),"VariableDeclaration"===t.type&&null!=t.declarations[0].init&&(!i||this.options.ecmaVersion<8||this.strict||"var"!==t.kind||"Identifier"!==t.declarations[0].id.type)&&this.raise(t.start,(i?"for-in":"for-of")+" loop variable declaration may not have an initializer"),e.left=t,e.right=i?this.parseExpression():this.parseMaybeAssign(),this.expect(O.parenR),e.body=this.parseStatement("for"),this.exitScope(),this.labels.pop(),this.finishNode(e,i?"ForInStatement":"ForOfStatement")},oe.parseVar=function(e,t,i,n){for(e.declarations=[],e.kind=i;;){var a=this.startNode();if(this.parseVarId(a,i),this.eat(O.eq)?a.init=this.parseMaybeAssign(t):n||"const"!==i||this.type===O._in||this.options.ecmaVersion>=6&&this.isContextual("of")?n||"using"!==i&&"await using"!==i||!(this.options.ecmaVersion>=17)||this.type===O._in||this.isContextual("of")?n||"Identifier"===a.id.type||t&&(this.type===O._in||this.isContextual("of"))?a.init=null:this.raise(this.lastTokEnd,"Complex binding patterns require an initialization value"):this.raise(this.lastTokEnd,"Missing initializer in "+i+" declaration"):this.unexpected(),e.declarations.push(this.finishNode(a,"VariableDeclarator")),!this.eat(O.comma))break}return e},oe.parseVarId=function(e,t){e.id="using"===t||"await using"===t?this.parseIdent():this.parseBindingAtom(),this.checkLValPattern(e.id,"var"===t?1:2,!1)};var pe=1,ue=2;function isPrivateNameConflicted(e,t){var i=t.key.name,n=e[i],a="true";return"MethodDefinition"!==t.type||"get"!==t.kind&&"set"!==t.kind||(a=(t.static?"s":"i")+t.kind),"iget"===n&&"iset"===a||"iset"===n&&"iget"===a||"sget"===n&&"sset"===a||"sset"===n&&"sget"===a?(e[i]="true",!1):!!n||(e[i]=a,!1)}function checkKeyName(e,t){var i=e.computed,n=e.key;return!i&&("Identifier"===n.type&&n.name===t||"Literal"===n.type&&n.value===t)}oe.parseFunction=function(e,t,i,n,a){this.initFunction(e),(this.options.ecmaVersion>=9||this.options.ecmaVersion>=6&&!n)&&(this.type===O.star&&t&ue&&this.unexpected(),e.generator=this.eat(O.star)),this.options.ecmaVersion>=8&&(e.async=!!n),t&pe&&(e.id=4&t&&this.type!==O.name?null:this.parseIdent(),!e.id||t&ue||this.checkLValSimple(e.id,this.strict||e.generator||e.async?this.treatFunctionsAsVar?1:2:3));var c=this.yieldPos,l=this.awaitPos,y=this.awaitIdentPos;return this.yieldPos=0,this.awaitPos=0,this.awaitIdentPos=0,this.enterScope(functionFlags(e.async,e.generator)),t&pe||(e.id=this.type===O.name?this.parseIdent():null),this.parseFunctionParams(e),this.parseFunctionBody(e,i,!1,a),this.yieldPos=c,this.awaitPos=l,this.awaitIdentPos=y,this.finishNode(e,t&pe?"FunctionDeclaration":"FunctionExpression")},oe.parseFunctionParams=function(e){this.expect(O.parenL),e.params=this.parseBindingList(O.parenR,!1,this.options.ecmaVersion>=8),this.checkYieldAwaitInDefaultParams()},oe.parseClass=function(e,t){this.next();var i=this.strict;this.strict=!0,this.parseClassId(e,t),this.parseClassSuper(e);var n=this.enterClassBody(),a=this.startNode(),c=!1;for(a.body=[],this.expect(O.braceL);this.type!==O.braceR;){var l=this.parseClassElement(null!==e.superClass);l&&(a.body.push(l),"MethodDefinition"===l.type&&"constructor"===l.kind?(c&&this.raiseRecoverable(l.start,"Duplicate constructor in the same class"),c=!0):l.key&&"PrivateIdentifier"===l.key.type&&isPrivateNameConflicted(n,l)&&this.raiseRecoverable(l.key.start,"Identifier '#"+l.key.name+"' has already been declared"))}return this.strict=i,this.next(),e.body=this.finishNode(a,"ClassBody"),this.exitClassBody(),this.finishNode(e,t?"ClassDeclaration":"ClassExpression")},oe.parseClassElement=function(e){if(this.eat(O.semi))return null;var t=this.options.ecmaVersion,i=this.startNode(),n="",a=!1,c=!1,l="method",y=!1;if(this.eatContextual("static")){if(t>=13&&this.eat(O.braceL))return this.parseClassStaticBlock(i),i;this.isClassElementNameStart()||this.type===O.star?y=!0:n="static"}if(i.static=y,!n&&t>=8&&this.eatContextual("async")&&(!this.isClassElementNameStart()&&this.type!==O.star||this.canInsertSemicolon()?n="async":c=!0),!n&&(t>=9||!c)&&this.eat(O.star)&&(a=!0),!n&&!c&&!a){var E=this.value;(this.eatContextual("get")||this.eatContextual("set"))&&(this.isClassElementNameStart()?l=E:n=E)}if(n?(i.computed=!1,i.key=this.startNodeAt(this.lastTokStart,this.lastTokStartLoc),i.key.name=n,this.finishNode(i.key,"Identifier")):this.parseClassElementName(i),t<13||this.type===O.parenL||"method"!==l||a||c){var w=!i.static&&checkKeyName(i,"constructor"),C=w&&e;w&&"method"!==l&&this.raise(i.key.start,"Constructor can't have get/set modifier"),i.kind=w?"constructor":l,this.parseClassMethod(i,a,c,C)}else this.parseClassField(i);return i},oe.isClassElementNameStart=function(){return this.type===O.name||this.type===O.privateId||this.type===O.num||this.type===O.string||this.type===O.bracketL||this.type.keyword},oe.parseClassElementName=function(e){this.type===O.privateId?("constructor"===this.value&&this.raise(this.start,"Classes can't have an element named '#constructor'"),e.computed=!1,e.key=this.parsePrivateIdent()):this.parsePropertyName(e)},oe.parseClassMethod=function(e,t,i,n){var a=e.key;"constructor"===e.kind?(t&&this.raise(a.start,"Constructor can't be a generator"),i&&this.raise(a.start,"Constructor can't be an async method")):e.static&&checkKeyName(e,"prototype")&&this.raise(a.start,"Classes may not have a static property named prototype");var c=e.value=this.parseMethod(t,i,n);return"get"===e.kind&&0!==c.params.length&&this.raiseRecoverable(c.start,"getter should have no params"),"set"===e.kind&&1!==c.params.length&&this.raiseRecoverable(c.start,"setter should have exactly one param"),"set"===e.kind&&"RestElement"===c.params[0].type&&this.raiseRecoverable(c.params[0].start,"Setter cannot use rest params"),this.finishNode(e,"MethodDefinition")},oe.parseClassField=function(e){return checkKeyName(e,"constructor")?this.raise(e.key.start,"Classes can't have a field named 'constructor'"):e.static&&checkKeyName(e,"prototype")&&this.raise(e.key.start,"Classes can't have a static field named 'prototype'"),this.eat(O.eq)?(this.enterScope(576),e.value=this.parseMaybeAssign(),this.exitScope()):e.value=null,this.semicolon(),this.finishNode(e,"PropertyDefinition")},oe.parseClassStaticBlock=function(e){e.body=[];var t=this.labels;for(this.labels=[],this.enterScope(320);this.type!==O.braceR;){var i=this.parseStatement(null);e.body.push(i)}return this.next(),this.exitScope(),this.labels=t,this.finishNode(e,"StaticBlock")},oe.parseClassId=function(e,t){this.type===O.name?(e.id=this.parseIdent(),t&&this.checkLValSimple(e.id,2,!1)):(!0===t&&this.unexpected(),e.id=null)},oe.parseClassSuper=function(e){e.superClass=this.eat(O._extends)?this.parseExprSubscripts(null,!1):null},oe.enterClassBody=function(){var e={declared:Object.crea
```

---

## Assistant (Build · Muse Spark 1.3 Free · 5.2s)

_Thinking:_



_Thinking:_



**Tool: bash**

**Input:**
```json
{
  "command": "git status --short | head -30",
  "workdir": "/Users/nazmudinalkhamil/Documents/Projects/generator-module-app"
}
```

**Output:**
```
 M .agents/skills/frontend-conventions/SKILL.md
 M package-lock.json
 M package.json
 M scripts/verify-generator/emission.mjs
 M src/App.tsx
 M src/app/ProtectedAppShell.tsx
 M src/app/navigation.tsx
 M src/app/router.tsx
 M src/modules/auth/api/mock.ts
 M src/modules/auth/hooks/useAuth.ts
 M src/modules/generator/api/writeToRepo.ts
 M src/modules/generator/builder/ContractPanel.tsx
 M src/modules/generator/builder/DetailBuilderCanvas.tsx
 M src/modules/generator/builder/FormBuilderCanvas.tsx
 M src/modules/generator/builder/ListBuilderCanvas.tsx
 M src/modules/generator/builder/TestDataPanel.tsx
 M src/modules/generator/builder/draft.ts
 M src/modules/generator/components/FeaturesStep.tsx
 M src/modules/generator/components/FieldForm.tsx
 M src/modules/generator/components/GenerateDialog.tsx
 M src/modules/generator/components/MenuIconDialog.tsx
 M src/modules/generator/components/ModuleInfoStep.tsx
 M src/modules/generator/components/ModulesTab.tsx
 M src/modules/generator/components/OutputPanel.tsx
 M src/modules/generator/components/ReviewStep.tsx
 M src/modules/generator/definitions/index.ts
 M src/modules/generator/definitions/normalize.ts
 M src/modules/generator/definitions/types.ts
 M src/modules/generator/definitions/validate.ts
 M src/modules/generator/engine/fieldGenerator.ts

```

---

## Assistant (Build · Muse Spark 1.3 Free · 6.6s)

_Thinking:_



**Tool: bash**

**Input:**
```json
{
  "command": "npm run verify:generator > /tmp/verify.log 2>&1; echo \"exit=$?\"; tail -4 /tmp/verify.log",
  "workdir": "/Users/nazmudinalkhamil/Documents/Projects/generator-module-app"
}
```

**Output:**
```
exit=1
    at async onImport.tracePromise.__proto__ (node:internal/modules/esm/loader:547:26)
    at async asyncRunEntryPointWithESMLoader (node:internal/modules/run_main:116:5)

Node.js v22.13.0

```

---

## Assistant (Build · Muse Spark 1.3 Free · 4.3s)

**Tool: read**

**Input:**
```json
{
  "filePath": "/tmp/verify.log",
  "limit": 30
}
```

**Output:**
```
<path>/tmp/verify.log</path>
<type>file</type>
<content>
1: 
2: > generator-module-app@0.0.0 verify:generator
3: > node scripts/verify-generator/emission.mjs && node scripts/verify-generator/compile.mjs
4: 
5: EMISSION PASS
6: /Users/nazmudinalkhamil/Documents/Projects/generator-module-app/node_modules/jiti/dist/jiti.cjs:1
7: (()=>{var e={"./node_modules/.pnpm/mlly@1.8.2/node_modules/mlly/dist lazy recursive"(e){function webpackEmptyAsyncContext(e){return Promise.resolve().then(function(){var t=new Error("Cannot find module '"+e+"'");throw t.code="MODULE_NOT_FOUND",t})}webpackEmptyAsyncContext.keys=()=>[],webpackEmptyAsyncContext.resolve=webpackEmptyAsyncContext,webpackEmptyAsyncContext.id="./node_modules/.pnpm/mlly@1.8.2/node_modules/mlly/dist lazy recursive",e.exports=webpackEmptyAsyncContext},fs(e){"use strict";e.exports=require("fs")},"node:fs"(e){"use strict";e.exports=require("node:fs")},"node:module"(e){"use strict";e.exports=require("node:module")},"node:path"(e){"use strict";e.exports=require("node:path")},os(e){"use strict";e.exports=require("os")},path(e){"use strict";e.exports=require("path")},"./node_modules/.pnpm/get-tsconfig@4.14.0/node_modules/get-tsconfig/dist/index.cjs"(e,t,i){"use strict";var n=Object.defineProperty,r=(e,t)=>n(e,"name",{value:t,configurable:!0}),a=i("node:path"),c=i("node:fs"),l=i("node:module"),y=i("./node_modules/.pnpm/resolve-pkg-maps@1.0.0/node_modules/resolve-pkg-maps/dist/index.cjs"),E=i("fs"),w=i("os"),C=i("path");function h(e){return e.startsWith("\\\\?\\")?e:e.replace(/\\/g,"/")}r(h,"slash");const S=r(e=>{const t=c[e];return(i,...n)=>{const a=`${e}:${n.join(":")}`;let l=null==i?void 0:i.get(a);return void 0===l&&(l=Reflect.apply(t,c,n),null==i||i.set(a,l)),l}},"cacheFs"),I=S("existsSync"),N=S("readFileSync"),O=S("statSync"),j=r((e,t,i)=>{for(;;){const n=a.posix.join(e,t);if(I(i,n))return n;const c=a.dirname(e);if(c===e)return;e=c}},"findUp"),F=/^\.{1,2}(\/.*)?$/,B=r(e=>{const t=h(e);return F.test(t)?t:`./${t}`},"normalizeRelativePath");function Ne(e,t=!1){const i=e.length;let n=0,a="",c=0,l=16,y=0,E=0,w=0,C=0,S=0;function _(t,i){let a=0,c=0;for(;a<t;){let t=e.charCodeAt(n);if(t>=48&&t<=57)c=16*c+t-48;else if(t>=65&&t<=70)c=16*c+t-65+10;else{if(!(t>=97&&t<=102))break;c=16*c+t-97+10}n++,a++}return a<t&&(c=-1),c}function b(e){n=e,a="",c=0,l=16,S=... (line truncated to 2000 chars)
8:                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                             
9: 
10: Error: ParseError: Unexpected token, expected ":"  
11:  /Users/nazmudinalkhamil/Documents/Projects/generator-module-app/src/modules/generator/templates/crud/moduleIndex.ts:77:33
12:     at /Users/nazmudinalkhamil/Documents/Projects/generator-module-app/node_modules/jiti/dist/jiti.cjs:1:187397
13:     at /Users/nazmudinalkhamil/Documents/Projects/generator-module-app/src/modules/generator/engine/moduleGenerator.ts:35:20
14:     at eval_evalModule (/Users/nazmudinalkhamil/Documents/Projects/generator-module-app/node_modules/jiti/dist/jiti.cjs:1:184467)
15:     at jitiRequire (/Users/nazmudinalkhamil/Documents/Projects/generator-module-app/node_modules/jiti/dist/jiti.cjs:1:179335)
16:     at /Users/nazmudinalkhamil/Documents/Projects/generator-module-app/node_modules/jiti/dist/jiti.cjs:1:187397
17:     at file:///Users/nazmudinalkhamil/Documents/Projects/generator-module-app/scripts/verify-generator/compile.mjs:14:28
18:     at ModuleJob.run (node:internal/modules/esm/module_job:271:25)
19:     at async onImport.tracePromise.__proto__ (node:internal/modules/esm/loader:547:26)
20:     at async asyncRunEntryPointWithESMLoader (node:internal/modules/run_main:116:5)
21: 
22: Node.js v22.13.0

(End of file - total 22 lines)
</content>
```

---

## Assistant (Build · Muse Spark 1.3 Free · 4.3s)

_Thinking:_



_Thinking:_



**Tool: read**

**Input:**
```json
{
  "filePath": "/Users/nazmudinalkhamil/Documents/Projects/generator-module-app/src/modules/generator/templates/crud/moduleIndex.ts",
  "limit": 40,
  "offset": 55
}
```

**Output:**
```
<path>/Users/nazmudinalkhamil/Documents/Projects/generator-module-app/src/modules/generator/templates/crud/moduleIndex.ts</path>
<type>file</type>
<content>
55: 
56: ## 4. Permission keys (otomatis dari base \`${permissions.base}\`)
57: 
58: | Aksi | Key |
59: | --- | --- |
60: | Lihat list & detail + menu navigasi | \`${permissions.view}\` |
61: | Buat data | \`${permissions.create}\` |
62: | Ubah data | \`${permissions.update}\` |
63: | Hapus / restore data | \`${permissions.delete}\` |
64: ${features.bulkUpload ? `| Bulk upload | \`${permissions.bulkUpload}\` |\n` : ''}${features.export ? `| Export | \`${permissions.export}\` |\n` : ''}
65: Konstanta tersedia di \`permissions.ts\` (\`${names.entity}Permissions\`).
66: Pastikan permission user (mis. \`localStorage["permissions"]\`) memuat key di atas
67: agar menu dan aksi tampil.
68: ${features.export || features.bulkUpload ? `
69: ## 5. API real (\`api/service.ts\`)
70: 
71: Saklar sumber data ada di \`api/resolver.ts\` via flag \`USE_MOCK\` (di \`mock.ts\`,
72: default semua \`true\` = mock lokal tanpa backend): ubah flag yang relevan menjadi
73: \`false\` untuk memakai Real API via \`service.ts\` (axios \`shared/lib/api\`).
74: Nama export resolver sama untuk kedua sumber, jadi \`queries.ts\`/\`mutations.ts\`
75: tidak perlu berubah.
76: 
77: Kontrak endpoint (contoh module `${names.pluralKebab}`):
78: 
79: | Aksi | Method & endpoint | Catatan |
80: | --- | --- | --- |
81: | List | \`GET /api/v1/${names.pluralKebab}\` | Query params sama seperti filter list; response \`ApiList\`. |
82: | Detail | \`GET /api/v1/${names.pluralKebab}/:id\` | Response entity. |
83: | Buat data | \`POST /api/v1/${names.pluralKebab}\` | Body JSON payload; response \`{ message, data }\`. |
84: | Ubah data | \`PUT /api/v1/${names.pluralKebab}/:id\` | Body JSON payload; response \`{ message, data }\`. |
85: | Hapus (soft) | \`DELETE /api/v1/${names.pluralKebab}/:id\` | Response \`{ message }\`. |
86: | Restore | \`PATCH /api/v1/${names.pluralKebab}/:id/restore\` | Response \`{ message, data }\`. |
87: ${features.export ? `| Export | \`GET /api/v1/${names.pluralKebab}/export\` | Query params sama seperti list; response blob \`.xlsx\`. |\n` : ''}${features.bulkUpload ? `| Bulk upload | \`POST /api/v1/${names.pluralKebab}/bulk-upload\` | Multipart field \`file\` (.xlsx); response \`BulkUploadResult\`. |\n| Template bulk | \`GET /api/v1/${names.pluralKebab}/bulk-template\` | Response blob \`.xlsx\` template. |\n` : ''}${hasOptions ? `| Opsi field | \`GET\` endpoint per field (lihat \`service.ts\`) | Response list opsi. |\n` : ''}Error mengikuti envelope axios \`{ response: { status, data } }\` agar
88: kompatibel dengan \`mapSubmitError\` (\`response_output.errors\` untuk field error).
89: ` : ''}
90: ## ${features.export || features.bulkUpload ? '6' : '5'}. Verifikasi
91: 
92: \`\`\`bash
93: npm run lint && npm run build
94: \`\`\`

(Showing lines 55-94 of 99. Use offset=95 to continue.)
</content>
```

---

## Assistant (Build · Muse Spark 1.3 Free · 4.7s)

_Thinking:_



**Tool: edit**

**Input:**
```json
{
  "filePath": "/Users/nazmudinalkhamil/Documents/Projects/generator-module-app/src/modules/generator/templates/crud/moduleIndex.ts",
  "newString": "Kontrak endpoint (contoh module ${names.pluralKebab}):",
  "oldString": "Kontrak endpoint (contoh module `${names.pluralKebab}`):"
}
```

**Output:**
```
Edit applied successfully.
```

---

## Assistant (Build · Muse Spark 1.3 Free · 15.2s)

**Tool: bash**

**Input:**
```json
{
  "command": "npm run verify:generator > /tmp/verify.log 2>&1; echo \"exit=$?\"; grep -E \"PASS|FAIL|error\" /tmp/verify.log | head -5",
  "workdir": "/Users/nazmudinalkhamil/Documents/Projects/generator-module-app"
}
```

**Output:**
```
exit=0
EMISSION PASS
COMPILE PASS (25 file)

```

---

## Assistant (Build · Muse Spark 1.3 Free · 13.5s)

_Thinking:_



**Tool: bash**

**Input:**
```json
{
  "command": "npm run lint > /tmp/lint.log 2>&1; echo \"lint_exit=$?\"; tail -2 /tmp/lint.log; npm run build > /tmp/build.log 2>&1; echo \"build_exit=$?\"; grep -E \"error TS|built in\" /tmp/build.log | head -3",
  "workdir": "/Users/nazmudinalkhamil/Documents/Projects/generator-module-app"
}
```

**Output:**
```
lint_exit=0
> oxlint src vite.config.ts

build_exit=0
✓ built in 793ms

```

---

## Assistant (Build · Muse Spark 1.3 Free · 31.4s)

_Thinking:_



_Thinking:_



**Tool: bash**

**Input:**
```json
{
  "command": "cat /Users/nazmudinalkhamil/Documents/Projects/boilerplate-fe/src/modules/internal/user-management/manage-user/api/index.ts; echo '==='; grep -n \"apiIndexTemplate\" -A 8 src/modules/generator/templates/crud/api.ts | head -12",
  "workdir": "/Users/nazmudinalkhamil/Documents/Projects/generator-module-app"
}
```

**Output:**
```
export * from './resolver';
export * from './queries';
export * from './mutations';
===
671:export function apiIndexTemplate(ctx: TemplateContext): string {
672-  const { features } = ctx;
673-  const needMutations =
674-    features.create || features.edit || features.detail || features.delete || features.bulkUpload;
675-  return `export * from './resolver';
676-${needsQueriesFile(ctx) ? `export * from './queries';\n` : ''}${needMutations ? `export * from './mutations';\n` : ''}`;
677-}

```

---

## Assistant (Build · Muse Spark 1.3 Free · 5.7s)

_Thinking:_



**Tool: write**

**Input:**
```json
{
  "content": "import { createJiti } from 'jiti';\nimport { writeFileSync } from 'node:fs';\nconst ROOT = '/Users/nazmudinalkhamil/Documents/Projects/generator-module-app';\nconst jiti = createJiti(import.meta.url);\nconst mg = jiti(`${ROOT}/src/modules/generator/engine/moduleGenerator.ts`);\nconst config = {\n  parentName: null,\n  moduleName: 'Verifygen Tmp',\n  type: 'crud',\n  permissionKey: 'verifygentmp',\n  features: {\n    list: true,\n    detail: true,\n    create: true,\n    edit: true,\n    delete: true,\n    bulkUpload: true,\n    export: true,\n  },\n  fields: [\n    {\n      name: 'itemName',\n      label: 'Item Name',\n      type: 'textField',\n      rules: ['required'],\n      sortable: true,\n      filterable: true,\n      filterCriteria: 'contains',\n      source: 'none',\n    },\n    {\n      name: 'kondisi',\n      label: 'Kondisi',\n      type: 'selectField',\n      rules: [],\n      source: 'mockStatic',\n      options: [\n        { label: 'Baru', value: 'baru' },\n        { label: 'Bekas', value: 'bekas' },\n      ],\n    },\n  ],\n};\nconst files = mg.generateModule(config);\nfor (const f of files) {\n  if (f.path.includes('api/service') || f.path.includes('api/resolver')) {\n    console.log('===== ' + f.path + ' =====');\n    console.log(f.content);\n  }\n}\n",
  "filePath": "/tmp/emit-check.mjs"
}
```

**Output:**
```
Wrote file successfully.
```

---

## Assistant (Build · Muse Spark 1.3 Free · 3.8s)

**Tool: bash**

**Input:**
```json
{
  "command": "node /tmp/emit-check.mjs > /tmp/emit-out.txt 2>&1; echo \"exit=$?\"; head -60 /tmp/emit-out.txt",
  "workdir": "/Users/nazmudinalkhamil/Documents/Projects/generator-module-app"
}
```

**Output:**
```
exit=1
node:internal/modules/esm/resolve:857
  throw new ERR_MODULE_NOT_FOUND(packageName, fileURLToPath(base), null);
        ^

Error [ERR_MODULE_NOT_FOUND]: Cannot find package 'jiti' imported from /private/tmp/emit-check.mjs
    at packageResolve (node:internal/modules/esm/resolve:857:9)
    at moduleResolve (node:internal/modules/esm/resolve:926:18)
    at defaultResolve (node:internal/modules/esm/resolve:1056:11)
    at ModuleLoader.defaultResolve (node:internal/modules/esm/loader:654:12)
    at #cachedDefaultResolve (node:internal/modules/esm/loader:603:25)
    at ModuleLoader.resolve (node:internal/modules/esm/loader:586:38)
    at ModuleLoader.getModuleJobForImport (node:internal/modules/esm/loader:242:38)
    at ModuleJob._link (node:internal/modules/esm/module_job:135:49) {
  code: 'ERR_MODULE_NOT_FOUND'
}

Node.js v22.13.0

```

---

## Assistant (Build · Muse Spark 1.3 Free · 4.4s)

**Tool: bash**

**Input:**
```json
{
  "command": "cp /tmp/emit-check.mjs ./emit-check.tmp.mjs && node ./emit-check.tmp.mjs > /tmp/emit-out.txt 2>&1; echo \"exit=$?\"; rm ./emit-check.tmp.mjs; head -50 /tmp/emit-out.txt",
  "workdir": "/Users/nazmudinalkhamil/Documents/Projects/generator-module-app"
}
```

**Output:**
```
exit=0
===== src/modules/verifygen-tmp/api/resolver.ts =====
import { USE_MOCK,
  mockGetVerifygenTmps,
  mockGetVerifygenTmpById,
  mockCreateVerifygenTmp,
  mockUpdateVerifygenTmp,
  mockDeleteVerifygenTmp,
  mockRestoreVerifygenTmp,
  mockExportVerifygenTmps,
  mockBulkUploadVerifygenTmps,
  mockDownloadVerifygenTmpTemplate,
  mockGetKondisiOptions,
} from './mock';
import * as service from './service';

export const getVerifygenTmps = USE_MOCK.list ? mockGetVerifygenTmps : service.getVerifygenTmps;
export const getVerifygenTmpById = USE_MOCK.detail ? mockGetVerifygenTmpById : service.getVerifygenTmpById;
export const createVerifygenTmp = USE_MOCK.create ? mockCreateVerifygenTmp : service.createVerifygenTmp;
export const updateVerifygenTmp = USE_MOCK.update ? mockUpdateVerifygenTmp : service.updateVerifygenTmp;
export const deleteVerifygenTmp = USE_MOCK.delete ? mockDeleteVerifygenTmp : service.deleteVerifygenTmp;
export const restoreVerifygenTmp = USE_MOCK.restore ? mockRestoreVerifygenTmp : service.restoreVerifygenTmp;
export const exportVerifygenTmps = USE_MOCK.export ? mockExportVerifygenTmps : service.exportVerifygenTmps;
export const bulkUploadVerifygenTmps = USE_MOCK.bulkUpload ? mockBulkUploadVerifygenTmps : service.bulkUploadVerifygenTmps;
export const downloadVerifygenTmpTemplate = USE_MOCK.bulkTemplate ? mockDownloadVerifygenTmpTemplate : service.downloadVerifygenTmpTemplate;
export const getKondisiOptions = USE_MOCK.kondisiOptions ? mockGetKondisiOptions : service.getKondisiOptions;

===== src/modules/verifygen-tmp/api/service.ts =====
import api from '../../../shared/lib/api';
import type {
  VerifygenTmp,
  VerifygenTmpMutationResult,
  BulkUploadResult,
  CreateVerifygenTmpPayload,
  GetVerifygenTmpsParams,
  VerifygenTmpListItem,
  KondisiOption,
} from '../types';
import type { ApiDetail, ApiList, ApiResponse } from '../../../shared/types';

export async function getVerifygenTmps(params?: GetVerifygenTmpsParams): Promise<ApiList<VerifygenTmpListItem>> {
  const res = await api.get<ApiResponse<ApiList<VerifygenTmpListItem>>>('/api/v1/verifygen-tmps', { params });
  return res.data.response_output ?? { list: { pagination: null, content: [] } };
}

export async function getVerifygenTmpById(id: string): Promise<VerifygenTmp> {
  const res = await api.get<ApiResponse<ApiDetail<VerifygenTmp>>>(`/api/v1/verifygen-tmps/${id}`);
  return res.data.response_output!.detail;
}

export async function createVerifygenTmp(data: CreateVerifygenTmpPayload): Promise<VerifygenTmpMutationResult> {

```

---

## Assistant (Build · Muse Spark 1.3 Free · 6.6s)

_Thinking:_



**Tool: bash**

**Input:**
```json
{
  "command": "sed -n '50,110p' /tmp/emit-out.txt",
  "workdir": "/Users/nazmudinalkhamil/Documents/Projects/generator-module-app"
}
```

**Output:**
```
export async function createVerifygenTmp(data: CreateVerifygenTmpPayload): Promise<VerifygenTmpMutationResult> {
  const res = await api.post<ApiResponse<ApiDetail<VerifygenTmp>>>('/api/v1/verifygen-tmps', data);
  return {
    message: res.data.response_schema.response_message,
    data: res.data.response_output!.detail,
  };
}

export async function updateVerifygenTmp(
  id: string,
  data: CreateVerifygenTmpPayload,
): Promise<VerifygenTmpMutationResult> {
  const res = await api.put<ApiResponse<ApiDetail<VerifygenTmp>>>(`/api/v1/verifygen-tmps/${id}`, data);
  return {
    message: res.data.response_schema.response_message,
    data: res.data.response_output!.detail,
  };
}

export async function deleteVerifygenTmp(id: string): Promise<{ message: string }> {
  const res = await api.delete<ApiResponse<null>>(`/api/v1/verifygen-tmps/${id}`);
  return { message: res.data.response_schema.response_message };
}

export async function restoreVerifygenTmp(id: string): Promise<VerifygenTmpMutationResult> {
  const res = await api.patch<ApiResponse<ApiDetail<VerifygenTmp>>>(`/api/v1/verifygen-tmps/${id}/restore`);
  return {
    message: res.data.response_schema.response_message,
    data: res.data.response_output!.detail,
  };
}

export async function getKondisiOptions(): Promise<KondisiOption[]> {
  const res = await api.get<ApiResponse<ApiList<KondisiOption>>>('/api/v1/verifygen-tmps/kondisis');
  return res.data.response_output?.list.content ?? [];
}

export async function exportVerifygenTmps(params?: GetVerifygenTmpsParams): Promise<Blob> {
  const res = await api.get('/api/v1/verifygen-tmps/export', { params, responseType: 'blob' });
  return res.data as Blob;
}

export async function bulkUploadVerifygenTmps(file: File): Promise<BulkUploadResult> {
  const form = new FormData();
  form.append('file', file);
  const res = await api.post<ApiResponse<BulkUploadResult>>('/api/v1/verifygen-tmps/bulk-upload', form);
  return res.data.response_output!;
}

export async function downloadVerifygenTmpTemplate(): Promise<Blob> {
  const res = await api.get('/api/v1/verifygen-tmps/bulk-template', { responseType: 'blob' });
  return res.data as Blob;
}


```

---

## Assistant (Build · Muse Spark 1.3 Free · 5.8s)

_Thinking:_



_Thinking:_



**Tool: edit**

**Input:**
```json
{
  "filePath": "/Users/nazmudinalkhamil/Documents/Projects/generator-module-app/src/modules/generator/templates/crud/api.ts",
  "newString": "  const mockImports = ops.map(([, , mockName]) => mockName).join(',\\n  ');\n  return `import {\n  USE_MOCK,\n  ${mockImports},\n} from './mock';",
  "oldString": "  const mockImports = ops.map(([, , mockName]) => mockName).join(',\\n  ');\n  return `import { USE_MOCK,\\n  ${mockImports},\\n} from './mock';"
}
```

**Output:**
```
Edit applied successfully.
```

---

## Assistant (Build · Muse Spark 1.3 Free · 24.8s)

**Tool: bash**

**Input:**
```json
{
  "command": "npm run verify:generator > /tmp/verify.log 2>&1; echo \"exit=$?\"; grep -E \"PASS|FAIL\" /tmp/verify.log; npm run lint > /tmp/lint.log 2>&1; echo \"lint=$?\"; npm run build > /tmp/build.log 2>&1; echo \"build=$?\"; grep -E \"built in\" /tmp/build.log",
  "workdir": "/Users/nazmudinalkhamil/Documents/Projects/generator-module-app"
}
```

**Output:**
```
exit=0
EMISSION PASS
COMPILE PASS (25 file)
lint=0
build=0
✓ built in 747ms

```

---

## Assistant (Build · Muse Spark 1.3 Free · 4.9s)

**Tool: todowrite**

**Input:**
```json
{
  "todos": [
    {
      "content": "Add axios + shared/lib/api client (mirror boilerplate, adapted keys)",
      "status": "completed",
      "priority": "high"
    },
    {
      "content": "Rewrite serviceTemplate: axios + /api/v1 REST (mirror manage-user service)",
      "status": "completed",
      "priority": "high"
    },
    {
      "content": "Rewrite resolverTemplate: USE_MOCK pattern; confirm mock flags",
      "status": "completed",
      "priority": "high"
    },
    {
      "content": "Update INTEGRATION template docs; verify lint/build/verify",
      "status": "completed",
      "priority": "high"
    }
  ]
}
```

**Output:**
```
[
  {
    "content": "Add axios + shared/lib/api client (mirror boilerplate, adapted keys)",
    "status": "completed",
    "priority": "high"
  },
  {
    "content": "Rewrite serviceTemplate: axios + /api/v1 REST (mirror manage-user service)",
    "status": "completed",
    "priority": "high"
  },
  {
    "content": "Rewrite resolverTemplate: USE_MOCK pattern; confirm mock flags",
    "status": "completed",
    "priority": "high"
  },
  {
    "content": "Update INTEGRATION template docs; verify lint/build/verify",
    "status": "completed",
    "priority": "high"
  }
]
```

---

## Assistant (Build · Muse Spark 1.3 Free · 7.9s)

Selesai. Pattern **Service / Mock Service / Service Mock Resolver** dari `boilerplate_fe` (referensi: `auth/login` + `internal/user-management/manage-user`) sekarang diterapkan ke module generator — menggantikan pendekatan fetch + `FORCE_REAL_API` sebelumnya. Semua hijau: `verify:generator` (EMISSION + COMPILE 25 file), `lint`, `build`.

**Yang dipelajari dari boilerplate & diterapkan 1:1**

Struktur & naming per modul (`api/`):
- `mock.ts` — mengekspor `USE_MOCK` flags per operasi + fungsi `mockX` (delay, records in-memory). Flag yang di-emit: `list/detail/create/update/delete/restore`, `export`, `bulkUpload`/`bulkTemplate`, `{field}Options`, `{field}LoadOptions` (termasuk sub-field array — ini gap yang saya tambahkan karena sebelumnya flag-nya hilang).
- `service.ts` — axios via `shared/lib/api`, endpoint REST `/api/v1/[resource]` (`GET /users`, `GET /users/:id`, `POST`, `PUT /:id`, `DELETE /:id`, `PATCH /:id/restore`, `/export`, `/bulk-upload`, `/bulk-template`, options per field), unwrap envelope `response_output`/`response_schema` persis seperti `manage-user/service.ts`.
- `resolver.ts` — `import { USE_MOCK, mockX… } from './mock'; import * as service from './service'; export const x = USE_MOCK.op ? mockX : service.x;`
- `queries.ts`/`mutations.ts` import dari `./resolver` (tak berubah), `api/index.ts` hanya re-export resolver/queries/mutations.

Infrastruktur pendukung:
- `axios` ditambahkan sebagai dep; `src/shared/lib/api.ts` baru — axios instance mirror boilerplate (baseURL dari `VITE_API_BASE_URL`, injeksi `Bearer` token, unwrap error login, event `api-forbidden` 403 yang sudah dipakai `Toast` kita), disesuaikan ke storage keys kita (`auth_token`, dst.).
- `INTEGRATION.md` template diperbarui ke kontrak `/api/v1` + dokumentasi flag `USE_MOCK`.

**Deviasi yang disengaja (dicatat, bukan pattern baru):**
- `USE_MOCK` default `true` (mock) karena app ini mock-only tanpa backend; di boilerplate `false` karena BE-nya ada. Bentuk dan granularitas flag identik.
- Tanpa flow 401-refresh/session-expired di client karena auth app ini masih mock (belum ada endpoint refresh); ditambahkan saat auth real diimplementasikan.
- Menggantikan keputusan endpoint `/api/[module]/[feature]` sebelumnya — sekarang mengikuti boilerplate (`/api/v1/[pluralKebab]` + `/bulk-upload`, `/bulk-template`, `/export`, `/options`).

---

## User

mana untuk auth belum disamakan konsep service, mock, resolver

harusnya auth/login/api/service.ts, mock.ts, resolver.ts

---

## Assistant (Build · Muse Spark 1.3 Free · 8.8s)

_Thinking:_

Evaluating restructuring options for the auth module to match the Service/Mock/Resolver pattern.

_Thinking:_



**Tool: bash**

**Input:**
```json
{
  "command": "cat src/modules/auth/api/index.ts; echo '==='; ls src/modules/auth/types/ 2>/dev/null; cat src/modules/auth/types/*.ts 2>/dev/null | head -40; echo '==='; cat src/modules/auth/index.ts",
  "workdir": "/Users/nazmudinalkhamil/Documents/Projects/generator-module-app"
}
```

**Output:**
```
export { mockLogin as login, mockLogout as logout } from './mock';
export { demoAccounts } from './mockUsers';
===
index.ts
export interface AuthUser {
  username: string;
  name: string;
  role: string;
}

export interface LoginPayload {
  username: string;
  password: string;
}

export interface LoginResult {
  user: AuthUser;
  token: string;
  /** Sudah dinormalisasi (bentuk compact `modul:aksi` di-expand). */
  permissions: string[];
}
===
export { AuthProvider, RequireAuth, PermissionGate } from './components';
export type { AuthContextValue } from './components';
export { useAuth } from './hooks';
export { demoAccounts } from './api';
export type { AuthUser, LoginPayload, LoginResult } from './types';

```

---

## Assistant (Build · Muse Spark 1.3 Free · 4.6s)

**Tool: bash**

**Input:**
```json
{
  "command": "cat src/modules/auth/components/AuthProvider.tsx; echo '==='; grep -n \"mockUsers\\|demoAccounts\" src/modules/auth/api/mockUsers.ts | head -5; sed -n '1,40p' src/modules/auth/api/mockUsers.ts",
  "workdir": "/Users/nazmudinalkhamil/Documents/Projects/generator-module-app"
}
```

**Output:**
```
import { createContext, useCallback, useMemo, useState } from 'react';
import { Outlet, useNavigate } from 'react-router';
import {
  getStoredPermissions,
  hasPermissionKey,
} from '../../../shared/utils';
import { login as loginRequest, logout as logoutRequest } from '../api';
import type { AuthUser, LoginPayload } from '../types';

const TOKEN_KEY = 'auth_token';
const USER_KEY = 'auth_user';
const PERMISSIONS_KEY = 'permissions';

export interface AuthContextValue {
  user: AuthUser | null;
  permissions: string[];
  isAuthenticated: boolean;
  login: (payload: LoginPayload) => Promise<void>;
  logout: () => void;
  can: (key: string) => boolean;
}

export const AuthContext = createContext<AuthContextValue | null>(null);

function readUser(): AuthUser | null {
  try {
    const raw = localStorage.getItem(USER_KEY);
    return raw ? (JSON.parse(raw) as AuthUser) : null;
  } catch {
    return null;
  }
}

/**
 * Provider session auth. Dipasang sebagai route element (punya akses router
 * untuk redirect logout) dan me-render `Outlet`.
 */
export function AuthProvider() {
  const navigate = useNavigate();
  const [user, setUser] = useState<AuthUser | null>(() =>
    localStorage.getItem(TOKEN_KEY) ? readUser() : null,
  );
  const [permissions, setPermissions] = useState<string[]>(() =>
    localStorage.getItem(TOKEN_KEY) ? getStoredPermissions() : [],
  );

  const login = useCallback(async (payload: LoginPayload) => {
    const result = await loginRequest(payload);
    localStorage.setItem(TOKEN_KEY, result.token);
    localStorage.setItem(USER_KEY, JSON.stringify(result.user));
    localStorage.setItem(PERMISSIONS_KEY, JSON.stringify(result.permissions));
    setUser(result.user);
    setPermissions(result.permissions);
  }, []);

  const logout = useCallback(() => {
    // Gagal request (mis. BE mati) tidak boleh menghalangi bersih sesi lokal.
    void logoutRequest()
      .catch(() => {})
      .finally(() => {
      localStorage.removeItem(TOKEN_KEY);
      localStorage.removeItem(USER_KEY);
      localStorage.removeItem(PERMISSIONS_KEY);
      setUser(null);
      setPermissions([]);
      navigate('/login', { replace: true });
    });
  }, [navigate]);

  const can = useCallback(
    (key: string) => hasPermissionKey(permissions, key),
    [permissions],
  );

  const value = useMemo<AuthContextValue>(
    () => ({ user, permissions, isAuthenticated: user !== null, login, logout, can }),
    [user, permissions, login, logout, can],
  );

  return (
    <AuthContext.Provider value={value}>
      <Outlet />
    </AuthContext.Provider>
  );
}
===
31:export const demoAccounts = mockUserRecords.map(
import type { AuthUser } from '../types';

export interface MockUserRecord extends AuthUser {
  password: string;
  /**
   * Permission list akun ini — dikembalikan di response login.
   * Boleh bentuk penuh (`user.view`) atau compact (`user:view,create`)
   * yang di-expand saat login via `normalizePermissions`.
   * Wildcard `'*'` = akses penuh.
   */
  permissions: string[];
  description: string;
}

/**
 * Config akun demo mock-only.
 * Dipakai mock login + daftar akun di halaman login.
 */
export const mockUserRecords: MockUserRecord[] = [
  {
    username: 'admin',
    password: 'admin123',
    name: 'Administrator',
    role: 'admin',
    permissions: ['*'],
    description: 'Akses penuh (wildcard)',
  },
];

/** Akun demo untuk ditampilkan di halaman login (mock only). */
export const demoAccounts = mockUserRecords.map(
  ({ username, password, role, description }) => ({ username, password, role, description }),
);

```

---

## Assistant (Build · Muse Spark 1.3 Free · 8.9s)

_Thinking:_

Restructuring auth API by splitting mock and service modules and mapping login response to LoginResult.

**Tool: bash**

**Input:**
```json
{
  "command": "grep -n \"login\\|catch\\|message\\|t(\" src/pages/LoginPage.tsx | head -20",
  "workdir": "/Users/nazmudinalkhamil/Documents/Projects/generator-module-app"
}
```

**Output:**
```
17:  const { isAuthenticated, permissions, login } = useAuth();
29:  async function handleSubmit(event: FormEvent): Promise<void> {
30:    event.preventDefault();
32:      setError(t('auth.usernameRequired'));
38:      await login({ username, password });
39:    } catch (err) {
40:      setError(err instanceof Error ? t(err.message) : t('auth.loginFailed'));
49:        <Card title={t('auth.loginTitle')}>
51:            {error && <Alert variant="error" message={error} />}
53:              <label className="mb-1 block text-sm font-medium text-foreground">{t('auth.username')}</label>
63:              <label className="mb-1 block text-sm font-medium text-foreground">{t('auth.password')}</label>
73:              {submitting ? t('auth.processing') : t('auth.login')}
77:        <Card title={t('auth.demoAccounts')}>
88:                  title={t('auth.demoHint')}

```

---

## Assistant (Build · Muse Spark 1.3 Free · 332.2s)

_Thinking:_

Standardizing service error throwing to a locale-key Error so LoginPage i18n displays it correctly for both mock and real paths.

**Tool: bash**

**Input:**
```json
{
  "command": "cat /Users/nazmudinalkhamil/Documents/Projects/boilerplate-fe/src/modules/auth/login/api/index.ts; echo '==='; head -20 /Users/nazmudinalkhamil/Documents/Projects/boilerplate-fe/src/modules/auth/login/api/mutations.ts 2>/dev/null; echo '==='; grep -rn \"from '../api'\\|from './api'\\|from '../../api'\" src/modules/auth --include='*.tsx' --include='*.ts' | head; echo '==='; grep -rn \"modules/auth\" src --include='*.tsx' --include='*.ts' -l | grep -v \"src/modules/auth/\" | head",
  "workdir": "/Users/nazmudinalkhamil/Documents/Projects/generator-module-app"
}
```

**Output:**
```
export { login, logout, refresh, verifyEmailToken } from './resolver';
export { useLoginMutation, useLogoutMutation } from './mutations';
export { useVerifyEmailTokenQuery } from './queries';
===
import { useMutation } from '@tanstack/react-query';
import { login, logout } from './resolver';
import type { LoginPayload, LoginResponse } from '../types';

export function useLoginMutation() {
  return useMutation<LoginResponse, unknown, LoginPayload>({
    mutationFn: (payload: LoginPayload) => login(payload),
  });
}

export function useLogoutMutation() {
  return useMutation<void, unknown, void>({
    mutationFn: () => logout(),
  });
}
===
src/modules/auth/components/AuthProvider.tsx:7:import { login as loginRequest, logout as logoutRequest } from '../api';
src/modules/auth/index.ts:4:export { demoAccounts } from './api';
===
src/app/ProtectedAppShell.tsx
src/app/router.tsx
src/modules/generator/templates/crud/pages.ts
src/pages/LoginPage.tsx

```

---

## Assistant (Build · Muse Spark 1.3 Free · 6.4s)

_Thinking:_



**Tool: todowrite**

**Input:**
```json
{
  "todos": [
    {
      "content": "Create auth/login/api: mock (+USE_MOCK), mockUsers, service, resolver, index",
      "status": "in_progress",
      "priority": "high"
    },
    {
      "content": "Delete old auth/api + update AuthProvider/auth index imports",
      "status": "pending",
      "priority": "high"
    },
    {
      "content": "Verify: lint + build + verify:generator",
      "status": "pending",
      "priority": "high"
    }
  ]
}
```

**Output:**
```
[
  {
    "content": "Create auth/login/api: mock (+USE_MOCK), mockUsers, service, resolver, index",
    "status": "in_progress",
    "priority": "high"
  },
  {
    "content": "Delete old auth/api + update AuthProvider/auth index imports",
    "status": "pending",
    "priority": "high"
  },
  {
    "content": "Verify: lint + build + verify:generator",
    "status": "pending",
    "priority": "high"
  }
]
```

---

## Assistant (Build · Muse Spark 1.3 Free · 4.0s)

**Tool: read**

**Input:**
```json
{
  "filePath": "/Users/nazmudinalkhamil/Documents/Projects/generator-module-app/src/modules/auth/api/mock.ts"
}
```

**Output:**
```
<path>/Users/nazmudinalkhamil/Documents/Projects/generator-module-app/src/modules/auth/api/mock.ts</path>
<type>file</type>
<content>
1: import type { LoginPayload, LoginResult } from '../types';
2: import { normalizePermissions } from '../../../shared/utils';
3: import { mockUserRecords } from './mockUsers';
4: 
5: /** Auth mock-only (tanpa BE): kredensial dicek terhadap `mockUserRecords`. */
6: function delay(ms: number): Promise<void> {
7:   return new Promise((resolve) => setTimeout(resolve, ms));
8: }
9: 
10: export async function mockLogin(payload: LoginPayload): Promise<LoginResult> {
11:   await delay(500);
12:   const record = mockUserRecords.find(
13:     (candidate) => candidate.username === payload.username.trim().toLowerCase(),
14:   );
15:   if (!record || record.password !== payload.password) {
16:     throw new Error('auth.invalidCredentials');
17:   }
18:   return {
19:     user: { username: record.username, name: record.name, role: record.role },
20:     token: `mock-token-${record.username}-${Date.now()}`,
21:     permissions: normalizePermissions(record.permissions),
22:   };
23: }
24: 
25: export async function mockLogout(): Promise<void> {
26:   await delay(200);
27: }

(End of file - total 27 lines)
</content>
```

---

## Assistant (Build · Muse Spark 1.3 Free · 5.6s)

**Tool: write**

**Input:**
```json
{
  "content": "import type { LoginPayload, LoginResult } from '../../types';\nimport { normalizePermissions } from '../../../../shared/utils';\nimport { mockUserRecords } from './mockUsers';\n\n/** Saklar sumber data auth: `true` = mock lokal tanpa backend. */\nexport const USE_MOCK = {\n  login: true,\n  logout: true,\n};\n\n/** Auth mock-only (tanpa BE): kredensial dicek terhadap `mockUserRecords`. */\nfunction delay(ms: number): Promise<void> {\n  return new Promise((resolve) => setTimeout(resolve, ms));\n}\n\nexport async function mockLogin(payload: LoginPayload): Promise<LoginResult> {\n  await delay(500);\n  const record = mockUserRecords.find(\n    (candidate) => candidate.username === payload.username.trim().toLowerCase(),\n  );\n  if (!record || record.password !== payload.password) {\n    throw new Error('auth.invalidCredentials');\n  }\n  return {\n    user: { username: record.username, name: record.name, role: record.role },\n    token: `mock-token-${record.username}-${Date.now()}`,\n    permissions: normalizePermissions(record.permissions),\n  };\n}\n\nexport async function mockLogout(): Promise<void> {\n  await delay(200);\n}\n",
  "filePath": "/Users/nazmudinalkhamil/Documents/Projects/generator-module-app/src/modules/auth/login/api/mock.ts"
}
```

**Output:**
```
Wrote file successfully.
```

---

## Assistant (Build · Muse Spark 1.3 Free · 8.5s)

**Tool: bash**

**Input:**
```json
{
  "command": "cp src/modules/auth/api/mockUsers.ts src/modules/auth/login/api/mockUsers.ts && echo copied",
  "workdir": "/Users/nazmudinalkhamil/Documents/Projects/generator-module-app"
}
```

**Output:**
```
copied

```

---

## Assistant (Build · Muse Spark 1.3 Free · 7.3s)

**Tool: bash**

**Input:**
```json
{
  "command": "head -3 src/modules/auth/login/api/mockUsers.ts",
  "workdir": "/Users/nazmudinalkhamil/Documents/Projects/generator-module-app"
}
```

**Output:**
```
import type { AuthUser } from '../types';

export interface MockUserRecord extends AuthUser {

```

---

## Assistant (Build · Muse Spark 1.3 Free · 4.3s)

**Tool: edit**

**Input:**
```json
{
  "filePath": "/Users/nazmudinalkhamil/Documents/Projects/generator-module-app/src/modules/auth/login/api/mockUsers.ts",
  "newString": "import type { AuthUser } from '../../types';",
  "oldString": "import type { AuthUser } from '../types';"
}
```

**Output:**
```
Edit applied successfully.
```

---

## Assistant (Build · Muse Spark 1.3 Free · 6.1s)

_Thinking:_



**Tool: write**

**Input:**
```json
{
  "content": "import api from '../../../../shared/lib/api';\nimport { isConnectionError, NETWORK_ERROR_MESSAGE } from '../../../../shared/utils';\nimport type { LoginPayload, LoginResult } from '../../types';\nimport type { ApiDetail, ApiResponse } from '../../../../shared/types';\n\nexport async function login(payload: LoginPayload): Promise<LoginResult> {\n  try {\n    const { data } = await api.post<ApiResponse<ApiDetail<LoginResult>>>(\n      '/api/v1/auth/login',\n      payload,\n    );\n    return data.response_output!.detail;\n  } catch (err) {\n    const message = (err as { response?: { data?: { response_schema?: { response_message?: string } } } })\n      ?.response?.data?.response_schema?.response_message;\n    throw new Error(\n      message ?? (isConnectionError(err) ? NETWORK_ERROR_MESSAGE : 'auth.loginFailed'),\n    );\n  }\n}\n\nexport async function logout(): Promise<void> {\n  await api.get<ApiResponse<null>>('/api/v1/auth/logout');\n}\n",
  "filePath": "/Users/nazmudinalkhamil/Documents/Projects/generator-module-app/src/modules/auth/login/api/service.ts"
}
```

**Output:**
```
Wrote file successfully.
```

---

## Assistant (Build · Muse Spark 1.3 Free · 4.4s)

**Tool: write**

**Input:**
```json
{
  "content": "import { USE_MOCK, mockLogin, mockLogout } from './mock';\nimport * as service from './service';\n\nexport const login = USE_MOCK.login ? mockLogin : service.login;\nexport const logout = USE_MOCK.logout ? mockLogout : service.logout;\n",
  "filePath": "/Users/nazmudinalkhamil/Documents/Projects/generator-module-app/src/modules/auth/login/api/resolver.ts"
}
```

**Output:**
```
Wrote file successfully.
```

---

## Assistant (Build · Muse Spark 1.3 Free · 3.6s)

**Tool: write**

**Input:**
```json
{
  "content": "export { login, logout } from './resolver';\nexport { demoAccounts } from './mockUsers';\n",
  "filePath": "/Users/nazmudinalkhamil/Documents/Projects/generator-module-app/src/modules/auth/login/api/index.ts"
}
```

**Output:**
```
Wrote file successfully.
```

---

## Assistant (Build · Muse Spark 1.3 Free · 4.9s)

_Thinking:_



**Tool: bash**

**Input:**
```json
{
  "command": "rm -rf src/modules/auth/api && echo \"old api deleted\" && grep -rn \"from '../api'\\|from './api'\" src/modules/auth --include='*.tsx' --include='*.ts' | head -5",
  "workdir": "/Users/nazmudinalkhamil/Documents/Projects/generator-module-app"
}
```

**Output:**
```
old api deleted
src/modules/auth/components/AuthProvider.tsx:7:import { login as loginRequest, logout as logoutRequest } from '../api';
src/modules/auth/index.ts:4:export { demoAccounts } from './api';

```

---

## Assistant (Build · Muse Spark 1.3 Free · 6.5s)

**Tool: edit**

**Input:**
```json
{
  "filePath": "/Users/nazmudinalkhamil/Documents/Projects/generator-module-app/src/modules/auth/components/AuthProvider.tsx",
  "newString": "import { login as loginRequest, logout as logoutRequest } from '../login/api';",
  "oldString": "import { login as loginRequest, logout as logoutRequest } from '../api';"
}
```

**Output:**
```
Edit applied successfully.
```

**Tool: edit**

**Input:**
```json
{
  "filePath": "/Users/nazmudinalkhamil/Documents/Projects/generator-module-app/src/modules/auth/index.ts",
  "newString": "export { demoAccounts } from './login/api';",
  "oldString": "export { demoAccounts } from './api';"
}
```

**Output:**
```
Edit applied successfully.
```

---

## Assistant (Build · Muse Spark 1.3 Free · 18.7s)

**Tool: bash**

**Input:**
```json
{
  "command": "npm run lint > /tmp/lint.log 2>&1; echo \"lint=$?\"; tail -3 /tmp/lint.log; npm run build > /tmp/build.log 2>&1; echo \"build=$?\"; grep -E \"error TS|built in\" /tmp/build.log | head -5",
  "workdir": "/Users/nazmudinalkhamil/Documents/Projects/generator-module-app"
}
```

**Output:**
```
lint=1
> oxlint src vite.config.ts

src/modules/master-data/company/components/CompanyTable.tsx:59:30: error: Unexpected token
build=2
src/modules/master-data/company/components/CompanyTable.tsx(59,30): error TS1136: Property assignment expected.
src/modules/master-data/company/components/CompanyTable.tsx(59,37): error TS1005: ',' expected.
src/modules/master-data/company/components/CompanyTable.tsx(60,7): error TS1005: ',' expected.
src/modules/master-data/company/components/CompanyTable.tsx(60,13): error TS1005: ',' expected.
src/modules/master-data/company/components/CompanyTable.tsx(61,5): error TS1137: Expression or comma expected.

```

---

## Assistant (Build · Muse Spark 1.3 Free · 5.0s)

_Thinking:_



**Tool: bash**

**Input:**
```json
{
  "command": "git status --short | grep -v \"^ M\" | head -10; echo '==='; ls src/modules/; echo '==='; sed -n '50,65p' src/modules/master-data/company/components/CompanyTable.tsx",
  "workdir": "/Users/nazmudinalkhamil/Documents/Projects/generator-module-app"
}
```

**Output:**
```
 D src/modules/auth/api/index.ts
 D src/modules/auth/api/mock.ts
 D src/modules/auth/api/mockUsers.ts
 D src/pages/components/IconsPage.tsx
 D src/shared/components/icons/CalendarIcon.tsx
 D src/shared/components/icons/ChevronDownIcon.tsx
 D src/shared/components/icons/ChevronLeftIcon.tsx
 D src/shared/components/icons/ChevronRightIcon.tsx
 D src/shared/components/icons/ChevronSingleLeftIcon.tsx
 D src/shared/components/icons/ChevronSingleRightIcon.tsx
===
auth
generator
master-data
===
  isFilteredEmptyState,
  ...rest
}: Props) {
  const columns = [
    { key: 'name', header: 'Name', sortable: true, width: 256 },
    { key: 'description', header: 'Description', width: 207 },
    { key: 'created_by', header: 'Created By', width: 186 },
    {
      key: 'created_date',
      header: 'Created Date',, width: 199
      render: (row: CompanyListItem) => formatDateTime(row.created_date),
    },
    {
      key: 'status',
      header: 'Status',
      sortable: false,, width: 198

```

---

## Assistant (Build · Muse Spark 1.3 Free · 8.4s)

_Thinking:_

Fixing a template bug by adjusting widthOf to avoid double commas and ensure proper comma placement.

_Thinking:_



**Tool: bash**

**Input:**
```json
{
  "command": "grep -n \"widthOf\" src/modules/generator/templates/crud/components.ts | head -8",
  "workdir": "/Users/nazmudinalkhamil/Documents/Projects/generator-module-app"
}
```

**Output:**
```
59:  const widthOf = (name: string): string =>
101:    { key: 'created_by', header: 'Created By'${widthOf('created_by')} },
104:      header: 'Created Date',${widthOf('created_date')}
110:      sortable: false,${widthOf('status')}

```

---

## Assistant (Build · Muse Spark 1.3 Free · 6.0s)

**Tool: edit**

**Input:**
```json
{
  "filePath": "/Users/nazmudinalkhamil/Documents/Projects/generator-module-app/src/modules/generator/templates/crud/components.ts",
  "newString": "      header: 'Created Date'${widthOf('created_date')},",
  "oldString": "      header: 'Created Date',${widthOf('created_date')}"
}
```

**Output:**
```
Edit applied successfully.
```

**Tool: edit**

**Input:**
```json
{
  "filePath": "/Users/nazmudinalkhamil/Documents/Projects/generator-module-app/src/modules/generator/templates/crud/components.ts",
  "newString": "      sortable: false${widthOf('status')},",
  "oldString": "      sortable: false,${widthOf('status')}"
}
```

**Output:**
```
Edit applied successfully.
```

---

## Assistant (Build · Muse Spark 1.3 Free · 8.0s)

_Thinking:_



**Tool: bash**

**Input:**
```json
{
  "command": "grep -rn \"shared/components/icons\\|Meng\\|Gagal\\|Tutup\\|Mengekspor\\|FORCE_REAL_API\\|USE_MOCK\\|from './service'\\|lucide\" src/modules/master-data/ 2>/dev/null | head -12; echo '==='; ls -R src/modules/master-data/ | head -25",
  "workdir": "/Users/nazmudinalkhamil/Documents/Projects/generator-module-app"
}
```

**Output:**
```
src/modules/master-data/company/INTEGRATION.md:91:Saklar sumber data ada di `api/resolver.ts` via flag `USE_MOCK` (di `mock.ts`,
src/modules/master-data/company/INTEGRATION.md:119:Mock aktif secara default (`USE_MOCK` semua `true` di `api/mock.ts`).
src/modules/master-data/company/components/CompanyTable.tsx:8:} from 'lucide-react';
src/modules/master-data/company/api/mock.ts:18:export const USE_MOCK = {
src/modules/master-data/company/api/resolver.ts:2:  USE_MOCK,
src/modules/master-data/company/api/resolver.ts:13:import * as service from './service';
src/modules/master-data/company/api/resolver.ts:15:export const getCompanies = USE_MOCK.list ? mockGetCompanies : service.getCompanies;
src/modules/master-data/company/api/resolver.ts:16:export const getCompanyById = USE_MOCK.detail ? mockGetCompanyById : service.getCompanyById;
src/modules/master-data/company/api/resolver.ts:17:export const createCompany = USE_MOCK.create ? mockCreateCompany : service.createCompany;
src/modules/master-data/company/api/resolver.ts:18:export const updateCompany = USE_MOCK.update ? mockUpdateCompany : service.updateCompany;
src/modules/master-data/company/api/resolver.ts:19:export const deleteCompany = USE_MOCK.delete ? mockDeleteCompany : service.deleteCompany;
src/modules/master-data/company/api/resolver.ts:20:export const restoreCompany = USE_MOCK.restore ? mockRestoreCompany : service.restoreCompany;
===
company

src/modules/master-data/company:
api
components
hooks
index.ts
INTEGRATION.md
pages
permissions.ts
types
validation

src/modules/master-data/company/api:
index.ts
mock.ts
mutations.ts
queries.ts
resolver.ts
service.ts

src/modules/master-data/company/components:
CompanyBulkUploadDialog.tsx
CompanyForm.tsx
CompanyTable.tsx

```

---

## Assistant (Build · Muse Spark 1.3 Free · 6.2s)

_Thinking:_



_Thinking:_



**Tool: bash**

**Input:**
```json
{
  "command": "grep -n \",,\" src/modules/master-data/company/components/CompanyTable.tsx",
  "workdir": "/Users/nazmudinalkhamil/Documents/Projects/generator-module-app"
}
```

**Output:**
```
59:      header: 'Created Date',, width: 199
65:      sortable: false,, width: 198

```

---

## Assistant (Build · Muse Spark 1.3 Free · 3.5s)

**Tool: edit**

**Input:**
```json
{
  "filePath": "/Users/nazmudinalkhamil/Documents/Projects/generator-module-app/src/modules/master-data/company/components/CompanyTable.tsx",
  "newString": "      header: 'Created Date', width: 199",
  "oldString": "      header: 'Created Date',, width: 199"
}
```

**Output:**
```
Edit applied successfully.
```

**Tool: edit**

**Input:**
```json
{
  "filePath": "/Users/nazmudinalkhamil/Documents/Projects/generator-module-app/src/modules/master-data/company/components/CompanyTable.tsx",
  "newString": "      sortable: false, width: 198",
  "oldString": "      sortable: false,, width: 198"
}
```

**Output:**
```
Edit applied successfully.
```

---

## Assistant (Build · Muse Spark 1.3 Free · 7.0s)

**Tool: bash**

**Input:**
```json
{
  "command": "npm run lint > /tmp/lint.log 2>&1; echo \"lint=$?\"; grep -E \"error\" /tmp/lint.log | head -3; npm run build > /tmp/build.log 2>&1; echo \"build=$?\"; grep -E \"error TS|built in\" /tmp/build.log | head -5",
  "workdir": "/Users/nazmudinalkhamil/Documents/Projects/generator-module-app"
}
```

**Output:**
```
lint=1
src/modules/master-data/company/components/CompanyTable.tsx:60:7: error: Expected `,` or `}` but found `Identifier`
build=2
src/modules/master-data/company/components/CompanyTable.tsx(60,7): error TS1005: ',' expected.
src/modules/master-data/company/components/CompanyTable.tsx(66,7): error TS1005: ',' expected.

```

---

## Assistant (Build · Muse Spark 1.3 Free · 3.6s)

**Tool: read**

**Input:**
```json
{
  "filePath": "/Users/nazmudinalkhamil/Documents/Projects/generator-module-app/src/modules/master-data/company/components/CompanyTable.tsx",
  "limit": 25,
  "offset": 50
}
```

**Output:**
```
<path>/Users/nazmudinalkhamil/Documents/Projects/generator-module-app/src/modules/master-data/company/components/CompanyTable.tsx</path>
<type>file</type>
<content>
50:   isFilteredEmptyState,
51:   ...rest
52: }: Props) {
53:   const columns = [
54:     { key: 'name', header: 'Name', sortable: true, width: 256 },
55:     { key: 'description', header: 'Description', width: 207 },
56:     { key: 'created_by', header: 'Created By', width: 186 },
57:     {
58:       key: 'created_date',
59:       header: 'Created Date', width: 199
60:       render: (row: CompanyListItem) => formatDateTime(row.created_date),
61:     },
62:     {
63:       key: 'status',
64:       header: 'Status',
65:       sortable: false, width: 198
66:       className: 'w-32',
67:       render: (row: CompanyListItem) => (
68:         <Badge variant={row.status === 'active' ? 'success' : 'secondary'}>
69:           {capitalize(row.status)}
70:         </Badge>
71:       ),
72:     },
73:   ];
74: 

(Showing lines 50-74 of 138. Use offset=75 to continue.)
</content>
```

---

## Assistant (Build · Muse Spark 1.3 Free · 6.8s)

_Thinking:_

Adjusting template comma placement so widthOf emits a trailing comma and callers omit their own comma.

**Tool: read**

**Input:**
```json
{
  "filePath": "/Users/nazmudinalkhamil/Documents/Projects/generator-module-app/src/modules/generator/templates/crud/components.ts",
  "limit": 14,
  "offset": 56
}
```

**Output:**
```
<path>/Users/nazmudinalkhamil/Documents/Projects/generator-module-app/src/modules/generator/templates/crud/components.ts</path>
<type>file</type>
<content>
56: 
57:   const hasArrayColumns = fields.some((f) => f.config.type === 'formArrayField');
58:   const tableWidths = ctx.config.tableWidths ?? {};
59:   const widthOf = (name: string): string =>
60:     tableWidths[name] !== undefined ? `, width: ${tableWidths[name]}` : '';
61:   const columns = fields
62:     .map((f) => `    ${tableColumnSnippet(f, tableWidths[f.name]).replace(/ROWTYPE/g, names.listItem)}`)
63:     .join('\n');
64: 
65:   return `${hasArrayColumns ? `import { t } from 'i18next';\nimport '${names.sharedPrefix}shared/i18n';\n` : ''}import type { ${names.listItem} } from '../types';
66: import { Table, Badge } from '${names.sharedPrefix}shared/components/ui';
67: ${iconImports.length > 0 ? `import {\n  ${iconImports.join(',\n  ')},\n} from 'lucide-react';\n` : ''}import { ${utilImports.join(', ')} } from '${names.sharedPrefix}shared/utils';
68: 
69: interface Props {

(Showing lines 56-69 of 495. Use offset=70 to continue.)
</content>
```

---

## Assistant (Build · Muse Spark 1.3 Free · 4.5s)

**Tool: edit**

**Input:**
```json
{
  "filePath": "/Users/nazmudinalkhamil/Documents/Projects/generator-module-app/src/modules/generator/templates/crud/components.ts",
  "newString": "  const widthOf = (name: string): string =>\n    tableWidths[name] !== undefined ? `, width: ${tableWidths[name]}` : '';\n  const widthLine = (name: string): string =>\n    tableWidths[name] !== undefined ? `\\n      width: ${tableWidths[name]},` : '';",
  "oldString": "  const widthOf = (name: string): string =>\n    tableWidths[name] !== undefined ? `, width: ${tableWidths[name]}` : '';"
}
```

**Output:**
```
Edit applied successfully.
```

---

## Assistant (Build · Muse Spark 1.3 Free · 5.2s)

**Tool: edit**

**Input:**
```json
{
  "filePath": "/Users/nazmudinalkhamil/Documents/Projects/generator-module-app/src/modules/generator/templates/crud/components.ts",
  "newString": "      header: 'Created Date',${widthLine('created_date')}",
  "oldString": "      header: 'Created Date'${widthOf('created_date')},"
}
```

**Output:**
```
Edit applied successfully.
```

**Tool: edit**

**Input:**
```json
{
  "filePath": "/Users/nazmudinalkhamil/Documents/Projects/generator-module-app/src/modules/generator/templates/crud/components.ts",
  "newString": "      sortable: false,${widthLine('status')}",
  "oldString": "      sortable: false${widthOf('status')},"
}
```

**Output:**
```
Edit applied successfully.
```

---

## Assistant (Build · Muse Spark 1.3 Free · 5.5s)

**Tool: edit**

**Input:**
```json
{
  "filePath": "/Users/nazmudinalkhamil/Documents/Projects/generator-module-app/src/modules/master-data/company/components/CompanyTable.tsx",
  "newString": "      header: 'Created Date',\n      width: 199,\n      render: (row: CompanyListItem) => formatDateTime(row.created_date),",
  "oldString": "      header: 'Created Date', width: 199\n      render: (row: CompanyListItem) => formatDateTime(row.created_date),"
}
```

**Output:**
```
Edit applied successfully.
```

**Tool: edit**

**Input:**
```json
{
  "filePath": "/Users/nazmudinalkhamil/Documents/Projects/generator-module-app/src/modules/master-data/company/components/CompanyTable.tsx",
  "newString": "      sortable: false,\n      width: 198,\n      className: 'w-32',",
  "oldString": "      sortable: false, width: 198\n      className: 'w-32',"
}
```

**Output:**
```
Edit applied successfully.
```

---

## Assistant (Build · Muse Spark 1.3 Free · 19.9s)

**Tool: bash**

**Input:**
```json
{
  "command": "npm run lint > /tmp/lint.log 2>&1; echo \"lint=$?\"; grep -E \"error\" /tmp/lint.log | head -3; npm run build > /tmp/build.log 2>&1; echo \"build=$?\"; grep -E \"error TS|built in\" /tmp/build.log | head -5; npm run verify:generator > /tmp/verify.log 2>&1; echo \"verify=$?\"; grep -E \"PASS|FAIL\" /tmp/verify.log",
  "workdir": "/Users/nazmudinalkhamil/Documents/Projects/generator-module-app"
}
```

**Output:**
```
lint=0
build=2
src/app/navigation.tsx(34,12): error TS2304: Cannot find name 'NavMasterDataIcon'.
verify=1
EMISSION PASS
COMPILE FAIL: tsc error pada kode hasil generate.

```

---

## Assistant (Build · Muse Spark 1.3 Free · 4.3s)

_Thinking:_



**Tool: bash**

**Input:**
```json
{
  "command": "grep -n \"NavMasterDataIcon\\|NavDashboardIcon\\|NavSettingsIcon\" src/app/navigation.tsx; echo '==='; grep -E \"FAIL|error TS\" /tmp/verify.log | head -5",
  "workdir": "/Users/nazmudinalkhamil/Documents/Projects/generator-module-app"
}
```

**Output:**
```
34:    icon: <NavMasterDataIcon className="h-5 w-5" />,
===
COMPILE FAIL: tsc error pada kode hasil generate.
src/app/navigation.tsx(34,12): error TS2304: Cannot find name 'NavMasterDataIcon'.

```

---

## Assistant (Build · Muse Spark 1.3 Free · 4.9s)

_Thinking:_



**Tool: bash**

**Input:**
```json
{
  "command": "sed -n '28,36p' src/app/navigation.tsx",
  "workdir": "/Users/nazmudinalkhamil/Documents/Projects/generator-module-app"
}
```

**Output:**
```
      { label: 'UI', labelKey: 'nav.ui', path: '/components/ui' },
    ],
  },
  // __GENERATOR_PARENT master-data__
  {
    label: 'Master Data',
    icon: <NavMasterDataIcon className="h-5 w-5" />,
    children: [
      { label: 'Companies', path: '/master-data/companies', permissionKey: 'company.view' },

```

---

## Assistant (Build · Muse Spark 1.3 Free · 3.6s)

_Thinking:_



**Tool: edit**

**Input:**
```json
{
  "filePath": "/Users/nazmudinalkhamil/Documents/Projects/generator-module-app/src/app/navigation.tsx",
  "newString": "    icon: <Database className=\"h-5 w-5\" />,",
  "oldString": "    icon: <NavMasterDataIcon className=\"h-5 w-5\" />,"
}
```

**Output:**
```
Edit applied successfully.
```

---

## Assistant (Build · Muse Spark 1.3 Free · 16.7s)

**Tool: bash**

**Input:**
```json
{
  "command": "npm run build > /tmp/build.log 2>&1; echo \"build=$?\"; grep -E \"error TS|built in\" /tmp/build.log | head -5; npm run verify:generator > /tmp/verify.log 2>&1; echo \"verify=$?\"; grep -E \"PASS|FAIL\" /tmp/verify.log",
  "workdir": "/Users/nazmudinalkhamil/Documents/Projects/generator-module-app"
}
```

**Output:**
```
build=0
✓ built in 669ms
verify=0
EMISSION PASS
COMPILE PASS (25 file)

```

---

## Assistant (Build · Muse Spark 1.3 Free · 4.6s)

_Thinking:_



_Thinking:_



**Tool: bash**

**Input:**
```json
{
  "command": "grep -n \"Icon\" src/modules/generator/engine/registration.ts | head -8",
  "workdir": "/Users/nazmudinalkhamil/Documents/Projects/generator-module-app"
}
```

**Output:**
```
97:    `    icon: <NavMasterDataIcon className="h-5 w-5" />,\n` +
107:      `    icon: <NavMasterDataIcon className="h-5 w-5" />,\n` +

```

---

## Assistant (Build · Muse Spark 1.3 Free · 3.6s)

**Tool: bash**

**Input:**
```json
{
  "command": "sed -n '80,120p' src/modules/generator/engine/registration.ts",
  "workdir": "/Users/nazmudinalkhamil/Documents/Projects/generator-module-app"
}
```

**Output:**
```
      path: p.route,
      code:
        `      {\n` +
        `        path: '${p.route}',\n` +
        `        element: <${p.page} />,\n` +
        `        handle: {\n` +
        `          breadcrumb: ${breadcrumb},\n` +
        `          requiredPermission: '${p.permission}',\n` +
        `        },\n` +
        `      },`,
    };
  });

  const flatItemCode =
    `  {\n` +
    `    label: '${label}',\n` +
    `    path: '${listPath}',\n` +
    `    icon: <NavMasterDataIcon className="h-5 w-5" />,\n` +
    `    permissionKey: '${permissions.view}',\n` +
    `  },`;
  const childItemCode =
    `      { label: '${label}', path: '${listPath}', permissionKey: '${permissions.view}' },`;
  const navItemCode = parentPath ? childItemCode : flatItemCode;
  const navSnippet = parentPath
    ? `  // __GENERATOR_PARENT ${parentPath}__\n` +
      `  {\n` +
      `    label: '${parentLabel}',\n` +
      `    icon: <NavMasterDataIcon className="h-5 w-5" />,\n` +
      `    children: [\n` +
      `${childItemCode}\n` +
      `    ],\n` +
      `  },`
    : flatItemCode;

  return {
    moduleImportPath,
    importBlock,
    routes,
    navPath: listPath,
    navItemCode,
    navSnippet,

```

---

## Assistant (Build · Muse Spark 1.3 Free · 4.8s)

**Tool: bash**

**Input:**
```json
{
  "command": "cd /Users/nazmudinalkhamil/Documents/Projects/generator-module-app && python3 -c \"\ns = open('src/modules/generator/engine/registration.ts').read()\no = 'icon: <NavMasterDataIcon className=\\\"h-5 w-5\\\" />'\nassert s.count(o) == 2, s.count(o)\ns = s.replace(o, 'icon: <Database className=\\\"h-5 w-5\\\" />')\nopen('src/modules/generator/engine/registration.ts', 'w').write(s)\nprint('registration icons fixed')\n\" && grep -rn \"NavMasterDataIcon\\|NavDashboardIcon\\|NavSettingsIcon\\|components/icons\" src vite.config.ts --include='*.ts' --include='*.tsx' | grep -v \"SvgIcon\\|data-icon-name\" | head -5; echo \"--- stale icon refs check done ---\""
}
```

**Output:**
```
registration icons fixed
--- stale icon refs check done ---

```

---

## Assistant (Build · Muse Spark 1.3 Free · 19.2s)

_Thinking:_



**Tool: bash**

**Input:**
```json
{
  "command": "grep -rn \"IconsPage\\|nav\\.icons\\|components/icons\" src scripts --include='*.ts' --include='*.tsx' --include='*.mjs' | head -5; echo \"--- clean ---\"; npm run lint > /tmp/lint.log 2>&1; echo \"lint=$?\"; npm run build > /tmp/build.log 2>&1; echo \"build=$?\"; npm run verify:generator > /tmp/verify.log 2>&1; echo \"verify=$?\"; grep -E \"PASS|FAIL|built in\" /tmp/verify.log /tmp/build.log",
  "workdir": "/Users/nazmudinalkhamil/Documents/Projects/generator-module-app"
}
```

**Output:**
```
--- clean ---
lint=0
build=0
verify=0
/tmp/verify.log:EMISSION PASS
/tmp/verify.log:COMPILE PASS (25 file)
/tmp/build.log:✓ built in 648ms

```

---

## Assistant (Build · Muse Spark 1.3 Free · 6.3s)

**Tool: todowrite**

**Input:**
```json
{
  "todos": [
    {
      "content": "Create auth/login/api: mock (+USE_MOCK), mockUsers, service, resolver, index",
      "status": "completed",
      "priority": "high"
    },
    {
      "content": "Delete old auth/api + update AuthProvider/auth index imports",
      "status": "completed",
      "priority": "high"
    },
    {
      "content": "Verify: lint + build + verify:generator",
      "status": "completed",
      "priority": "high"
    }
  ]
}
```

**Output:**
```
[
  {
    "content": "Create auth/login/api: mock (+USE_MOCK), mockUsers, service, resolver, index",
    "status": "completed",
    "priority": "high"
  },
  {
    "content": "Delete old auth/api + update AuthProvider/auth index imports",
    "status": "completed",
    "priority": "high"
  },
  {
    "content": "Verify: lint + build + verify:generator",
    "status": "completed",
    "priority": "high"
  }
]
```

---

## Assistant (Build · Muse Spark 1.3 Free · 5.9s)

Selesai. Auth sekarang mengikuti konsep **Service / Mock Service / Service Mock Resolver** yang sama persis dengan `boilerplate_fe`. Semua hijau: `lint`, `build`, `verify:generator` (25 file).

**Struktur baru** (`src/modules/auth/login/api/`, mirror `boilerplate_fe/src/modules/auth/login/api/`):
- `mock.ts` — `mockLogin`/`mockLogout` (pindahan dari `auth/api/`, logika tak berubah) + `USE_MOCK = { login: true, logout: true }`.
- `mockUsers.ts` — pindahan akun demo (import types disesuaikan).
- `service.ts` — Real API via axios `shared/lib/api`: `POST /api/v1/auth/login` → unwrap `response_output.detail` sebagai `LoginResult`; error server dibungkus `Error(message)` agar cocok dengan `LoginPage` (`t(err.message)`, fallback `auth.loginFailed`); `GET /api/v1/auth/logout`.
- `resolver.ts` — `export const login = USE_MOCK.login ? mockLogin : service.login;` (sama untuk logout), persis gaya boilerplate.
- `index.ts` — `export { login, logout } from './resolver'; export { demoAccounts } from './mockUsers';`
- `auth/api/` lama dihapus; `AuthProvider` dan `auth/index.ts` dialihkan ke `../login/api`.

**Bonus fix dari temuan sepanjang jalan:** modul `master-data/company` (hasil Generate Anda, untracked) mem-bypass bug koma ganda dari template widths (`header: 'Created Date',, width`) — template diperbaiki (helper `widthLine` terpisah untuk kolom multiline) dan file Anda dikoreksi di tempat. Juga registrasi otomatis dev-server (`registration.ts`) yang masih meng-emit `NavMasterDataIcon` diganti ke `Database` (lucide).

Deviasi yang disengaja vs boilerplate: `USE_MOCK` default `true` (app ini mock-only), tanpa `mutations.ts`/`queries.ts` di auth karena `AuthProvider` memanggil resolver langsung (bentuk pemakaian yang sudah ada dipertahankan).

---

## User

ok tapi tapi ini auth login masih belum sama harusnya folder auth itu hanya folder login adalah modulenya jadi folder auth cukup ada folder login doang makanya saya ikut konsep yg ada di boilerplate_fe

---

## Assistant (Build · Muse Spark 1.3 Free · 5.6s)

_Thinking:_



_Thinking:_



**Tool: bash**

**Input:**
```json
{
  "command": "ls /Users/nazmudinalkhamil/Documents/Projects/boilerplate-fe/src/modules/auth/; echo '==='; find /Users/nazmudinalkhamil/Documents/Projects/boilerplate-fe/src -name \"AuthProvider*\" -o -name \"useAuth*\" -o -name \"RequireAuth*\" -o -name \"PermissionGate*\" | head -8; echo '==='; ls /Users/nazmudinalkhamil/Documents/Projects/boilerplate-fe/src/modules/auth/login/"
}
```

**Output:**
```
create-password
forgot-password
login
===
/Users/nazmudinalkhamil/Documents/Projects/boilerplate-fe/src/app/providers/useAuth.ts
/Users/nazmudinalkhamil/Documents/Projects/boilerplate-fe/src/app/providers/AuthProvider.tsx
===
api
components
hooks
index.ts
pages
types

```

---

## Assistant (Build · Muse Spark 1.3 Free · 80.5s)

_Thinking:_

Evaluating a narrower folder restructure to keep only login in src/modules/auth and move shared auth code to src/app/providers.

**Tool: bash**

**Input:**
```json
{
  "command": "grep -rn \"modules/auth\" src --include='*.tsx' --include='*.ts' | grep -v \"^src/modules/auth/\" | head -20; echo '==='; cat /Users/nazmudinalkhamil/Documents/Projects/boilerplate-fe/src/app/providers/useAuth.ts 2>/dev/null | head -20; ls /Users/nazmudinalkhamil/Documents/Projects/boilerplate-fe/src/app/providers/ 2>/dev/null",
  "workdir": "/Users/nazmudinalkhamil/Documents/Projects/generator-module-app"
}
```

**Output:**
```
src/app/ProtectedAppShell.tsx:3:import { RequireAuth, useAuth } from '../modules/auth';
src/app/router.tsx:3:import { AuthProvider, PermissionGate } from '../modules/auth';
src/modules/generator/templates/crud/pages.ts:27:${needAuth ? `import { useAuth } from '${names.sharedPrefix}modules/auth';\n` : ''}import { use${names.entity}List, use${names.entity}ListFilter${withExport ? `, use${names.entity}Export` : ''} } from '../hooks';
src/modules/generator/templates/crud/pages.ts:238:${features.edit ? `import { useAuth } from '${names.sharedPrefix}modules/auth';\n` : ''}import { use${names.entity}Form } from '../hooks';
src/modules/master-data/company/pages/CompanyListPage.tsx:7:import { useAuth } from '../../../../modules/auth';
src/modules/master-data/company/pages/CompanyViewPage.tsx:4:import { useAuth } from '../../../../modules/auth';
src/pages/LoginPage.tsx:13:import { demoAccounts, useAuth } from '../modules/auth';
===
import { useContext } from 'react';
import { AuthContext } from './auth-context';
import type { AuthContextType } from './auth-context';

export function useAuth(): AuthContextType {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
auth-context.ts
AuthProvider.tsx
index.ts
useAuth.ts

```

---

## Assistant (Build · Muse Spark 1.3 Free · 28.3s)

---

