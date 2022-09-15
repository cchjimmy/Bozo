(function() {
  const filesToAppend = [
    'src/utilities/Canvas2D.js',
    'src/utilities/debounce.js',
    'src/utilities/ECS.js',
    'src/utilities/randomRange.js',
    'src/utilities/uuidv4.js',
    'src/utilities/gui/GuiMaker.js',
    'src/Engine.js',
    'src/menus.js',
    'src/main.js',
  ];

  for (let file in filesToAppend) {
    document.body.appendChild(Object.assign(document.createElement("script"), { src: filesToAppend[file] }));
  }
})();
