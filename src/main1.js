import Application from "./Application.js";

var app;

function init() {
  app = new Application();
  app.init();
  return;
}

function loop() {
  requestAnimationFrame(loop);
  app.run();
  return;
}

init();
loop();