import type { ReactNode } from 'react';

export type FieldSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl';
export type FieldState =
  | 'default'
  | 'selected'
  | 'typing'
  | 'filled'
  | 'disabled'
  | 'error-empty'
  | 'error-filled'
  | 'read-only';

interface FieldStateInput {
  disabled?: boolean;
  readOnly?: boolean;
  invalid?: boolean;
  /** Fokus (mouse/keyboard) pada field. */
  focused: boolean;
  /** Field berisi teks. */
  filled: boolean;
  /** Hanya dokumentasi: paksa `selected` / `typing` / `focused`. */
  forced?: string;
}

/**
 * State visual field WDS (mode token "Input states" / "Textarea states"):
 * disabled → read-only → error (kosong/terisi) → fokus (selected = kosong, typing = terisi) → filled → default.
 * Cincin fokus (`focused`) adalah lapisan terpisah di CSS.
 */
export function fieldState({ disabled, readOnly, invalid, focused, filled, forced }: FieldStateInput): FieldState {
  const isFocused = focused || forced === 'selected' || forced === 'typing';
  const isFilled = forced === 'typing' ? true : forced === 'selected' ? false : filled;
  if (disabled) return 'disabled';
  if (readOnly) return 'read-only';
  if (invalid) return isFilled ? 'error-filled' : 'error-empty';
  if (isFocused) return isFilled ? 'typing' : 'selected';
  return isFilled ? 'filled' : 'default';
}

/** Isi teks bantuan di bawah field: pesan error menggantikan hint. */
export function fieldSlot(error: string | undefined, hint: ReactNode): ReactNode {
  return error ?? hint;
}
