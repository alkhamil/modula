import { createBrowserRouter } from "react-router";
import { ErrorStatePage } from "../shared/components/ui";
import { AuthProvider, PermissionGate } from "./providers";
import ProtectedAppShell from "./ProtectedAppShell";
import { DashboardPage } from "../modules/dashboard";
import { TypographyPage, ColorsPage, UiPage } from "../modules/showcase";
import { LoginPage } from "../modules/auth/login";
import { GeneratorPage } from "../modules/generator";
import {
  DynamicModuleRoutes,
  DynamicPreviewCreatePage,
  DynamicPreviewDetailPage,
  DynamicPreviewEditPage,
  DynamicPreviewPage,
} from "../modules/generator/runtime/DynamicRoutes";
import {
  UserListPage,
  UserCreatePage,
  UserViewPage,
  UserEditPage,
} from "../modules/user-management/user";
import {
  RoleListPage,
  RoleCreatePage,
  RoleViewPage,
  RoleEditPage,
} from "../modules/user-management/role";
import { SettingsPage } from "../modules/settings";
import {
  RegionListPage,
  RegionCreatePage,
  RegionViewPage,
  RegionEditPage,
} from '../modules/master-data/region';
import {
  VendorListPage,
  VendorCreatePage,
  VendorViewPage,
  VendorEditPage,
} from '../modules/master-data/vendor';
import {
  CategoryListPage,
  CategoryCreatePage,
  CategoryViewPage,
  CategoryEditPage,
} from '../modules/master-data/category';
import {
  ProductListPage,
  ProductCreatePage,
  ProductViewPage,
  ProductEditPage,
} from '../modules/master-data/product';
import {
  PriceListPage,
  PriceCreatePage,
  PriceViewPage,
  PriceEditPage,
} from '../modules/master-data/price';
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
              { index: true, element: <DashboardPage /> },
              {
                path: "components/typography",
                element: <TypographyPage />,
                handle: {
                  breadcrumb: [
                    { label: "Component", labelKey: "nav.components" },
                    { label: "Typography", labelKey: "nav.typography" },
                  ],
                },
              },
              {
                path: "components/colors",
                element: <ColorsPage />,
                handle: {
                  breadcrumb: [
                    { label: "Component", labelKey: "nav.components" },
                    { label: "Colors", labelKey: "nav.colors" },
                  ],
                },
              },
              {
                path: "components/ui",
                element: <UiPage />,
                handle: {
                  breadcrumb: [
                    { label: "Component", labelKey: "nav.components" },
                    { label: "UI", labelKey: "nav.ui" },
                  ],
                },
              },
              {
                path: "generator",
                element: <GeneratorPage />,
                handle: {
                  breadcrumb: [
                    { label: "Generator", labelKey: "nav.generator" },
                  ],
                },
              },
              {
                path: "preview/:definitionKey",
                element: <DynamicPreviewPage />,
                handle: {
                  breadcrumb: [
                    { label: "Preview", labelKey: "common.preview" },
                  ],
                },
              },
              {
                path: "preview/:definitionKey/create",
                element: <DynamicPreviewCreatePage />,
                handle: {
                  breadcrumb: [
                    { label: "Preview", labelKey: "common.preview" },
                    { label: "Create", labelKey: "common.create" },
                  ],
                },
              },
              {
                path: "preview/:definitionKey/:recordId/view",
                element: <DynamicPreviewDetailPage />,
                handle: {
                  breadcrumb: [
                    { label: "Preview", labelKey: "common.preview" },
                    { label: "Detail", labelKey: "common.detail" },
                  ],
                },
              },
              {
                path: "preview/:definitionKey/:recordId/edit",
                element: <DynamicPreviewEditPage />,
                handle: {
                  breadcrumb: [
                    { label: "Preview", labelKey: "common.preview" },
                    { label: "Edit", labelKey: "common.edit" },
                  ],
                },
              },
              // Modul hasil generate-ke-repo terdaftar statis di sini (di atas
              // host dinamis agar menang). Modul dinamis murni tetap lewat
              // definisi published tanpa route statis.
              {
                path: "user-management/user",
                element: <UserListPage />,
                handle: {
                  breadcrumb: [
                    { label: "Users", labelKey: "user.labelPlural" },
                  ],
                  requiredPermission: "master-user.view",
                },
              },
              {
                path: "user-management/user/create",
                element: <UserCreatePage />,
                handle: {
                  breadcrumb: [
                    {
                      label: "Users",
                      labelKey: "user.labelPlural",
                      path: "/user-management/user",
                    },
                    { label: "Create", labelKey: "user.breadcrumbs.create" },
                  ],
                  requiredPermission: "master-user.create",
                },
              },
              {
                path: "user-management/user/:userId/view",
                element: <UserViewPage />,
                handle: {
                  breadcrumb: [
                    {
                      label: "Users",
                      labelKey: "user.labelPlural",
                      path: "/user-management/user",
                    },
                    { label: "Detail", labelKey: "user.breadcrumbs.detail" },
                  ],
                  requiredPermission: "master-user.view",
                },
              },
              {
                path: "user-management/user/:userId/edit",
                element: <UserEditPage />,
                handle: {
                  breadcrumb: [
                    {
                      label: "Users",
                      labelKey: "user.labelPlural",
                      path: "/user-management/user",
                    },
                    { label: "Edit", labelKey: "user.breadcrumbs.edit" },
                  ],
                  requiredPermission: "master-user.update",
                },
              },
              {
                path: "user-management/role",
                element: <RoleListPage />,
                handle: {
                  breadcrumb: [
                    { label: "Roles", labelKey: "role.labelPlural" },
                  ],
                  requiredPermission: "master-role.view",
                },
              },
              {
                path: "user-management/role/create",
                element: <RoleCreatePage />,
                handle: {
                  breadcrumb: [
                    {
                      label: "Roles",
                      labelKey: "role.labelPlural",
                      path: "/user-management/role",
                    },
                    { label: "Create", labelKey: "role.breadcrumbs.create" },
                  ],
                  requiredPermission: "master-role.create",
                },
              },
              {
                path: "user-management/role/:roleId/view",
                element: <RoleViewPage />,
                handle: {
                  breadcrumb: [
                    {
                      label: "Roles",
                      labelKey: "role.labelPlural",
                      path: "/user-management/role",
                    },
                    { label: "Detail", labelKey: "role.breadcrumbs.detail" },
                  ],
                  requiredPermission: "master-role.view",
                },
              },
              {
                path: "user-management/role/:roleId/edit",
                element: <RoleEditPage />,
                handle: {
                  breadcrumb: [
                    {
                      label: "Roles",
                      labelKey: "role.labelPlural",
                      path: "/user-management/role",
                    },
                    { label: "Edit", labelKey: "role.breadcrumbs.edit" },
                  ],
                  requiredPermission: "master-role.update",
                },
              },
              {
                path: "settings",
                element: <SettingsPage />,
                handle: {
                  breadcrumb: [
                    { label: "Settings", labelKey: "settings.breadcrumb" },
                  ],
                  requiredPermission: "settings.view",
                },
              },
                                                                                                                                                                                                                                                                                                                                                              {
                                                                                                                                                                                                                                                                                                                                                                path: 'master-data/regions',
                                                                                                                                                                                                                                                                                                                                                                element: <RegionListPage />,
                                                                                                                                                                                                                                                                                                                                                                handle: {
                                                                                                                                                                                                                                                                                                                                                                  breadcrumb: [{ label: 'Regions', labelKey: 'region.breadcrumbs.list' }],
                                                                                                                                                                                                                                                                                                                                                                  requiredPermission: 'region.view',
                                                                                                                                                                                                                                                                                                                                                                },
                                                                                                                                                                                                                                                                                                                                                              },
                                                                                                                                                                                                                                                                                                                                                              {
                                                                                                                                                                                                                                                                                                                                                                path: 'master-data/regions/create',
                                                                                                                                                                                                                                                                                                                                                                element: <RegionCreatePage />,
                                                                                                                                                                                                                                                                                                                                                                handle: {
                                                                                                                                                                                                                                                                                                                                                                  breadcrumb: [{ label: 'Regions', labelKey: 'region.breadcrumbs.list', path: '/master-data/regions' }, { label: 'Create', labelKey: 'region.breadcrumbs.create' }],
                                                                                                                                                                                                                                                                                                                                                                  requiredPermission: 'region.create',
                                                                                                                                                                                                                                                                                                                                                                },
                                                                                                                                                                                                                                                                                                                                                              },
                                                                                                                                                                                                                                                                                                                                                              {
                                                                                                                                                                                                                                                                                                                                                                path: 'master-data/regions/:regionId/view',
                                                                                                                                                                                                                                                                                                                                                                element: <RegionViewPage />,
                                                                                                                                                                                                                                                                                                                                                                handle: {
                                                                                                                                                                                                                                                                                                                                                                  breadcrumb: [{ label: 'Regions', labelKey: 'region.breadcrumbs.list', path: '/master-data/regions' }, { label: 'Detail', labelKey: 'region.breadcrumbs.detail' }],
                                                                                                                                                                                                                                                                                                                                                                  requiredPermission: 'region.view',
                                                                                                                                                                                                                                                                                                                                                                },
                                                                                                                                                                                                                                                                                                                                                              },
                                                                                                                                                                                                                                                                                                                                                              {
                                                                                                                                                                                                                                                                                                                                                                path: 'master-data/regions/:regionId/edit',
                                                                                                                                                                                                                                                                                                                                                                element: <RegionEditPage />,
                                                                                                                                                                                                                                                                                                                                                                handle: {
                                                                                                                                                                                                                                                                                                                                                                  breadcrumb: [{ label: 'Regions', labelKey: 'region.breadcrumbs.list', path: '/master-data/regions' }, { label: 'Edit', labelKey: 'region.breadcrumbs.edit' }],
                                                                                                                                                                                                                                                                                                                                                                  requiredPermission: 'region.update',
                                                                                                                                                                                                                                                                                                                                                                },
                                                                                                                                                                                                                                                                                                                                                              },
                                                                                                                                                                                                                                                                                                                                                              {
                                                                                                                                                                                                                                                                                                                                                                path: 'master-data/vendors',
                                                                                                                                                                                                                                                                                                                                                                element: <VendorListPage />,
                                                                                                                                                                                                                                                                                                                                                                handle: {
                                                                                                                                                                                                                                                                                                                                                                  breadcrumb: [{ label: 'Vendors', labelKey: 'vendor.breadcrumbs.list' }],
                                                                                                                                                                                                                                                                                                                                                                  requiredPermission: 'vendor.view',
                                                                                                                                                                                                                                                                                                                                                                },
                                                                                                                                                                                                                                                                                                                                                              },
                                                                                                                                                                                                                                                                                                                                                              {
                                                                                                                                                                                                                                                                                                                                                                path: 'master-data/vendors/create',
                                                                                                                                                                                                                                                                                                                                                                element: <VendorCreatePage />,
                                                                                                                                                                                                                                                                                                                                                                handle: {
                                                                                                                                                                                                                                                                                                                                                                  breadcrumb: [{ label: 'Vendors', labelKey: 'vendor.breadcrumbs.list', path: '/master-data/vendors' }, { label: 'Create', labelKey: 'vendor.breadcrumbs.create' }],
                                                                                                                                                                                                                                                                                                                                                                  requiredPermission: 'vendor.create',
                                                                                                                                                                                                                                                                                                                                                                },
                                                                                                                                                                                                                                                                                                                                                              },
                                                                                                                                                                                                                                                                                                                                                              {
                                                                                                                                                                                                                                                                                                                                                                path: 'master-data/vendors/:vendorId/view',
                                                                                                                                                                                                                                                                                                                                                                element: <VendorViewPage />,
                                                                                                                                                                                                                                                                                                                                                                handle: {
                                                                                                                                                                                                                                                                                                                                                                  breadcrumb: [{ label: 'Vendors', labelKey: 'vendor.breadcrumbs.list', path: '/master-data/vendors' }, { label: 'Detail', labelKey: 'vendor.breadcrumbs.detail' }],
                                                                                                                                                                                                                                                                                                                                                                  requiredPermission: 'vendor.view',
                                                                                                                                                                                                                                                                                                                                                                },
                                                                                                                                                                                                                                                                                                                                                              },
                                                                                                                                                                                                                                                                                                                                                              {
                                                                                                                                                                                                                                                                                                                                                                path: 'master-data/vendors/:vendorId/edit',
                                                                                                                                                                                                                                                                                                                                                                element: <VendorEditPage />,
                                                                                                                                                                                                                                                                                                                                                                handle: {
                                                                                                                                                                                                                                                                                                                                                                  breadcrumb: [{ label: 'Vendors', labelKey: 'vendor.breadcrumbs.list', path: '/master-data/vendors' }, { label: 'Edit', labelKey: 'vendor.breadcrumbs.edit' }],
                                                                                                                                                                                                                                                                                                                                                                  requiredPermission: 'vendor.update',
                                                                                                                                                                                                                                                                                                                                                                },
                                                                                                                                                                                                                                                                                                                                                              },
                                                                                                                                                                                                                                                                                                                                                              {
                                                                                                                                                                                                                                                                                                                                                                path: 'master-data/categories',
                                                                                                                                                                                                                                                                                                                                                                element: <CategoryListPage />,
                                                                                                                                                                                                                                                                                                                                                                handle: {
                                                                                                                                                                                                                                                                                                                                                                  breadcrumb: [{ label: 'Categories', labelKey: 'category.breadcrumbs.list' }],
                                                                                                                                                                                                                                                                                                                                                                  requiredPermission: 'category.view',
                                                                                                                                                                                                                                                                                                                                                                },
                                                                                                                                                                                                                                                                                                                                                              },
                                                                                                                                                                                                                                                                                                                                                              {
                                                                                                                                                                                                                                                                                                                                                                path: 'master-data/categories/create',
                                                                                                                                                                                                                                                                                                                                                                element: <CategoryCreatePage />,
                                                                                                                                                                                                                                                                                                                                                                handle: {
                                                                                                                                                                                                                                                                                                                                                                  breadcrumb: [{ label: 'Categories', labelKey: 'category.breadcrumbs.list', path: '/master-data/categories' }, { label: 'Create', labelKey: 'category.breadcrumbs.create' }],
                                                                                                                                                                                                                                                                                                                                                                  requiredPermission: 'category.create',
                                                                                                                                                                                                                                                                                                                                                                },
                                                                                                                                                                                                                                                                                                                                                              },
                                                                                                                                                                                                                                                                                                                                                              {
                                                                                                                                                                                                                                                                                                                                                                path: 'master-data/categories/:categoryId/view',
                                                                                                                                                                                                                                                                                                                                                                element: <CategoryViewPage />,
                                                                                                                                                                                                                                                                                                                                                                handle: {
                                                                                                                                                                                                                                                                                                                                                                  breadcrumb: [{ label: 'Categories', labelKey: 'category.breadcrumbs.list', path: '/master-data/categories' }, { label: 'Detail', labelKey: 'category.breadcrumbs.detail' }],
                                                                                                                                                                                                                                                                                                                                                                  requiredPermission: 'category.view',
                                                                                                                                                                                                                                                                                                                                                                },
                                                                                                                                                                                                                                                                                                                                                              },
                                                                                                                                                                                                                                                                                                                                                              {
                                                                                                                                                                                                                                                                                                                                                                path: 'master-data/categories/:categoryId/edit',
                                                                                                                                                                                                                                                                                                                                                                element: <CategoryEditPage />,
                                                                                                                                                                                                                                                                                                                                                                handle: {
                                                                                                                                                                                                                                                                                                                                                                  breadcrumb: [{ label: 'Categories', labelKey: 'category.breadcrumbs.list', path: '/master-data/categories' }, { label: 'Edit', labelKey: 'category.breadcrumbs.edit' }],
                                                                                                                                                                                                                                                                                                                                                                  requiredPermission: 'category.update',
                                                                                                                                                                                                                                                                                                                                                                },
                                                                                                                                                                                                                                                                                                                                                              },
                                                                                                                                                                                                                                                                                                                                                              {
                                                                                                                                                                                                                                                                                                                                                                path: 'master-data/products',
                                                                                                                                                                                                                                                                                                                                                                element: <ProductListPage />,
                                                                                                                                                                                                                                                                                                                                                                handle: {
                                                                                                                                                                                                                                                                                                                                                                  breadcrumb: [{ label: 'Products', labelKey: 'product.breadcrumbs.list' }],
                                                                                                                                                                                                                                                                                                                                                                  requiredPermission: 'product.view',
                                                                                                                                                                                                                                                                                                                                                                },
                                                                                                                                                                                                                                                                                                                                                              },
                                                                                                                                                                                                                                                                                                                                                              {
                                                                                                                                                                                                                                                                                                                                                                path: 'master-data/products/create',
                                                                                                                                                                                                                                                                                                                                                                element: <ProductCreatePage />,
                                                                                                                                                                                                                                                                                                                                                                handle: {
                                                                                                                                                                                                                                                                                                                                                                  breadcrumb: [{ label: 'Products', labelKey: 'product.breadcrumbs.list', path: '/master-data/products' }, { label: 'Create', labelKey: 'product.breadcrumbs.create' }],
                                                                                                                                                                                                                                                                                                                                                                  requiredPermission: 'product.create',
                                                                                                                                                                                                                                                                                                                                                                },
                                                                                                                                                                                                                                                                                                                                                              },
                                                                                                                                                                                                                                                                                                                                                              {
                                                                                                                                                                                                                                                                                                                                                                path: 'master-data/products/:productId/view',
                                                                                                                                                                                                                                                                                                                                                                element: <ProductViewPage />,
                                                                                                                                                                                                                                                                                                                                                                handle: {
                                                                                                                                                                                                                                                                                                                                                                  breadcrumb: [{ label: 'Products', labelKey: 'product.breadcrumbs.list', path: '/master-data/products' }, { label: 'Detail', labelKey: 'product.breadcrumbs.detail' }],
                                                                                                                                                                                                                                                                                                                                                                  requiredPermission: 'product.view',
                                                                                                                                                                                                                                                                                                                                                                },
                                                                                                                                                                                                                                                                                                                                                              },
                                                                                                                                                                                                                                                                                                                                                              {
                                                                                                                                                                                                                                                                                                                                                                path: 'master-data/products/:productId/edit',
                                                                                                                                                                                                                                                                                                                                                                element: <ProductEditPage />,
                                                                                                                                                                                                                                                                                                                                                                handle: {
                                                                                                                                                                                                                                                                                                                                                                  breadcrumb: [{ label: 'Products', labelKey: 'product.breadcrumbs.list', path: '/master-data/products' }, { label: 'Edit', labelKey: 'product.breadcrumbs.edit' }],
                                                                                                                                                                                                                                                                                                                                                                  requiredPermission: 'product.update',
                                                                                                                                                                                                                                                                                                                                                                },
                                                                                                                                                                                                                                                                                                                                                              },
                                                                                                                                                                                                                                                                                                                                                              {
                                                                                                                                                                                                                                                                                                                                                                path: 'master-data/prices',
                                                                                                                                                                                                                                                                                                                                                                element: <PriceListPage />,
                                                                                                                                                                                                                                                                                                                                                                handle: {
                                                                                                                                                                                                                                                                                                                                                                  breadcrumb: [{ label: 'Prices', labelKey: 'price.breadcrumbs.list' }],
                                                                                                                                                                                                                                                                                                                                                                  requiredPermission: 'price.view',
                                                                                                                                                                                                                                                                                                                                                                },
                                                                                                                                                                                                                                                                                                                                                              },
                                                                                                                                                                                                                                                                                                                                                              {
                                                                                                                                                                                                                                                                                                                                                                path: 'master-data/prices/create',
                                                                                                                                                                                                                                                                                                                                                                element: <PriceCreatePage />,
                                                                                                                                                                                                                                                                                                                                                                handle: {
                                                                                                                                                                                                                                                                                                                                                                  breadcrumb: [{ label: 'Prices', labelKey: 'price.breadcrumbs.list', path: '/master-data/prices' }, { label: 'Create', labelKey: 'price.breadcrumbs.create' }],
                                                                                                                                                                                                                                                                                                                                                                  requiredPermission: 'price.create',
                                                                                                                                                                                                                                                                                                                                                                },
                                                                                                                                                                                                                                                                                                                                                              },
                                                                                                                                                                                                                                                                                                                                                              {
                                                                                                                                                                                                                                                                                                                                                                path: 'master-data/prices/:priceId/view',
                                                                                                                                                                                                                                                                                                                                                                element: <PriceViewPage />,
                                                                                                                                                                                                                                                                                                                                                                handle: {
                                                                                                                                                                                                                                                                                                                                                                  breadcrumb: [{ label: 'Prices', labelKey: 'price.breadcrumbs.list', path: '/master-data/prices' }, { label: 'Detail', labelKey: 'price.breadcrumbs.detail' }],
                                                                                                                                                                                                                                                                                                                                                                  requiredPermission: 'price.view',
                                                                                                                                                                                                                                                                                                                                                                },
                                                                                                                                                                                                                                                                                                                                                              },
                                                                                                                                                                                                                                                                                                                                                              {
                                                                                                                                                                                                                                                                                                                                                                path: 'master-data/prices/:priceId/edit',
                                                                                                                                                                                                                                                                                                                                                                element: <PriceEditPage />,
                                                                                                                                                                                                                                                                                                                                                                handle: {
                                                                                                                                                                                                                                                                                                                                                                  breadcrumb: [{ label: 'Prices', labelKey: 'price.breadcrumbs.list', path: '/master-data/prices' }, { label: 'Edit', labelKey: 'price.breadcrumbs.edit' }],
                                                                                                                                                                                                                                                                                                                                                                  requiredPermission: 'price.update',
                                                                                                                                                                                                                                                                                                                                                                },
                                                                                                                                                                                                                                                                                                                                                              },
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
      { path: "login", element: <LoginPage /> },
    ],
  },
]);
