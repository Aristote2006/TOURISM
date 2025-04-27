import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
    proxy: {
      '/api': {
        target: 'http://localhost:5000',
        changeOrigin: true,
        secure: false,
      }
    }
  },
  plugins: [
    react({
      // Explicitly set JSX runtime to automatic
      jsxImportSource: 'react',
      jsxRuntime: 'automatic'
    }),
    mode === 'development' &&
    componentTagger(),
  ].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  // Build configuration for production
  build: {
    outDir: 'dist',
    minify: 'esbuild', // Use esbuild instead of terser
    sourcemap: false,
    // Chunk size warnings threshold (in kBs)
    chunkSizeWarningLimit: 1000,
    rollupOptions: {
      output: {
        // Ensure proper chunking
        manualChunks: {
          vendor: ['react', 'react-dom', 'react-router-dom'],
          ui: [
            '@/components/ui/button',
            '@/components/ui/card',
            '@/components/ui/avatar',
            '@/components/ui/form'
          ]
        }
      }
    }
  },
  // Optimize dependencies
  optimizeDeps: {
    include: ['react', 'react-dom', 'react-router-dom']
  }
}));
