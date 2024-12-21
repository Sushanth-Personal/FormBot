import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: process.env.PORT || 4173, // Bind to Render-provided port or fallback to 4173
    host: true, // Expose the app to external IPs
    proxy: {
      '/api': {
        target: 'https://formbot-backend-scps.onrender.com', // Backend API URL
        changeOrigin: true,
        secure: false, // Set to true if your backend uses HTTPS
      },
    },
  },
  build: {
    outDir: 'dist', // Ensure build output goes into the 'dist' folder
    rollupOptions: {
      output: {
        assetFileNames: 'assets/[name].[hash][extname]', // Optimize asset bundling
      },
    },
  },
  base: '/', // Update if app is hosted in a subdirectory
});
