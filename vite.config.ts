import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import { defineConfig } from 'vite';
import { projectRunnerPlugin } from './scripts/dev/projectRunner.ts';
import { moduleWriterPlugin } from './vite-plugin/moduleWriter.ts';

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss(), moduleWriterPlugin(), projectRunnerPlugin()],
  server: {
    // CORS dimatikan: endpoint dev (`/__api/*`) dan token sesi project-runner hanya boleh dibaca halaman same-origin.
    cors: false,
    // Project hasil wizard yang dijalankan lokal ditulis ke .local-projects/: jangan dipantau watcher Modula.
    watch: { ignored: ['**/.local-projects/**'] },
  },
});
