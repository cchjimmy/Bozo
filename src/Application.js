// import GuiHandler from "./gui/GuiHandler.js"

import Canvas2D from "./Canvas.js";
import EntitiesHandler from "./EntitiesHandler.js";

export default class Application {
  constructor() {
    // this.gui = new GuiHandler;
    this.canvas = new Canvas2D;
    this.canvas.expandCanvas();
    this.EH = new EntitiesHandler(this.canvas.context);
  }

  init() {
    if (this.canvas.context == undefined) {
      console.log("Cannot initialize canvas context 2d");
      return;
    } else {
      this.EH.addEntity();

      this.run();
    }
    return;
  }

  run() {
    requestAnimationFrame(() => {this.run();});
    this.canvas.background("blue");
    this.EH.update();


    return;
  }
}