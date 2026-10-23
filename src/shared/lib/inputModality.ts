/**
 * Melacak modalitas input terakhir (keyboard / pointer) di `<html data-input>`.
 * Cincin fokus field teks (Figma "Focus indicator") hanya muncul untuk keyboard; klik mouse
 * cukup mengganti warna border (state selected / typing), seperti di Figma.
 */
export function initInputModality() {
  const root = document.documentElement;
  const set = (mode: 'keyboard' | 'pointer') => {
    if (root.dataset.input !== mode) root.dataset.input = mode;
  };
  window.addEventListener(
    'keydown',
    (e) => {
      if (e.key === 'Tab' || e.key.startsWith('Arrow')) set('keyboard');
    },
    true,
  );
  window.addEventListener('pointerdown', () => set('pointer'), true);
}
