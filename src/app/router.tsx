import { createBrowserRouter } from "react-router";
import { ErrorStatePage } from "../shared/components/ui";
import { AuthProvider, PermissionGate } from "./providers";
import ProtectedAppShell from "./ProtectedAppShell";
import { loginRoutes } from "../modules/auth/login/routes";
import { DynamicModuleRoutes } from "../modules/generator/runtime/DynamicRoutes";
import { dashboardRoutes } from "../modules/dashboard/routes";
import { generatorRoutes } from "../modules/generator/routes";
import { showcaseRoutes } from "../modules/showcase/routes";
import { userRoutes } from '../modules/user-management/user/routes';
import { roleRoutes } from '../modules/user-management/role/routes';
import { settingsRoutes } from '../modules/settings/routes';
// __GENERATOR_IMPORTS__

export const router = createBrowserRouter([
  {
    element: <AuthProvider />,
    children: [
      {
        element: <ProtectedAppShell />,
        children: [
          {
            element: <PermissionGate />,
            children: [
              // Routes tiap modul hidup di `routes.tsx` modulnya (di atas host
              // dinamis agar menang). Modul dinamis murni tetap lewat
              // definisi published tanpa route statis.
              ...dashboardRoutes,
              ...generatorRoutes,
              ...showcaseRoutes,
              ...userRoutes,
              ...roleRoutes,
              ...settingsRoutes,
              // __GENERATOR_ROUTES__
              // Host WAJIB `path: '*'`: pathless tidak match URL dinamis
              // (sisa pathname tak terkonsumsi → jatuh ke 404).
              {
                path: "not-found",
                element: <ErrorStatePage type="404" />,
                handle: { notFound: true },
              },
              { path: "*", element: <DynamicModuleRoutes /> },
            ],
          },
        ],
      },
      ...loginRoutes,
    ],
  },
]);
