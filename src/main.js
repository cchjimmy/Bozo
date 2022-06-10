import Application from "./Application.js";

var app;

const init = () => {
  app = new Application();
  app.init();
  return;
}

init();