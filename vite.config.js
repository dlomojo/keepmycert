import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { resolve } from 'path'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react()
  ],
  resolve: {
    alias: {
      // Set up path aliases for better imports
      '@': resolve(__dirname, './src'),
      'components': resolve(__dirname, './src/components'),
      'pages': resolve(__dirname, './src/pages'),
      'layouts': resolve(__dirname, './src/layouts'),
      'hooks': resolve(__dirname, './src/hooks'),
      'contexts': resolve(__dirname, './src/contexts'),
      'services': resolve(__dirname, './src/services'),
      'utils': resolve(__dirname, './src/utils'),
      'config': resolve(__dirname, './src/config'),
      'assets': resolve(__dirname, './src/assets'),
      'theme': resolve(__dirname, './src/theme'),
      'examples': resolve(__dirname, './src/examples'),
      'routes': resolve(__dirname, './src/routes.js'),
      'footer.routes': resolve(__dirname, './src/footer.routes.js')
    }
  },
  build: {
    outDir: 'dist',
    sourcemap: true,
    chunkSizeWarningLimit: 1600,
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom', 'react-router-dom'],
          firebase: ['firebase/app', 'firebase/auth', 'firebase/firestore', 'firebase/storage'],
          mui: ['@mui/material', '@mui/icons-material', '@emotion/react', '@emotion/styled']
        }
      }
    }
  },
  server: {
    port: 3000,
    open: true,
    host: true
  }
})