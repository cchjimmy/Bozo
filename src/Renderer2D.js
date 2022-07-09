import Canvas2D from "./utilities/Canvas2D.js";
import Quadtree from "./utilities/Quadtree.js";

export default class Renderer2D extends Canvas2D {
  constructor(options = {
    showFps: true,
    showQuadtree: true
  }) {
    super();
    this.options = {};
    if (options) {
      for (let option in options) {
        this.options[option] = options[option];
      }
    }
    this.qtree = new Quadtree({centerX: this.canvas.width / 2, centerY: this.canvas.height / 2, halfWidth: this.canvas.width / 2, halfHeight: this.canvas.height / 2});
    
    this.prevTime = performance.now();
    this.frames = 0;
    this.timeStep = 0;
  }
  
  setSize(width, height) {
    this.canvas.width = width;
    this.canvas.height = height;
    this.qtree.newBoundary({centerX: this.canvas.width / 2, centerY: this.canvas.height / 2, halfWidth: this.canvas.width / 2, halfHeight: this.canvas.height / 2});
  }
  
  draw(objects) {
    let start = performance.now();
    this.context.save();
    
    this.context.fillStyle = "white";
    
    this.clear();
    this.qtree.clear();
    
    for (let object in objects) {
      const currentObject = objects[object];
      
      this.qtree.insert({centerX: currentObject.position.x, centerY: currentObject.position.y, halfWidth: currentObject.size.x / 2, halfHeight: currentObject.size.y / 2});
    }
    
    const objectsToBeDrawn = this.qtree.queryRange(this.boundary);
    
    objectsToBeDrawn.forEach(object => {
      this.context.fillRect(object.centerX - object.halfWidth, object.centerY - object.halfHeight, object.halfWidth * 2, object.halfHeight *2);
    })
    
    if (this.options.showQuadtree) {
      this.qtree.show(this.context);
    }
    
    this.context.restore();
    
    this.frames++;
    if (start > this.prevTime + 1000) {
      this.timeStep = 1 / this.frames;
      this.prevTime = start;
      this.frames = 0;
    }
  }
  
  getTimeStep() {
    return this.timeStep;
  }
}
