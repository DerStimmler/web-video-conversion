import { defineConfig } from 'vite';
import vitePluginRequire from "vite-plugin-require";

function crossOriginIsolationMiddleware(_, response, next) {
    response.setHeader("Cross-Origin-Opener-Policy", "same-origin");
    response.setHeader("Cross-Origin-Embedder-Policy", "require-corp");
    next();
}

const crossOriginIsolation = {
    name: 'cross-origin-isolation',
    configureServer: server => { server.middlewares.use(crossOriginIsolationMiddleware); },
    configurePreviewServer: server => { server.middlewares.use(crossOriginIsolationMiddleware); },
};

export default defineConfig({
    plugins: [
        vitePluginRequire.default(),
        crossOriginIsolation
    ],
    optimizeDeps: {
        exclude: ['@ffmpeg/ffmpeg', '@ffmpeg/util']
    }
});

