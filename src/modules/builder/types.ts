export type PageType = 'LIST' | 'FORM' | 'DETAIL' | 'DASHBOARD' | 'CUSTOM';

export type ComponentCategory =
  | 'layout'
  | 'form'
  | 'data'
  | 'action'
  | 'feedback';

export type ViewportMode = 'desktop' | 'tablet' | 'mobile';

export interface ComponentValidation {
  required?: boolean;
  minLength?: number;
  maxLength?: number;
  pattern?: string;
  errorMessage?: string;
}

export interface ComponentAction {
  onClick?: 'none' | 'navigate' | 'open-dialog' | 'submit-form' | 'toast';
  targetPageKey?: string;
  targetDialogId?: string;
  toastMessage?: string;
  toastType?: 'success' | 'info' | 'warning' | 'error';
}

export interface CanvasComponentNode {
  id: string;
  type: string;
  category: ComponentCategory;
  name: string;
  props: Record<string, any>;
  validation?: ComponentValidation;
  actions?: ComponentAction;
  children?: CanvasComponentNode[];
}

export interface ProjectPageDefinition {
  id: string;
  key: string;
  title: string;
  type: PageType;
  path: string;
  components: CanvasComponentNode[];
  createdAt: string;
  updatedAt: string;
}

export interface ComponentCatalogItem {
  type: string;
  name: string;
  category: ComponentCategory;
  description: string;
  defaultProps: Record<string, any>;
  defaultValidation?: ComponentValidation;
  defaultActions?: ComponentAction;
  childrenAllowed?: boolean;
}
