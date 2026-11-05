/**
 * Tautan tambahan di bawah form login (mis. lupa password, daftar). Diisi
 * otomatis oleh pack auth lain lewat anchor di bawah.
 */
export interface AuthLink {
  to: string;
  labelKey: string;
  testId: string;
}

export const authLinks: AuthLink[] = [
  // __AUTH_LINKS__
];
