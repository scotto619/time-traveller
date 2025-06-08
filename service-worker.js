const cacheName = "time-traveller-v1";
const contentToCache = [
  "/",
  "/index.html",
  "/styles/main.css",
  "/scripts/clockEngine.js",
  "/scripts/gameLogic.js",
  "/scripts/uiHandler.js",
  "/assets/images/icon-192.png",
  "/assets/images/icon-512.png"
];

self.addEventListener("install", (e) => {
  e.waitUntil(
    caches.open(cacheName).then((cache) => cache.addAll(contentToCache))
  );
});

self.addEventListener("fetch", (e) => {
  e.respondWith(
    caches.match(e.request).then((response) => response || fetch(e.request))
  );
});
