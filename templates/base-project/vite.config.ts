import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
// __VITE_IMPORTS__

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    // __VITE_PLUGINS__
  ],
});
