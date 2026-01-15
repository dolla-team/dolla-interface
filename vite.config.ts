import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import path from "path";

export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: [
      { find: "@", replacement: path.resolve(__dirname, "src") },
      { find: "buffer", replacement: "buffer" },
      { find: "process", replacement: "process/browser" },
      { find: "stream", replacement: "stream-browserify" },
      { find: "util", replacement: "util" },
      { find: "https", replacement: "https-browserify" },
      { find: "http", replacement: "stream-http" }
    ]
  },
  define: {
    global: "globalThis"
  },
  optimizeDeps: {
    esbuildOptions: {
      define: {
        global: "globalThis"
      }
    },
    include: ["buffer", "process", "https-browserify", "stream-http"]
  },
  esbuild: {
    logLevel: "silent",
    // Skip TypeScript type checking during build
    logOverride: {
      "this-is-undefined-in-esm": "silent",
      "commonjs-variable-in-esm": "silent"
    }
  },
  // Disable TypeScript plugin type checking
  build: {
    // Skip TypeScript type checking during build
    target: "esnext",
    rollupOptions: {
      onwarn(warning, warn) {
        // Suppress TypeScript and common warnings
        if (warning.code === "UNRESOLVED_IMPORT") return;
        if (warning.code === "CIRCULAR_DEPENDENCY") return;
        if (warning.code === "EVAL") return;
        if (warning.message?.includes("TypeScript")) return;
        warn(warning);
      },
      external: []
    }
  },
  assetsInclude: ["**/*.wasm"],
  server: {
    host: "0.0.0.0",
    port: 5174
    // https: {
    //   // mkcert 192.168.130.20 localhost
    //   // mv 192.168.130.20+1.pem certs/
    //   // mv 192.168.130.20+1-key.pem certs/
    //   key: fs.readFileSync('./certs/192.168.31.155+1-key.pem'),
    //   cert: fs.readFileSync('./certs/192.168.31.155+1.pem'),
    // },
  }
});
