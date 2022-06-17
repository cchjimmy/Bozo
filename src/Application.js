// import GuiHandler from "./gui/GuiHandler.js"

import Canvas2D from "./Canvas.js";
import EntitiesHandler from "./EntitiesHandler.js";
import Vec2 from "./Vec2.js";

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
      this.run();
    }
    return;
  }

  run() {
    requestAnimationFrame(() => {this.run();});
    this.canvas.background();
    this.EH.update();


    return;
  }
}