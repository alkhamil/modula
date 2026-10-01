import type { NavItemType } from '../shared/types/navigation';
import {
  NavDashboardIcon,
  NavMasterDataIcon,
  NavSettingsIcon,
  NavUserManagementIcon,
} from '../shared/components/icons';

export const navItems: NavItemType[] = [
  {
    label: 'Dashboard',
    path: '/',
    icon: <NavDashboardIcon className="h-5 w-5" />,
  },
  {
    label: 'Users',
    path: '/users',
    icon: <NavUserManagementIcon className="h-5 w-5" />,
    permissionKey: 'user.view',
  },
  {
    label: 'Generator',
    path: '/generator',
    icon: <NavSettingsIcon className="h-5 w-5" />,
  },
  {
    label: 'Component',
    icon: <NavMasterDataIcon className="h-5 w-5" />,
    children: [
      { label: 'Typography', path: '/components/typography' },
      { label: 'Colors', path: '/components/colors' },
      { label: 'Icons', path: '/components/icons' },
      { label: 'UI', path: '/components/ui' },
    ],
  },
  // __GENERATOR_PARENT mater-data__
  {
    label: 'Mater Data',
    icon: <NavMasterDataIcon className="h-5 w-5" />,
    children: [
      { label: 'Companies', path: '/mater-data/companies', permissionKey: 'company.view' },
      { label: 'Branches', path: '/mater-data/branches', permissionKey: 'branch.view' },
      { label: 'Products', path: '/mater-data/products', permissionKey: 'product.view' },
      { label: 'Categories', path: '/mater-data/categories', permissionKey: 'category.view' },
      { label: 'Inventories', path: '/mater-data/inventories', permissionKey: 'inventory.view' },
      { label: 'ProductVariants', path: '/mater-data/product-variants', permissionKey: 'product_variant.view' },
      { label: 'ProductColors', path: '/mater-data/product-colors', permissionKey: 'product_color.view' },
    ],
  },
{
  label: 'Orders',
  path: '/orders',
  icon: <NavMasterDataIcon className="h-5 w-5" />,
  permissionKey: 'order.view',
},
{
  label: 'NewClaims',
  path: '/new-claims',
  icon: <NavMasterDataIcon className="h-5 w-5" />,
  permissionKey: 'new_claim.view',
},
// __GENERATOR_NAV_ITEMS__
];
