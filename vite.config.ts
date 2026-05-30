import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  build: {
    // Output directly to Shopify theme's assets directory
    outDir: path.resolve(__dirname, './assets'),
    emptyOutDir: false, // Don't wipe other manual assets like css or fonts
    rollupOptions: {
      input: {
        main: path.resolve(__dirname, './src/main.tsx'),
      },
      output: {
        // Force Vite to bundle as a single JavaScript entry file named exactly pitwall-interactive.js
        entryFileNames: 'pitwall-interactive.js',
        assetFileNames: '[name].[ext]',
        chunkFileNames: '[name].js',
      },
    },
  },
});
