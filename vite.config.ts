import { defineConfig } from 'vite';

export default defineConfig({
  build: {
    minify: false,
    chunkSizeWarningLimit: 8000
  }
});
