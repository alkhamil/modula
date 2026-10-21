import react from '@vitejs/plugin-react';

export default {
  plugins: [react()],
  base: './',
  logLevel: 'warn',
  build: {
    outDir: '/tmp/probe-dist',
    emptyOutDir: true,
    rollupOptions: {
      input: '/Users/nazmudinalkhamil/Documents/Projects/modula/probe-upload.html',
      output: {
        entryFileNames: 'probe.js',
        chunkFileNames: 'chunk.js',
        assetFileNames: '[name][extname]',
      },
    },
  },
};
