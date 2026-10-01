import { type ReactNode } from 'react';

export interface SubItem {
  label: string;
  path: string;
  permissionKey?: string;
}

export interface NavItemType {
  label: string;
  path?: string;
  icon: ReactNode;
  children?: SubItem[];
  permissionKey?: string;
}
