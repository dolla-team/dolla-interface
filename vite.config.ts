import fs from "fs";
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
      { find: "crypto", replacement: "crypto-browserify" },
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
  server: {
    host: '0.0.0.0',
    port: 5173,
    // https: {
    //   // mkcert 192.168.130.20 localhost
    //   // mv 192.168.130.20+1.pem certs/
    //   // mv 192.168.130.20+1-key.pem certs/
    //   key: fs.readFileSync('./certs/192.168.130.20+1-key.pem'),
    //   cert: fs.readFileSync('./certs/192.168.130.20+1.pem'),
    // },
  },
});
