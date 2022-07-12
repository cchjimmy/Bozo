import Canvas2D from "./utilities/Canvas2D.js";
import Quadtree from "./utilities/Quadtree.js";

export default class Renderer2D extends Canvas2D {
  constructor() {
    super();

    this.qtree = new Quadtree({ centerX: this.canvas.width / 2, centerY: this.canvas.height / 2, halfWidth: this.canvas.width / 2, halfHeight: this.canvas.height / 2 });

    this.canvas.style.width = this.canvas.width;
    this.canvas.style.height = this.canvas.height;
    this.pixelDensity = 1;
    this.unitScale = 50;
  }

  /**
   * sets resolution of canvas
   * @param {Number} width 
   * @param {Number} height 
   */
  setResolution(width, height) {
    this.canvas.width = width * this.pixelDensity;
    this.canvas.height = height * this.pixelDensity;
    this.qtree.newBoundary({ centerX: width * this.pixelDensity / 2, centerY: height * this.pixelDensity / 2, halfWidth: width * this.pixelDensity / 2, halfHeight: height * this.pixelDensity / 2 });
  }

  draw(id, components) {
    let screenPosX = Math.floor((components.position[id].x) * this.unitScale + this.canvas.width / 2);
    let screenPosY = Math.floor((-components.position[id].y) * this.unitScale + this.canvas.height / 2);
    let screenSizeX = Math.floor(components.size[id].x * this.unitScale);
    let screenSizeY = Math.floor(components.size[id].y * this.unitScale);

    if (components.collider[id]) {
      this.qtree.insert({ centerX: screenPosX, centerY: screenPosY, halfWidth: screenSizeX / 2, halfHeight: screenSizeY / 2 })
    }
    this.context.save();
    this.context.fillStyle = components.color[id];
    this.context.fillRect(Math.floor(screenPosX - components.size[id].x / 2 * this.unitScale), Math.floor(screenPosY - components.size[id].y / 2 * this.unitScale), screenSizeX, screenSizeY);
    this.context.restore();
  }

  clear() {
    this.qtree.clear();
    this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
  }

  /**
   * 
   * @param {Number} pixelDensity css pixel : canvas pixel ratio
   */
  setPixelDensity(pixelDensity) {
    this.pixelDensity = pixelDensity;
    this.setUnitScale(this.unitScale);
    this.setResolution(Math.floor(this.canvas.width), Math.floor(this.canvas.height));
  }

  setUnitScale(scale) {
    this.unitScale = scale * this.pixelDensity;
  }
}
