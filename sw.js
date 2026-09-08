// sw.js - simple service worker to cache engine assets for faster reload
const CACHE_NAME = "singularity-engine-cache-v1";
const ASSETS = [
  "/",
  "/index.html",
  "/styles.css",
  "/Renderer.js",
  "/WebGLContext.js",
  "/nebula.vert",
  "/nebula.frag",
  "/star.vert",
  "/star.frag",
  "/preloadManifest.json"
];

self.addEventListener("install", (e) => {
  e.waitUntil(caches.open(CACHE_NAME).then((cache) => cache.addAll(ASSETS)));
  self.skipWaiting();
});

self.addEventListener("activate", (e) => {
  e.waitUntil(self.clients.claim());
});

self.addEventListener("fetch", (e) => {
  const url = new URL(e.request.url);
  // serve from cache first
  e.respondWith(caches.match(e.request).then((r) => r || fetch(e.request)));
});
