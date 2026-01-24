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
          // React and all React-dependent libraries together
          if (
            id.includes("node_modules/react/") ||
            id.includes("node_modules/react-dom/") ||
            id.includes("node_modules/react-router") ||
            id.includes("@radix-ui") ||
            id.includes("@tanstack/react-query") ||
            id.includes("framer-motion") ||
            id.includes("/motion/") ||
            id.includes("recharts") ||
            id.includes("i18next") ||
            id.includes("@dnd-kit")
          ) {
            return "react-vendor";
          }

          // Independent libraries - no React dependency
          if (id.includes("d3-")) {
            return "d3-vendor";
          }

          if (id.includes("three")) {
            return "three-vendor";
          }

          if (id.includes("date-fns")) {
            return "date-vendor";
          }
        },
      },
    },
    chunkSizeWarningLimit: 500,
  },
});
