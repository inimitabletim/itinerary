import { defineConfig } from 'vite';

export default defineConfig({
    // Project root directory
    root: './',

    // Base public path (adjust if deploying to subdirectory)
    base: './',

    // Development server configuration
    server: {
        port: 3000,
        open: true,
        host: true
    },

    // Preview server configuration
    preview: {
        port: 4173,
        open: true
    },

    // Build configuration
    build: {
        // Output directory
        outDir: 'dist',

        // Assets directory within outDir
        assetsDir: 'assets',

        // Minification
        minify: 'terser',
        cssMinify: true,

        // Source maps for debugging
        sourcemap: false,

        // Rollup options
        rollupOptions: {
            input: {
                main: './index.html'
            },
            output: {
                // Chunk file naming
                chunkFileNames: 'assets/js/[name]-[hash].js',
                entryFileNames: 'assets/js/[name]-[hash].js',
                assetFileNames: (assetInfo) => {
                    const info = assetInfo.name.split('.');
                    const ext = info[info.length - 1];

                    if (/css/i.test(ext)) {
                        return 'assets/css/[name]-[hash][extname]';
                    }

                    if (/png|jpe?g|svg|gif|tiff|bmp|ico/i.test(ext)) {
                        return 'assets/images/[name]-[hash][extname]';
                    }

                    if (/woff2?|eot|ttf|otf/i.test(ext)) {
                        return 'assets/fonts/[name]-[hash][extname]';
                    }

                    return 'assets/[name]-[hash][extname]';
                }
            }
        },

        // Terser options
        terserOptions: {
            compress: {
                drop_console: true,
                drop_debugger: true
            }
        }
    },

    // Resolve configuration
    resolve: {
        alias: {
            '@': '/src'
        }
    },

    // CSS configuration
    css: {
        devSourcemap: true
    }
});
