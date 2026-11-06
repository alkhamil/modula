import type { PreviewScreen } from './components/StylePreview';

export type ModuleGroup = 'access' | 'users' | 'data' | 'system';

/** Kartu "Modul dan fitur" di wizard; satu kartu bisa memasang beberapa pack. */
export interface ModuleCardDef {
  id: string;
  group: ModuleGroup;
  /** Id pack yang dipasang kartu ini (urutan penerapan diatur `order.json`). */
  packIds: string[];
  /** Gambar contoh yang diikutkan gaya terpilih. */
  thumb: PreviewScreen;
  /** Wajib: selalu ikut, tidak bisa dimatikan. */
  locked?: boolean;
  /** Terpilih awal (default). */
  defaultOn?: boolean;
  /** `false` = tampil "Segera hadir" dan tidak bisa dipilih. */
  ready: boolean;
}

export const MODULE_GROUPS: ModuleGroup[] = ['access', 'users', 'data', 'system'];

export const MODULE_CARDS: ModuleCardDef[] = [
  { id: 'login', group: 'access', packIds: ['login', 'logout'], thumb: 'login', locked: true, defaultOn: true, ready: true },
  { id: 'forgot', group: 'access', packIds: ['forgot-password'], thumb: 'forgot', ready: true },
  { id: 'register', group: 'access', packIds: ['register'], thumb: 'register', ready: true },
  { id: 'otp', group: 'access', packIds: ['two-factor'], thumb: 'otp', ready: true },
  { id: 'users', group: 'users', packIds: ['user'], thumb: 'users', defaultOn: true, ready: true },
  { id: 'roles', group: 'users', packIds: ['role'], thumb: 'list', defaultOn: true, ready: true },
  { id: 'exampleSingle', group: 'data', packIds: ['example-flat'], thumb: 'list', defaultOn: true, ready: true },
  { id: 'exampleNested', group: 'data', packIds: ['example-nested'], thumb: 'list', defaultOn: true, ready: true },
  { id: 'dashboard', group: 'data', packIds: [], thumb: 'dash', ready: false },
  { id: 'audit', group: 'data', packIds: [], thumb: 'audit', ready: false },
  { id: 'profile', group: 'data', packIds: [], thumb: 'profile', ready: false },
  { id: 'notifications', group: 'data', packIds: [], thumb: 'audit', ready: false },
  { id: 'generator', group: 'system', packIds: ['generator'], thumb: 'form', locked: true, defaultOn: true, ready: true },
];

/** Id pack dari kartu terpilih (kartu wajib selalu ikut). */
export function packIdsFor(selectedCards: string[]): string[] {
  const ids = new Set<string>();
  for (const card of MODULE_CARDS) {
    if (!card.ready) continue;
    if (card.locked || selectedCards.includes(card.id)) card.packIds.forEach((id) => ids.add(id));
  }
  return [...ids];
}

export function defaultCards(): string[] {
  return MODULE_CARDS.filter((card) => card.ready && (card.locked || card.defaultOn)).map((card) => card.id);
}
