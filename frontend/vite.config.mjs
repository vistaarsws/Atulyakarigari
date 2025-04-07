import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  ssr: {
    noExternal: ["crypto"],
  },
  server: {
    host: true,
    port: 3000,
  },
  build: {
    rollupOptions: {
      onwarn(warning, warn) {
        // Log the warning to the console for debugging
        console.warn(warning.message);
        warn(warning); // Default warning handler
      },
    },
  },
});
