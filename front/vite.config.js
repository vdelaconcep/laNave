import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';
import path from 'path';

export default defineConfig({
  resolve: {
    // Para definir rutas absolutas en las importaciones de archivos
    alias: {
      '@': path.resolve(__dirname, 'src'),
    },
  },

  plugins: [react()],

  build: {
    outDir: 'dist'
  },
  server: {
    historyApiFallback: true
  },
  preview: {
    historyApiFallback: true
  }
});
