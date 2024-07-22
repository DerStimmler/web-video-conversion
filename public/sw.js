const cacheName = "web-video-conversion-v1";
const cacheAssets = [
    ".",
    "index.html"
];

self.addEventListener("install", (e) => {
    e.waitUntil(
        (async () => {
            const cache = await caches.open(cacheName);
            await cache.addAll(cacheAssets);
        })(),
    );
});

self.addEventListener("activate", (e) => {
    e.waitUntil(
        caches.keys().then((keyList) => {
            return Promise.all(
                keyList.map((key) => {
                    if (key === cacheName) {
                        return;
                    }
                    return caches.delete(key);
                }),
            );
        }),
    );
});

self.addEventListener("fetch", (e) => {

    // only GET requests etc
    if (e.request.method !== 'GET') return;

    const url = new URL(e.request.url);

    // only http requests
    if (!url.protocol.startsWith('http')) return;

    e.respondWith(
        (async () => {
            const cachedResponse = await caches.match(e.request);
            if (cachedResponse) {
                return cachedResponse;
            }

            const response = await fetch(e.request);
            const cache = await caches.open(cacheName);
            cache.put(e.request, response.clone());
            return response;
        })(),
    );
});