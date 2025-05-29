import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vite.dev/config/
export default defineConfig({
    plugins: [react()],
    server: {
        // HMR is enabled by default
        hmr: true,
        watch: { usePolling: true },
    },
});
