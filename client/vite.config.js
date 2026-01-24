import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";
import { fileURLToPath } from "url";
import compression from "vite-plugin-compression";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default defineConfig({
  plugins: [
    react(),
    // Gzip compression
    compression({
      algorithm: "gzip",
      ext: ".gz",
      threshold: 1024, // Only compress files larger than 1KB
    }),
    // Brotli compression (better compression ratio)
    compression({
      algorithm: "brotliCompress",
      ext: ".br",
      threshold: 1024,
    }),
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  build: {
    target: "es2020",
    cssCodeSplit: true,
    sourcemap: false,
    minify: "terser",
    terserOptions: {
      compress: {
        drop_console: true,
        drop_debugger: true,
      },
    },
    rollupOptions: {
      output: {
        manualChunks: (id) => {
          // Core React ecosystem - loaded immediately
          if (
            id.includes("node_modules/react/") ||
            id.includes("node_modules/react-dom/") ||
            id.includes("node_modules/react-router")
          ) {
            return "react-vendor";
          }

          // UI component primitives (Radix)
          if (id.includes("@radix-ui")) {
            return "radix-vendor";
          }

          // Query/state management
          if (id.includes("@tanstack/react-query")) {
            return "query-vendor";
          }

          // Animation libraries - lazy loaded with pages that use them
          if (id.includes("framer-motion") || id.includes("/motion/")) {
            return "animation-vendor";
          }

          // Charts - include with react-vendor to avoid forwardRef issues
          if (id.includes("recharts")) {
            return "react-vendor";
          }

          // D3 utilities - separate chunk
          if (id.includes("d3-")) {
            return "d3-vendor";
          }

          // Three.js - lazy loaded with landing page
          if (id.includes("three")) {
            return "three-vendor";
          }

          // i18n
          if (id.includes("i18next")) {
            return "i18n-vendor";
          }

          // Date utilities
          if (id.includes("date-fns")) {
            return "date-vendor";
          }

          // DnD kit - lazy loaded with AddShirt page
          if (id.includes("@dnd-kit")) {
            return "dnd-vendor";
          }
        },
      },
    },
    chunkSizeWarningLimit: 500,
  },
});
