import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  
  return {
    plugins: [
      react({
        // Enable Fast Refresh for development
        fastRefresh: true,
        // Babel configuration for better compatibility
        babel: {
          plugins: [
            ['@babel/plugin-transform-react-jsx', { runtime: 'automatic' }]
          ]
        }
      })
    ],

    // CRITICAL FIX: Use absolute paths for Cloudflare Pages
    base: '/',

    // Resolve configuration
    resolve: {
      alias: {
        buffer: 'buffer/',
        '@': path.resolve(__dirname, './'),
        stream: 'stream-browserify',
        util: 'util/',
      },
    },

    // Define global constants
    define: {
      'process.env': JSON.stringify(env),
      'global': 'globalThis',
      '__APP_VERSION__': JSON.stringify(process.env.npm_package_version || '1.0.0'),
    },

    // Development server configuration
    server: {
      port: 3000,
      host: '0.0.0.0',
      strictPort: false,
      open: false,
    },

    // Build configuration optimized for Cloudflare Pages
    build: {
      outDir: 'dist',
      assetsDir: 'assets',
      // Target modern browsers for better performance
      target: ['es2020', 'edge88', 'firefox78', 'chrome87', 'safari14'],
      // Enable minification
      minify: 'terser',
      // Generate sourcemaps for debugging (can be disabled in production)
      sourcemap: false,
      // Chunk size warnings
      chunkSizeWarningLimit: 1000,
      // Terser options for optimal compression
      terserOptions: {
        compress: {
          drop_console: true,
          drop_debugger: true,
          pure_funcs: ['console.log', 'console.info', 'console.debug'],
          passes: 2,
        },
        mangle: {
          safari10: true,
        },
        format: {
          comments: false,
        },
      },
      // Rollup options for code splitting
      rollupOptions: {
        output: {
          // Manual chunk splitting for better caching
          manualChunks: (id) => {
            // Vendor chunks
            if (id.includes('node_modules')) {
              if (id.includes('react') || id.includes('react-dom')) {
                return 'vendor-react';
              }
              if (id.includes('@google/genai') || id.includes('openai') || id.includes('@anthropic')) {
                return 'vendor-ai';
              }
              if (id.includes('mermaid')) {
                return 'vendor-mermaid';
              }
              return 'vendor';
            }
          },
          // Asset naming
          assetFileNames: (assetInfo) => {
            const info = assetInfo.name.split('.');
            let extType = info[info.length - 1];
            if (/png|jpe?g|svg|gif|tiff|bmp|ico/i.test(extType)) {
              extType = 'images';
            } else if (/woff|woff2|eot|ttf|otf/i.test(extType)) {
              extType = 'fonts';
            }
            return `assets/${extType}/[name]-[hash][extname]`;
          },
          chunkFileNames: 'assets/js/[name]-[hash].js',
          entryFileNames: 'assets/js/[name]-[hash].js',
        },
        // Suppress warnings
        onwarn(warning, warn) {
          // Suppress specific warnings
          if (warning.code === 'MODULE_LEVEL_DIRECTIVE') return;
          if (warning.code === 'UNRESOLVED_IMPORT' && warning.message.includes('mermaid')) return;
          if (warning.code === 'THIS_IS_UNDEFINED') return;
          warn(warning);
        },
      },
    },

    // Dependency optimization
    optimizeDeps: {
      include: [
        'react',
        'react-dom',
        'react-dom/client',
        'buffer',
        'mermaid',
      ],
      exclude: [
        '@anthropic-ai/sdk',
        '@google/genai',
        'openai',
      ],
      esbuildOptions: {
        target: 'es2020',
        define: {
          global: 'globalThis',
        },
      },
    },

    // Preview server configuration
    preview: {
      port: 4173,
      host: '0.0.0.0',
    },
  };
});