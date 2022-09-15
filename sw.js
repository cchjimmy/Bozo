// credit: https://www.youtube.com/watch?v=dXuvT4oollQ

const cacheName = "cach-v1";
const resourcesToPrecache = [
  '/',
  'index.html',
  'style.css',
  'src/main.js',
  'src/menus.js',
  'src/utilities/Engine.js',
  'src/utilities/gui/GuiMaker.js',
  'src/utilities/gui/guiStyle.css',
  'src/utilities/Canvas2D.js',
  'src/utilities/debounce.js',
  'src/utilities/ECS.js',
  'src/utilities/randomRange.js',
  'src/utilities/uuidv4.js',
  'site.webmanifest',
  'res/icons/android-chrome-192x192.png',
  'res/icons/favicon-32x32.png',
  'entry.js'
]

self.addEventListener("install", e => {
  self.skipWaiting();
  e.waitUntil(
    caches.open(cacheName).then(cache => {
      return cache.addAll(resourcesToPrecache);
    })
  );
});

self.onactivate = (e) => {
  e.waitUntil(clients.claim());
}

self.addEventListener("fetch", e => {
  e.respondWith(caches.match(e.request).then(response => {
    return response || fetch(e.request);
  }));
});