import { createElement, type ReactNode } from 'react';
import * as Icons from '../../../shared/components/icons';
import { isIconRef, isRawRef } from './types';

const iconMap = Icons as unknown as Record<string, React.ComponentType<{ className?: string }>>;

/** Ganti IconRef di props jadi elemen ikon sungguhan. */
export function resolveProps(props: Record<string, unknown>): Record<string, unknown> {
  const out: Record<string, unknown> = {};
  for (const [key, value] of Object.entries(props)) {
    if (isRawRef(value)) {
      out[key] = value.value;
    } else if (isIconRef(value)) {
      const Icon = iconMap[value.$icon];
      out[key] = Icon ? createElement(Icon) : null;
    } else {
      out[key] = value;
    }
  }
  return out;
}

function literal(value: unknown): string | null {
  if (isRawRef(value)) return `{${value.$raw}}`;
  if (isIconRef(value)) return `{<${value.$icon} />}`;
  if (typeof value === 'string') return JSON.stringify(value);
  if (typeof value === 'number') return `{${value}}`;
  if (typeof value === 'boolean') return `{${value}}`;
  return null;
}

/**
 * Cetak JSX dari props (hanya yang beda dari default komponen). Kode contoh dibuat dari
 * data yang sama dengan preview, jadi tidak bisa melenceng dari tampilan.
 */
export function toJsx(
  name: string,
  props: Record<string, unknown>,
  defaults: Record<string, unknown>,
  children?: ReactNode,
  extra: string[] = [],
): string {
  const attrs: string[] = [...extra];
  for (const [key, value] of Object.entries(props)) {
    if (value === undefined || value === null || value === false || value === '') continue;
    if (key in defaults && defaults[key] === value) continue;
    if (value === true) {
      attrs.push(key);
      continue;
    }
    const lit = literal(value);
    if (lit !== null) attrs.push(`${key}=${lit}`);
  }
  const head = [name, ...attrs].join(' ');
  const hasChildren = children !== undefined && children !== '';
  const oneLine = hasChildren ? `<${head}>${children}</${name}>` : `<${head} />`;
  if (oneLine.length <= 80 || attrs.length === 0) return oneLine;
  const lines = attrs.map((a) => `  ${a}`).join('\n');
  return hasChildren ? `<${name}\n${lines}\n>\n  ${children}\n</${name}>` : `<${name}\n${lines}\n/>`;
}

/** Kode contoh satu komponen dari data dokumentasi (nama/atribut tambahan/props yang disembunyikan). */
export function docCode(
  doc: { name: string; codeChildren?: string; codeName?: string; codeNameFor?: (props: Record<string, unknown>) => string; codeExtra?: string[]; codeOmit?: string[]; defaults?: Record<string, unknown> },
  props: Record<string, unknown>,
  children?: ReactNode,
): string {
  const visible = Object.fromEntries(Object.entries(props).filter(([key]) => !doc.codeOmit?.includes(key)));
  return toJsx(doc.codeNameFor?.(props) ?? doc.codeName ?? doc.name, visible, doc.defaults ?? {}, doc.codeChildren ?? children, doc.codeExtra ?? []);
}
