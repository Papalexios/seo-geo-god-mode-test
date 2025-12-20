import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

// ULTRA-SOTA Vite Configuration for Cloudflare Pages
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, '.', '');
  
  return {
    server: {
      port: 3000,
      host: '0.0.0.0',
      strictPort: false,
    },
    plugins: [
      react({
        // Enable Fast Refresh for optimal dev experience
        fastRefresh: true,
        babel: {
          plugins: [
            // Add any Babel plugins if needed
          ],
        },
      }),
    ],
    
    // CRITICAL: Use absolute root path for Cloudflare Pages
    base: '/',
    
    resolve: {
      alias: {
        buffer: 'buffer/',
        '@': path.resolve(__dirname, './src'),
        '@root': path.resolve(__dirname, './'),
      },
    },
    
    define: {
      // Proper environment variable handling
      'process.env': '{}',
      'global': 'globalThis',
      'process.env.NODE_ENV': JSON.stringify(mode),
      'process.env.API_KEY': JSON.stringify(env.GEMINI_API_KEY || ''),
      'process.env.GEMINI_API_KEY': JSON.stringify(env.GEMINI_API_KEY || ''),
      'process.env.ANTHROPIC_API_KEY': JSON.stringify(env.ANTHROPIC_API_KEY || ''),
      'process.env.OPENAI_API_KEY': JSON.stringify(env.OPENAI_API_KEY || ''),
    },
    
    build: {
      outDir: 'dist',
      target: 'esnext',
      assetsDir: 'assets',
      sourcemap: false, // Disable for production
      
      // Advanced minification with terser
      minify: 'terser',
      
      terserOptions: {
        compress: {
          drop_console: mode === 'production',
          drop_debugger: true,
          pure_funcs: mode === 'production' ? ['console.log', 'console.info'] : [],
        },
        format: {
          comments: false,
        },
      },
      
      // Optimized chunk splitting strategy
      rollupOptions: {
        output: {
          manualChunks(id) {
            // Vendor chunk for better caching
            if (id.includes('node_modules')) {
              if (id.includes('react') || id.includes('react-dom')) {
                return 'react-vendor';
              }
              if (id.includes('@anthropic') || id.includes('@google') || id.includes('openai')) {
                return 'ai-vendor';
              }
              return 'vendor';
            }
          },
          assetFileNames: 'assets/[name].[hash][extname]',
          chunkFileNames: 'assets/[name].[hash].js',
          entryFileNames: 'assets/[name].[hash].js',
        },
        onwarn(warning, warn) {
          // Suppress specific warnings
          if (warning.code === 'MODULE_LEVEL_DIRECTIVE') return;
          if (warning.code === 'UNRESOLVED_IMPORT' && warning.message.includes('mermaid')) return;
          warn(warning);
        },
      },
      
      // Chunk size warnings
      chunkSizeWarningLimit: 1000,
      
      // CSS code splitting
      cssCodeSplit: true,
      
      // Asset inlining threshold (10kb)
      assetsInlineLimit: 10240,
    },
    
    optimizeDeps: {
      include: [
        'react',
        'react-dom',
        'buffer',
        'mermaid',
      ],
      esbuildOptions: {
        target: 'esnext',
      },
    },
    
    // Preview server config (for testing production build)
    preview: {
      port: 4173,
      strictPort: false,
      host: true,
    },
  };
});
