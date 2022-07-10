import Canvas2D from "./utilities/Canvas2D.js";
import Quadtree from "./utilities/Quadtree.js";

export default class Renderer2D extends Canvas2D {
  constructor() {
    super();
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

  draw(object) {
    if (this.qtree.insert({ centerX: object.position.x, centerY: object.position.y, halfWidth: object.size.x / 2, halfHeight: object.size.y / 2 })) {
      this.context.fillStyle = object.color;
      this.context.fillRect(object.position.x - object.size.x / 2, object.position.y - object.size.y / 2, object.size.x, object.size.y);
    }
  }

  clear() {
    this.qtree.clear();
    this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
  }
}
