import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import vercel from 'vite-plugin-vercel';
// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(),vercel()],
  server: {
    port: process.env.PORT || 4173, // Bind to the Render-provided port, fallback to 4173
    host: true, // Expose the app to external IPs
  },
  build: {
    outDir: 'dist', // Ensure that build output goes into the 'dist' folder
  },
});