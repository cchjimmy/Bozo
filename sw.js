// credit: https://www.youtube.com/watch?v=dXuvT4oollQ

const cachName = "cach-v1";
const resourcesToPrecache = [
  '/',
  'index.html',
  'style.css',
  'src/main.js',
  'src/Engine.js',
  'src/utilities/gui/GuiMaker.js',
  'src/utilities/gui/guiStyle.css',
  'https://kit.fontawesome.com/014dcd9a0e.js',
  // 'https://ka-f.fontawesome.com/releases/v6.2.0/css/free-v5-font-face.min.css?token=014dcd9a0e',
  'src/utilities/Canvas2D.js',
  'src/utilities/debounce.js',
  'src/utilities/ECS.js',
  'res/texture.png',
]

self.addEventListener("install", e => {
  e.waitUntil(
    caches.open(cachName).then(cache => {
      return cache.addAll(resourcesToPrecache);
    })
  );
});

self.addEventListener("fetch", e => {
  e.respondWith(caches.match(e.request).then(response => {
    return response || fetch(e.request);
  }));
});