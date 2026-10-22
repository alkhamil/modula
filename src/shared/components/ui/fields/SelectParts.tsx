import { createPortal } from 'react-dom';
import type { ReactNode, Ref } from 'react';
import type { FieldSize } from './fieldState';

/** Spinner kecil (loading opsi). Ukuran dari `.wds-field__icon`. */
export function SelectSpinner() {
  return (
    <svg className="wds-field__spinner" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" aria-hidden="true">
      <circle opacity="0.25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" />
      <path opacity="0.75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
    </svg>
  );
}

interface MenuPanelProps {
  dropdownRef: Ref<HTMLDivElement>;
  position: { top: number; left: number; width: number };
  size: FieldSize;
  children: ReactNode;
  onScroll?: () => void;
  listRef?: Ref<HTMLDivElement>;
}

/** Panel Dropdown / Menu WDS di portal (posisi fixed dari `useSelectDropdown`). */
export function MenuPanel({ dropdownRef, position, size, children, onScroll, listRef }: MenuPanelProps) {
  return createPortal(
    <div
      ref={dropdownRef}
      data-select-dropdown
      data-wds-size={size}
      onMouseDown={(e) => e.stopPropagation()}
      style={{ position: 'fixed', top: position.top, left: position.left, width: position.width, zIndex: 50, marginTop: 8 }}
    >
      <div ref={listRef} onScroll={onScroll} className="wds-menu" role="listbox">
        {children}
      </div>
    </div>,
    document.body,
  );
}

interface MenuItemProps {
  selected?: boolean;
  highlighted?: boolean;
  disabled?: boolean;
  leading?: ReactNode;
  trailing?: ReactNode;
  onClick: () => void;
  onMouseMove?: () => void;
  index?: number;
  children: ReactNode;
}

/** Menu item WDS: state `selected` / `pressed` (sorot) / `disabled` / `default`. */
export function MenuItem({ selected, highlighted, disabled, leading, trailing, onClick, onMouseMove, index, children }: MenuItemProps) {
  const state = disabled ? 'disabled' : highlighted ? 'pressed' : selected ? 'selected' : 'default';
  return (
    <button
      type="button"
      role="option"
      aria-selected={selected}
      data-focused-index={index}
      data-state={state}
      disabled={disabled}
      className="wds-menu__item"
      onClick={onClick}
      onMouseMove={onMouseMove}
    >
      {leading && <span className="wds-menu__icon">{leading}</span>}
      <span className="wds-menu__text">{children}</span>
      {trailing && <span className="wds-menu__icon">{trailing}</span>}
    </button>
  );
}
