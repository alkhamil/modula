import { createContext, useContext, type ReactNode } from 'react';
import type { AlertAppearance, AlertVariant } from '../Alert';

/** Style toast = style Alert. */
export type ToastVariant = AlertVariant;

/** Props Alert (variant, message, title, appearance, size, action) + opsi tampil toast. */
export interface ShowToastParams {
  message: string | ReactNode;
  variant: ToastVariant;
  title?: ReactNode;
  appearance?: AlertAppearance;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  action?: { label: string; onClick?: () => void };
  duration?: number;
  closable?: boolean;
  containerId?: string;
  className?: string;
  widthClass?: string;
}

interface ToastContextType {
  showToast: (params: ShowToastParams) => void;
}

export const ToastContext = createContext<ToastContextType | null>(null);

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) {
    throw new Error('useToast must be used within ToastProvider');
  }
  return ctx;
}
