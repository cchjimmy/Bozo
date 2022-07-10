import Canvas2D from "./utilities/Canvas2D.js";
import Quadtree from "./utilities/Quadtree.js";

export default class Renderer2D extends Canvas2D {
  constructor(options = {
    showFps: true,
    showQuadtree: false
  }) {
    super();
    this.options = {};
    if (options) {
      for (let option in options) {
        this.options[option] = options[option];
      }
    }
    this.qtree = new Quadtree({ centerX: this.canvas.width / 2, centerY: this.canvas.height / 2, halfWidth: this.canvas.width / 2, halfHeight: this.canvas.height / 2 });

    this.prevTime = performance.now();
    this.frames = 0;
    this.timeStep = 1 / 60;
  }

  setSize(width, height) {
    this.canvas.width = width;
    this.canvas.height = height;
    this.qtree.newBoundary({ centerX: this.canvas.width / 2, centerY: this.canvas.height / 2, halfWidth: this.canvas.width / 2, halfHeight: this.canvas.height / 2 });
  }

  draw(objects) {
    const start = performance.now();
    this.context.save();

    this.clear();
    this.qtree.clear();

    for (let object in objects) {
      let obj = { centerX: objects[object].position.x, centerY: objects[object].position.y, halfWidth: objects[object].size.x / 2, halfHeight: objects[object].size.y / 2, color: objects[object].color };
      if (this.qtree.insert(obj)) {
        this.context.fillStyle = obj.color;
        this.context.fillRect(obj.centerX - obj.halfWidth, obj.centerY - obj.halfHeight, obj.halfWidth * 2, obj.halfHeight * 2);
      }
    }

    if (this.options.showQuadtree) {
      this.qtree.show(this.context);
    }

    if (this.options.showFps) {
      this.context.strokeStyle = "white";
      this.context.strokeText(`fps: ${(1 / this.timeStep).toFixed(0)}`, 10, 10)
    }

    this.context.restore();

    this.frames++;
    if (start >= this.prevTime + 1000) {
      this.timeStep = 1 / (this.frames * 1000 / (start - this.prevTime));
      this.prevTime = start;
      this.frames = 0;
    }
  }

  getTimeStep() {
    return this.timeStep;
  }
}
