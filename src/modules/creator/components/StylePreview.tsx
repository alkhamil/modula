import type { ReactNode } from 'react';
import { themes, type ThemeName, type UiStyle } from '../../../shared/theme';

export type PreviewScreen =
  | 'login'
  | 'forgot'
  | 'register'
  | 'otp'
  | 'list'
  | 'users'
  | 'form'
  | 'dash'
  | 'audit'
  | 'profile';

interface StylePreviewProps {
  style: UiStyle;
  screen: PreviewScreen;
  mode: ThemeName;
  /** Warna primary terpilih (hex) atau '' untuk brand WDS bawaan. */
  primaryColor: string;
  className?: string;
}

type Box = { x: number; y: number; w: number; h: number };

const AUTH_SCREENS: PreviewScreen[] = ['login', 'forgot', 'register', 'otp'];

/**
 * Sketsa (wireframe) layar contoh untuk satu gaya, digambar dari token tema + warna primary terpilih
 * sehingga ikut berubah saat gaya/mode/warna diganti. Bukan tangkapan layar asli.
 */
function StylePreview({ style, screen, mode, primaryColor, className }: StylePreviewProps) {
  const t = themes[mode];
  const p = {
    surface: t.surface,
    card: mode === 'dark' ? t.surface : t.background,
    border: t.border,
    text: t.foreground,
    muted: t.border,
    soft: t.mutedForeground,
  };
  const brand = primaryColor || t.primary;
  // Putih transparan di atas sidebar gelap, diturunkan dari token teks-di-atas-brand (tanpa hex).
  const on = (pct: number) => `color-mix(in srgb, var(--wds-text-on-brand) ${pct}%, transparent)`;
  const dark = `color-mix(in srgb, ${brand} 78%, black)`;
  const tint = `color-mix(in srgb, ${brand} 9%, ${p.surface})`;

  let seq = 0;
  const rect = (x: number, y: number, w: number, h: number, fill: string, rx = 1.5, stroke?: string) => {
    seq += 1;
    return <rect key={`r${seq}`} x={x} y={y} width={w} height={h} rx={rx} style={{ fill, stroke: stroke ?? 'none', strokeWidth: 0.6 }} />;
  };
  const dot = (cx: number, cy: number, r: number, fill: string) => {
    seq += 1;
    return <circle key={`c${seq}`} cx={cx} cy={cy} r={r} style={{ fill }} />;
  };

  /** Kerangka shell + area konten. */
  function shell(): { nodes: ReactNode[]; c: Box } {
    const n: ReactNode[] = [];
    if (style === 'classic' || style === 'light') {
      const light = style === 'light';
      n.push(rect(0, 0, 160, 100, p.surface, 0), rect(0, 0, 32, 100, light ? p.card : dark, 0, light ? p.border : undefined));
      n.push(rect(6, 8, 20, 6, light ? brand : on(33), 2));
      for (let k = 0; k < 4; k += 1) n.push(rect(6, 22 + k * 9, 20, 4, light ? (k === 0 ? brand : p.muted) : k === 0 ? on(100) : on(27), 2));
      n.push(rect(32, 0, 128, 12, p.card, 0, p.border), dot(150, 6, 3, p.muted));
      return { nodes: n, c: { x: 38, y: 18, w: 116, h: 76 } };
    }
    if (style === 'top') {
      n.push(rect(0, 0, 160, 100, p.surface, 0), rect(0, 0, 160, 14, p.card, 0, p.border), rect(6, 4, 14, 6, brand, 2));
      for (let k = 0; k < 4; k += 1) n.push(rect(30 + k * 20, 5.5, 16, 3, k === 0 ? brand : p.muted, 1.5));
      n.push(dot(152, 7, 3, p.muted));
      return { nodes: n, c: { x: 10, y: 20, w: 140, h: 74 } };
    }
    if (style === 'rail') {
      n.push(rect(0, 0, 160, 100, p.surface, 0), rect(0, 0, 12, 100, dark, 0));
      for (let k = 0; k < 5; k += 1) n.push(dot(6, 10 + k * 9, 2.2, k === 0 ? on(100) : on(33)));
      n.push(rect(12, 0, 148, 9, p.card, 0, p.border));
      return { nodes: n, c: { x: 17, y: 14, w: 138, h: 82 } };
    }
    n.push(rect(0, 0, 160, 100, tint, 0), rect(4, 4, 28, 92, dark, 6), rect(9, 10, 18, 5, on(33), 2));
    for (let k = 0; k < 4; k += 1) n.push(rect(9, 22 + k * 9, 18, 4, k === 0 ? on(100) : on(27), 2));
    n.push(rect(36, 4, 120, 92, p.card, 6, p.border));
    return { nodes: n, c: { x: 42, y: 10, w: 108, h: 80 } };
  }

  const head = (c: Box, w = 36): ReactNode[] => [rect(c.x, c.y, w, 5, p.text), rect(c.x + c.w - 26, c.y - 0.5, 26, 6, brand, 2)];

  function table(c: Box, avatar: boolean): ReactNode[] {
    const n = head(c);
    n.push(rect(c.x, c.y + 10, 50, 6, p.card, 2, p.border), rect(c.x, c.y + 20, c.w, 6, p.muted, 1));
    for (let k = 0; k < 5; k += 1) {
      const y = c.y + 29 + k * 9;
      n.push(rect(c.x, y, c.w, 7, p.card, 1, p.border));
      if (avatar) n.push(dot(c.x + 5, y + 3.5, 2.4, p.soft));
      n.push(rect(c.x + (avatar ? 11 : 4), y + 2.3, 26, 2.4, p.soft, 1), rect(c.x + c.w - 24, y + 1.8, 18, 3.4, k % 2 ? p.muted : brand, 1.7));
    }
    return n;
  }

  function form(c: Box): ReactNode[] {
    const n = head(c, 34);
    for (let k = 0; k < 3; k += 1) {
      const y = c.y + 12 + k * 17;
      n.push(rect(c.x, y, 18, 2.6, p.soft, 1), rect(c.x, y + 5, c.w * 0.62, 8, p.card, 2, p.border));
    }
    n.push(rect(c.x, c.y + c.h - 11, 22, 8, brand, 2), rect(c.x + 26, c.y + c.h - 11, 18, 8, p.card, 2, p.border));
    return n;
  }

  function dash(c: Box): ReactNode[] {
    const n = head(c, 38);
    const w = (c.w - 8) / 3;
    for (let k = 0; k < 3; k += 1) {
      const x = c.x + k * (w + 4);
      n.push(rect(x, c.y + 10, w, 16, p.card, 2, p.border), rect(x + 3, c.y + 13, 12, 2.4, p.soft, 1), rect(x + 3, c.y + 18, 16, 4, k === 0 ? brand : p.soft, 1));
    }
    n.push(rect(c.x, c.y + 30, c.w, c.h - 32, p.card, 2, p.border));
    [14, 22, 17, 28, 20, 32, 24].forEach((h, k) => {
      const bw = (c.w - 16) / 7;
      n.push(rect(c.x + 6 + k * bw, c.y + c.h - 6 - h, bw - 3, h, k === 5 ? brand : p.muted, 1));
    });
    return n;
  }

  function profile(c: Box): ReactNode[] {
    const n = head(c, 40);
    n.push(dot(c.x + 11, c.y + 20, 9, p.muted), rect(c.x + 26, c.y + 14, 34, 4, p.text, 1.5), rect(c.x + 26, c.y + 21, 24, 3, p.soft, 1));
    for (let k = 0; k < 2; k += 1) {
      const y = c.y + 36 + k * 16;
      n.push(rect(c.x, y, 16, 2.6, p.soft, 1), rect(c.x, y + 5, c.w * 0.6, 8, p.card, 2, p.border));
    }
    n.push(rect(c.x, c.y + c.h - 11, 22, 8, brand, 2));
    return n;
  }

  function audit(c: Box): ReactNode[] {
    const n = head(c, 40);
    for (let k = 0; k < 6; k += 1) {
      const y = c.y + 12 + k * 11;
      n.push(dot(c.x + 3, y + 3, 2.2, k % 3 ? p.soft : brand), rect(c.x + 10, y + 0.5, c.w * 0.55, 2.6, p.text, 1), rect(c.x + 10, y + 5, c.w * 0.35, 2.2, p.soft, 1), rect(c.x + c.w - 22, y + 1.5, 22, 3, p.muted, 1));
    }
    return n;
  }

  function auth(): ReactNode[] {
    const n: ReactNode[] = [];
    let bx: number;
    let by: number;
    let bw: number;
    if (style === 'light') {
      n.push(rect(0, 0, 160, 100, p.card, 0), rect(0, 0, 80, 100, dark, 0), rect(10, 12, 22, 6, on(47), 2), rect(10, 74, 54, 3, on(33), 1), rect(10, 81, 40, 3, on(20), 1));
      [bx, bw, by] = [88, 64, 20];
    } else if (style === 'floating') {
      n.push(rect(0, 0, 160, 100, tint, 0), rect(10, 8, 140, 84, p.card, 6, p.border), rect(10, 8, 70, 84, dark, 6), rect(20, 20, 22, 6, on(47), 2));
      [bx, bw, by] = [88, 54, 18];
    } else if (style === 'rail') {
      n.push(rect(0, 0, 160, 100, p.surface, 0), rect(46, 14, 68, 72, p.card, 3, p.border), rect(46, 14, 3, 72, brand, 1.5));
      [bx, bw, by] = [54, 54, 20];
    } else if (style === 'top') {
      n.push(rect(0, 0, 160, 100, p.surface, 0), rect(0, 0, 160, 12, p.card, 0, p.border), rect(6, 3.5, 14, 5, brand, 2), rect(40, 20, 80, 68, p.card, 3, p.border));
      [bx, bw, by] = [50, 60, 26];
    } else {
      n.push(rect(0, 0, 160, 100, p.surface, 0), rect(40, 10, 80, 80, p.card, 3, p.border));
      [bx, bw, by] = [50, 60, 17];
    }
    n.push(dot(bx + 6, by + 4, 4, brand), rect(bx, by + 12, bw * 0.6, 4, p.text, 1.5), rect(bx, by + 19, bw * 0.8, 2.4, p.soft, 1));
    const y = by + 28;
    if (screen === 'login') n.push(rect(bx, y, bw, 8, p.card, 2, p.border), rect(bx, y + 12, bw, 8, p.card, 2, p.border), rect(bx, y + 24, bw, 8, brand, 2));
    if (screen === 'forgot') n.push(rect(bx, y, bw, 8, p.card, 2, p.border), rect(bx, y + 12, bw, 8, brand, 2), rect(bx + bw * 0.2, y + 25, bw * 0.6, 2.4, p.soft, 1));
    if (screen === 'register')
      n.push(rect(bx, y - 3, bw, 7, p.card, 2, p.border), rect(bx, y + 7, bw, 7, p.card, 2, p.border), rect(bx, y + 17, bw, 7, p.card, 2, p.border), rect(bx, y + 27, bw, 7, brand, 2));
    if (screen === 'otp') {
      const w = (bw - 15) / 6;
      for (let k = 0; k < 6; k += 1) n.push(rect(bx + k * (w + 3), y, w, 10, p.card, 2, p.border));
      n.push(rect(bx, y + 16, bw, 8, brand, 2));
    }
    return n;
  }

  let body: ReactNode[];
  if (AUTH_SCREENS.includes(screen)) {
    body = auth();
  } else {
    const s = shell();
    const draw: Record<string, (c: Box) => ReactNode[]> = {
      list: (c) => table(c, false),
      users: (c) => table(c, true),
      form,
      dash,
      audit,
      profile,
    };
    body = [...s.nodes, ...draw[screen]!(s.c)];
  }

  return (
    <svg viewBox="0 0 160 100" role="img" aria-hidden="true" className={className} style={{ display: 'block', width: '100%', height: 'auto' }}>
      {body}
    </svg>
  );
}

export default StylePreview;
