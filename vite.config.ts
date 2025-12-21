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
      base: '/', // FIXED: Use absolute path for Cloudflare Pages
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
        minify: 'terser',
        rollupOptions: {
          output: {
            manualChunks: (id) => {
              // Split large dependencies into separate chunks
              if (id.includes('node_modules')) {
                if (id.includes('react') || id.includes('react-dom')) {
                  return 'vendor-react';
                }
                if (id.includes('@google/genai') || id.includes('openai') || id.includes('@anthropic-ai')) {
                  return 'vendor-ai';
                }
                if (id.includes('mermaid')) {
                  return 'vendor-mermaid';
                }
                return 'vendor';
              }
            },
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
            drop_debugger: true,
            pure_funcs: ['console.log', 'console.info', 'console.debug']
          },
          format: {
            comments: false
          }
        },
        chunkSizeWarningLimit: 1000,
      },
      optimizeDeps: {
        include: ['mermaid', 'buffer', 'react', 'react-dom'],
        esbuildOptions: {
          target: 'esnext'
        }
      }
    };
});