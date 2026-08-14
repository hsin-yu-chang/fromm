const CACHE_NAME = "chat-v1";

const FILES_TO_CACHE = [
  "./",
  "./index.html",
  "./style.css",
  "./main.js",
  "./chat.js",
  "./fake-scrollbar.js",
  "./messages/sw_universe.json",
  "./manifest.json",
  "./font/Shaonv.woff2",
  "./icons/icon-512-modified.png",

];

self.addEventListener("install", event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(FILES_TO_CACHE))
  );
  self.skipWaiting();
});

self.addEventListener("activate", event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(
        keys
          .filter(key => key !== CACHE_NAME)
          .map(key => caches.delete(key))
      )
    )
  );
  self.clients.claim();
});

self.addEventListener("fetch", event => {
  event.respondWith(
    caches.match(event.request).then(cached => {
      return cached || fetch(event.request);
    })
  );
});