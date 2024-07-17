import { defineConfig } from 'vite';
import vitePluginRequire from "vite-plugin-require";

export default defineConfig({
    base: '/web-video-conversion/',
    plugins: [
        vitePluginRequire.default()
    ],
    optimizeDeps: {
        exclude: ['@ffmpeg/ffmpeg', '@ffmpeg/util']
    }
});