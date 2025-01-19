// vite.config.ts is the configuration file for Vite. It is used to configure the Vite development server and build process.
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  base: '/arda/', // Base path for production deployment
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:3000', // where your Node server runs
        changeOrigin: true
      }
    }
  },
  plugins: [react()],
  optimizeDeps: {
    exclude: ['lucide-react'],
  },
});
