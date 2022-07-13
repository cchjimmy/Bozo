import Canvas2D from "./utilities/Canvas2D.js";
import Quadtree from "./utilities/Quadtree.js";

export default class Renderer2D extends Canvas2D {
  constructor() {
    super();

    this.qtree = new Quadtree({ centerX: this.canvas.width / 2, centerY: this.canvas.height / 2, halfWidth: this.canvas.width / 2, halfHeight: this.canvas.height / 2 });

    this.pixelDensity = 1;
    this.unitScale = 50;

    // this.webWorker = new Worker("./src/R2DWebWorker.js");
  }

  /**
   * sets resolution of canvas
   * @param {number} width 
   * @param {number} height 
   */
  setResolution(width, height) {
    this.canvas.width = width * this.pixelDensity;
    this.canvas.height = height * this.pixelDensity;
    this.qtree.newBoundary({ centerX: width * this.pixelDensity / 2, centerY: height * this.pixelDensity / 2, halfWidth: width * this.pixelDensity / 2, halfHeight: height * this.pixelDensity / 2 });
  }

  draw(transforms, colors) {
    for (let i = 0; i < transforms.length; i++) {
      const screenPosX = transforms[i][0];
      const screenPosY = transforms[i][1];
      const screenSizeX = transforms[i][2];
      const screenSizeY = transforms[i][3];

      this.context.save();
      this.context.fillStyle = colors[i];
      this.context.fillRect(screenPosX, screenPosY, screenSizeX, screenSizeY);
      this.context.restore();
    }
  }

  clear() {
    this.qtree.clear();
    this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
  }

  /**
   * 
   * @param {number} pixelDensity css pixel : canvas pixel ratio
   */
  setPixelDensity(pixelDensity) {
    this.pixelDensity = pixelDensity;
    this.setUnitScale(this.unitScale);
    this.setResolution(Math.floor(this.canvas.width), Math.floor(this.canvas.height));
  }

  /**
   * 
   * @param {number} scale pixels : unit scale ratio
   */
  setUnitScale(scale) {
    this.unitScale = scale * this.pixelDensity;
  }
}
