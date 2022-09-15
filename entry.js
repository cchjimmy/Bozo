(function () {
  const filesToAppend = [
    'src/utilities/Canvas2D.js',
    'src/utilities/ECS.js',
    'src/utilities/gui/GuiMaker.js',
    'src/utilities/debounce.js',
    'src/utilities/randomRange.js',
    'src/utilities/uuidv4.js',
    'src/utilities/Engine.js',
    'src/menus.js',
    'src/main.js',
  ];

  for (let file in filesToAppend) {
    document.body.appendChild(Object.assign(document.createElement("script"), { src: filesToAppend[file] }));
  }

  if (`serviceWorker` in navigator) {
    navigator.serviceWorker.register(`../sw.js`);
  }
})();
