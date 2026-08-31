import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    proxy: {
      '/predict/file': 'http://127.0.0.1:8000',
      '/predict/url': 'http://127.0.0.1:8000',
      '/predict/base64': 'http://127.0.0.1:8000',
      '/health': 'http://127.0.0.1:8000',
      '/version': 'http://127.0.0.1:8000',
      '/breeds': {
        target: 'http://127.0.0.1:8000',
        bypass: (req) => {
          if (req.headers.accept && req.headers.accept.includes('text/html')) {
            return '/index.html';
          }
        },
      },
    },
  },
});

