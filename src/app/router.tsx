import { createBrowserRouter } from 'react-router';
import { ErrorStatePage } from '../shared/components/ui';
import { AuthProvider, PermissionGate } from '../modules/auth';
import ProtectedAppShell from './ProtectedAppShell';
import DashboardPage from '../pages/DashboardPage';
import TypographyPage from '../pages/components/TypographyPage';
import ColorsPage from '../pages/components/ColorsPage';
import IconsPage from '../pages/components/IconsPage';
import UiPage from '../pages/components/UiPage';
import LoginPage from '../pages/LoginPage';
import {
  UserListPage,
  UserCreatePage,
  UserViewPage,
  UserEditPage,
} from '../modules/user';
import { GeneratorPage } from '../modules/generator';
import {
  DynamicModuleRoutes,
  DynamicPreviewCreatePage,
  DynamicPreviewDetailPage,
  DynamicPreviewEditPage,
  DynamicPreviewPage,
} from '../modules/generator/runtime/DynamicRoutes';
import {
  CompanyListPage,
  CompanyCreatePage,
  CompanyViewPage,
  CompanyEditPage,
} from '../modules/mater-data/company';
import {
  BranchListPage,
  BranchCreatePage,
  BranchViewPage,
  BranchEditPage,
} from '../modules/mater-data/branch';
import {
  ProductListPage,
  ProductCreatePage,
  ProductViewPage,
  ProductEditPage,
} from '../modules/mater-data/product';
import {
  OrderListPage,
  OrderViewPage,
} from '../modules/order';
import {
  NewClaimListPage,
  NewClaimCreatePage,
  NewClaimViewPage,
  NewClaimEditPage,
} from '../modules/new-claim';
import {
  CategoryListPage,
  CategoryCreatePage,
  CategoryViewPage,
  CategoryEditPage,
} from '../modules/mater-data/category';
import {
  InventoryListPage,
  InventoryCreatePage,
  InventoryViewPage,
  InventoryEditPage,
} from '../modules/mater-data/inventory';
import {
  ProductVariantListPage,
  ProductVariantCreatePage,
  ProductVariantViewPage,
  ProductVariantEditPage,
} from '../modules/mater-data/product-variant';
import {
  ProductColorListPage,
  ProductColorCreatePage,
  ProductColorViewPage,
  ProductColorEditPage,
} from '../modules/mater-data/product-color';
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
                path: 'components/typography',
                element: <TypographyPage />,
                handle: { breadcrumb: [{ label: 'Component' }, { label: 'Typography' }] },
              },
              {
                path: 'components/colors',
                element: <ColorsPage />,
                handle: { breadcrumb: [{ label: 'Component' }, { label: 'Colors' }] },
              },
              {
                path: 'components/icons',
                element: <IconsPage />,
                handle: { breadcrumb: [{ label: 'Component' }, { label: 'Icons' }] },
              },
              {
                path: 'components/ui',
                element: <UiPage />,
                handle: { breadcrumb: [{ label: 'Component' }, { label: 'UI' }] },
              },
              {
                path: 'users',
                element: <UserListPage />,
                handle: {
                  breadcrumb: [{ label: 'Users' }],
                  requiredPermission: 'user.view',
                },
              },
              {
                path: 'users/create',
                element: <UserCreatePage />,
                handle: {
                  breadcrumb: [{ label: 'Users', path: '/users' }, { label: 'Create' }],
                  requiredPermission: 'user.create',
                },
              },
              {
                path: 'users/:userId/view',
                element: <UserViewPage />,
                handle: {
                  breadcrumb: [{ label: 'Users', path: '/users' }, { label: 'Detail' }],
                  requiredPermission: 'user.view',
                },
              },
              {
                path: 'users/:userId/edit',
                element: <UserEditPage />,
                handle: {
                  breadcrumb: [{ label: 'Users', path: '/users' }, { label: 'Edit' }],
                  requiredPermission: 'user.update',
                },
              },
              {
                path: 'generator',
                element: <GeneratorPage />,
                handle: { breadcrumb: [{ label: 'Generator' }] },
              },
              {
                path: 'mater-data/companies',
                element: <CompanyListPage />,
                handle: {
                  breadcrumb: [{ label: 'Companies' }],
                  requiredPermission: 'company.view',
                },
              },
              {
                path: 'mater-data/companies/create',
                element: <CompanyCreatePage />,
                handle: {
                  breadcrumb: [{ label: 'Companies', path: '/mater-data/companies' }, { label: 'Create' }],
                  requiredPermission: 'company.create',
                },
              },
              {
                path: 'mater-data/companies/:companyId/view',
                element: <CompanyViewPage />,
                handle: {
                  breadcrumb: [{ label: 'Companies', path: '/mater-data/companies' }, { label: 'Detail' }],
                  requiredPermission: 'company.view',
                },
              },
              {
                path: 'mater-data/companies/:companyId/edit',
                element: <CompanyEditPage />,
                handle: {
                  breadcrumb: [{ label: 'Companies', path: '/mater-data/companies' }, { label: 'Edit' }],
                  requiredPermission: 'company.update',
                },
              },
              {
                path: 'mater-data/branches',
                element: <BranchListPage />,
                handle: {
                  breadcrumb: [{ label: 'Branches' }],
                  requiredPermission: 'branch.view',
                },
              },
              {
                path: 'mater-data/branches/create',
                element: <BranchCreatePage />,
                handle: {
                  breadcrumb: [{ label: 'Branches', path: '/mater-data/branches' }, { label: 'Create' }],
                  requiredPermission: 'branch.create',
                },
              },
              {
                path: 'mater-data/branches/:branchId/view',
                element: <BranchViewPage />,
                handle: {
                  breadcrumb: [{ label: 'Branches', path: '/mater-data/branches' }, { label: 'Detail' }],
                  requiredPermission: 'branch.view',
                },
              },
              {
                path: 'mater-data/branches/:branchId/edit',
                element: <BranchEditPage />,
                handle: {
                  breadcrumb: [{ label: 'Branches', path: '/mater-data/branches' }, { label: 'Edit' }],
                  requiredPermission: 'branch.update',
                },
              },
              {
                path: 'mater-data/products',
                element: <ProductListPage />,
                handle: {
                  breadcrumb: [{ label: 'Products' }],
                  requiredPermission: 'product.view',
                },
              },
              {
                path: 'mater-data/products/create',
                element: <ProductCreatePage />,
                handle: {
                  breadcrumb: [{ label: 'Products', path: '/mater-data/products' }, { label: 'Create' }],
                  requiredPermission: 'product.create',
                },
              },
              {
                path: 'mater-data/products/:productId/view',
                element: <ProductViewPage />,
                handle: {
                  breadcrumb: [{ label: 'Products', path: '/mater-data/products' }, { label: 'Detail' }],
                  requiredPermission: 'product.view',
                },
              },
              {
                path: 'mater-data/products/:productId/edit',
                element: <ProductEditPage />,
                handle: {
                  breadcrumb: [{ label: 'Products', path: '/mater-data/products' }, { label: 'Edit' }],
                  requiredPermission: 'product.update',
                },
              },
              {
                path: 'orders',
                element: <OrderListPage />,
                handle: {
                  breadcrumb: [{ label: 'Orders' }],
                  requiredPermission: 'order.view',
                },
              },
              {
                path: 'orders/:orderId/view',
                element: <OrderViewPage />,
                handle: {
                  breadcrumb: [{ label: 'Orders', path: '/orders' }, { label: 'Detail' }],
                  requiredPermission: 'order.view',
                },
              },
              {
                path: 'new-claims',
                element: <NewClaimListPage />,
                handle: {
                  breadcrumb: [{ label: 'NewClaims' }],
                  requiredPermission: 'new_claim.view',
                },
              },
              {
                path: 'new-claims/create',
                element: <NewClaimCreatePage />,
                handle: {
                  breadcrumb: [{ label: 'NewClaims', path: '/new-claims' }, { label: 'Create' }],
                  requiredPermission: 'new_claim.create',
                },
              },
              {
                path: 'new-claims/:newClaimId/view',
                element: <NewClaimViewPage />,
                handle: {
                  breadcrumb: [{ label: 'NewClaims', path: '/new-claims' }, { label: 'Detail' }],
                  requiredPermission: 'new_claim.view',
                },
              },
              {
                path: 'new-claims/:newClaimId/edit',
                element: <NewClaimEditPage />,
                handle: {
                  breadcrumb: [{ label: 'NewClaims', path: '/new-claims' }, { label: 'Edit' }],
                  requiredPermission: 'new_claim.update',
                },
              },
              {
                path: 'mater-data/categories',
                element: <CategoryListPage />,
                handle: {
                  breadcrumb: [{ label: 'Categories' }],
                  requiredPermission: 'category.view',
                },
              },
              {
                path: 'mater-data/categories/create',
                element: <CategoryCreatePage />,
                handle: {
                  breadcrumb: [{ label: 'Categories', path: '/mater-data/categories' }, { label: 'Create' }],
                  requiredPermission: 'category.create',
                },
              },
              {
                path: 'mater-data/categories/:categoryId/view',
                element: <CategoryViewPage />,
                handle: {
                  breadcrumb: [{ label: 'Categories', path: '/mater-data/categories' }, { label: 'Detail' }],
                  requiredPermission: 'category.view',
                },
              },
              {
                path: 'mater-data/categories/:categoryId/edit',
                element: <CategoryEditPage />,
                handle: {
                  breadcrumb: [{ label: 'Categories', path: '/mater-data/categories' }, { label: 'Edit' }],
                  requiredPermission: 'category.update',
                },
              },
              {
                path: 'mater-data/inventories',
                element: <InventoryListPage />,
                handle: {
                  breadcrumb: [{ label: 'Inventories' }],
                  requiredPermission: 'inventory.view',
                },
              },
              {
                path: 'mater-data/inventories/create',
                element: <InventoryCreatePage />,
                handle: {
                  breadcrumb: [{ label: 'Inventories', path: '/mater-data/inventories' }, { label: 'Create' }],
                  requiredPermission: 'inventory.create',
                },
              },
              {
                path: 'mater-data/inventories/:inventoryId/view',
                element: <InventoryViewPage />,
                handle: {
                  breadcrumb: [{ label: 'Inventories', path: '/mater-data/inventories' }, { label: 'Detail' }],
                  requiredPermission: 'inventory.view',
                },
              },
              {
                path: 'mater-data/inventories/:inventoryId/edit',
                element: <InventoryEditPage />,
                handle: {
                  breadcrumb: [{ label: 'Inventories', path: '/mater-data/inventories' }, { label: 'Edit' }],
                  requiredPermission: 'inventory.update',
                },
              },
              {
                path: 'mater-data/product-variants',
                element: <ProductVariantListPage />,
                handle: {
                  breadcrumb: [{ label: 'ProductVariants' }],
                  requiredPermission: 'product_variant.view',
                },
              },
              {
                path: 'mater-data/product-variants/create',
                element: <ProductVariantCreatePage />,
                handle: {
                  breadcrumb: [{ label: 'ProductVariants', path: '/mater-data/product-variants' }, { label: 'Create' }],
                  requiredPermission: 'product_variant.create',
                },
              },
              {
                path: 'mater-data/product-variants/:productVariantId/view',
                element: <ProductVariantViewPage />,
                handle: {
                  breadcrumb: [{ label: 'ProductVariants', path: '/mater-data/product-variants' }, { label: 'Detail' }],
                  requiredPermission: 'product_variant.view',
                },
              },
              {
                path: 'mater-data/product-variants/:productVariantId/edit',
                element: <ProductVariantEditPage />,
                handle: {
                  breadcrumb: [{ label: 'ProductVariants', path: '/mater-data/product-variants' }, { label: 'Edit' }],
                  requiredPermission: 'product_variant.update',
                },
              },
              {
                path: 'mater-data/product-colors',
                element: <ProductColorListPage />,
                handle: {
                  breadcrumb: [{ label: 'ProductColors' }],
                  requiredPermission: 'product_color.view',
                },
              },
              {
                path: 'mater-data/product-colors/create',
                element: <ProductColorCreatePage />,
                handle: {
                  breadcrumb: [{ label: 'ProductColors', path: '/mater-data/product-colors' }, { label: 'Create' }],
                  requiredPermission: 'product_color.create',
                },
              },
              {
                path: 'mater-data/product-colors/:productColorId/view',
                element: <ProductColorViewPage />,
                handle: {
                  breadcrumb: [{ label: 'ProductColors', path: '/mater-data/product-colors' }, { label: 'Detail' }],
                  requiredPermission: 'product_color.view',
                },
              },
              {
                path: 'mater-data/product-colors/:productColorId/edit',
                element: <ProductColorEditPage />,
                handle: {
                  breadcrumb: [{ label: 'ProductColors', path: '/mater-data/product-colors' }, { label: 'Edit' }],
                  requiredPermission: 'product_color.update',
                },
              },
              // __GENERATOR_ROUTES__
              {
                path: 'preview/:definitionKey',
                element: <DynamicPreviewPage />,
                handle: { breadcrumb: [{ label: 'Preview' }] },
              },
              {
                path: 'preview/:definitionKey/create',
                element: <DynamicPreviewCreatePage />,
                handle: { breadcrumb: [{ label: 'Preview' }, { label: 'Create' }] },
              },
              {
                path: 'preview/:definitionKey/:recordId/view',
                element: <DynamicPreviewDetailPage />,
                handle: { breadcrumb: [{ label: 'Preview' }, { label: 'Detail' }] },
              },
              {
                path: 'preview/:definitionKey/:recordId/edit',
                element: <DynamicPreviewEditPage />,
                handle: { breadcrumb: [{ label: 'Preview' }, { label: 'Edit' }] },
              },
              { element: <DynamicModuleRoutes /> },
              { path: '*', element: <ErrorStatePage type="404" />, handle: { notFound: true } },
            ],
          },
        ],
      },
      { path: 'login', element: <LoginPage /> },
    ],
  },
]);
