import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig(({ mode }) => {
    const env = loadEnv(mode, '.', '');
    return {
      server: {
        port: 3000,
        host: '0.0.0.0',
      },
      plugins: [react()],
      base: './', // CRITICAL: Use relative paths for Cloudflare Pages
      resolve: {
        alias: {
          buffer: 'buffer/',
          '@': path.resolve(__dirname, './'),
        },
      },
      define: {
        'process.env': '{}',
        'global': 'globalThis',
        'process.env.API_KEY': JSON.stringify(env.GEMINI_API_KEY || ''),
        'process.env.GEMINI_API_KEY': JSON.stringify(env.GEMINI_API_KEY || '')
      },
      build: {
        outDir: 'dist',
        target: 'esnext',
        assetsDir: 'assets',
        sourcemap: false,
        // Use terser for better compression, fallback to esbuild
        minify: 'terser',
        rollupOptions: {
          output: {
            manualChunks: undefined,
            assetFileNames: 'assets/[name].[hash][extname]',
            chunkFileNames: 'assets/[name].[hash].js',
            entryFileNames: 'assets/[name].[hash].js',
          },
          onwarn(warning, warn) {
            if (warning.code === 'MODULE_LEVEL_DIRECTIVE') return;
            if (warning.code === 'UNRESOLVED_IMPORT' && warning.message.includes('mermaid')) return;
            warn(warning);
          }
        },
        terserOptions: {
          compress: {
            drop_console: true,
            drop_debugger: true
          }
        }
      },
      optimizeDeps: {
        include: ['mermaid', 'buffer', 'react', 'react-dom']
      }
    };
});