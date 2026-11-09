const CACHE = "free26-v1.0.3";
const FILES = [
  "./",
  "./index.html",
  "./sw.js",
  "./README.md",
  "./manifest.webmanifest",
  "./apple-touch-icon.png",
  "./apple-touch-icon-v2.png",
  "./icon-192.png",
  "./icon-512.png",
  "./icon-192-v2.png",
  "./icon-512-v2.png",
  "./assets/anime.min.js",
  "./assets/motion.mjs",
  "./assets/anime-LICENSE.md",
  "./assets/motion-LICENSE.md",
  "./assets/batman.jpg",
  "./assets/bat-mark.jpg",
  "./assets/signal.jpg",
  "./assets/portrait.jpg"
];

self.addEventListener("install", event => {
  event.waitUntil(caches.open(CACHE).then(cache => cache.addAll(FILES)).then(() => self.skipWaiting()));
});

self.addEventListener("activate", event => {
  event.waitUntil(caches.keys().then(keys => Promise.all(keys.filter(key => key !== CACHE).map(key => caches.delete(key)))).then(() => self.clients.claim()));
});

self.addEventListener("fetch", event => {
  if (event.request.method !== "GET") return;
  event.respondWith(caches.match(event.request).then(cached => {
    if (cached) return cached;
    return fetch(event.request).then(response => {
      if (!response || !response.ok || new URL(event.request.url).origin !== self.location.origin) return response;
      const copy = response.clone();
      caches.open(CACHE).then(cache => cache.put(event.request, copy));
      return response;
    }).catch(() => event.request.mode === "navigate" ? caches.match("./index.html") : new Response("", { status: 503 }));
  }));
});
