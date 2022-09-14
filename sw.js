// credit: https://www.youtube.com/watch?v=dXuvT4oollQ

const cacheName = "cach-v1";
const resourcesToPrecache = [
  '/',
  'index.html',
  'style.css',
  'src/main.js',
  'src/Engine.js',
  'src/utilities/gui/GuiMaker.js',
  'src/utilities/gui/guiStyle.css',
  'src/utilities/Canvas2D.js',
  'src/utilities/debounce.js',
  'src/utilities/ECS.js',
  'res/texture.png',
]

self.addEventListener("install", e => {
  e.waitUntil(
    caches.open(cacheName).then(cache => {
      return cache.addAll(resourcesToPrecache);
    })
  );
});

self.addEventListener("fetch", e => {
  e.respondWith(caches.match(e.request).then(response => {
    return response || fetch(e.request);
  }));
});