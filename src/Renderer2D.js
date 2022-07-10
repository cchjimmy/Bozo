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

  draw(components, id) {
    if (this.qtree.insert({ centerX: components.position[id].x, centerY: components.position[id].y, halfWidth: components.size[id].x/2, halfHeight: components.size[id].y/2 })) {
      this.context.fillStyle = components.color[id];
      this.context.fillRect(components.position[id].x - components.size[id].x/2, components.position[id].y - components.size[id].y/2, components.size[id].x, components.size[id].y);
    }
  }

  clear() {
    this.qtree.clear();
    this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
  }
}
