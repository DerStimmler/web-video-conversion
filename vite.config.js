import { defineConfig } from 'vite';
import vitePluginRequire from "vite-plugin-require";

export default defineConfig({
    plugins: [
        vitePluginRequire.default()
    ],
});