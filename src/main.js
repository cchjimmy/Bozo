(function init() {
  const filesToAppend = [
    'src/Engine.js',
    'src/menus.js',
    'src/utilities/Canvas2D.js',
    'src/utilities/debounce.js',
    'src/utilities/ECS.js',
    'src/utilities/randomRange.js',
    'src/utilities/uuidv4.js',
    'src/utilities/gui/GuiMaker.js',
  ];

  for (let file in filesToAppend) {
    document.body.appendChild(Object.assign(document.createElement("script"), { src: filesToAppend[file] }));
  }

  const engine = new Engine;
  engine.init();

  if (`serviceWorker` in navigator) {
    navigator.serviceWorker.register(`../sw.js`);
  }
})();