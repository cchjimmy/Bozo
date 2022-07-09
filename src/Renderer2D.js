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
    this.timeStep = null;
    this.qtree = new Quadtree({centerX: this.canvas.width / 2, centerY: this.canvas.height / 2, halfWidth: this.canvas.width / 2, halfHeight: this.canvas.height / 2});
  }
  
  setSize(width, height) {
    this.canvas.width = width;
    this.canvas.height = height;
    this.qtree.newBoundary({centerX: this.canvas.width / 2, centerY: this.canvas.height / 2, halfWidth: this.canvas.width / 2, halfHeight: this.canvas.height / 2});
  }
  
  draw(objects) {
    this.context.save();
    let start = window.performance.now();
    this.context.fillStyle = "white";
    
    this.clear();
    this.qtree.clear();
    
    for (let object in objects) {
      let currentObject = objects[object];
      
      this.qtree.insert({centerX: currentObject.position.x, centerY: currentObject.position.y, halfWidth: currentObject.size.x / 2, halfHeight: currentObject.size.y / 2});
    }
    let objectsToBeDrawn = this.qtree.queryRange(this.boundary);
    
    objectsToBeDrawn.forEach(object => {
      this.context.fillRect(object.centerX - object.halfWidth, object.centerY - object.halfHeight, object.halfWidth * 2, object.halfHeight *2);
    })
    
    let end = window.performance.now();
    
    this.timeStep = (end - start)/1000;
    
    if (this.options.showFps) {
      this.context.strokeStyle = 'white';
      this.context.strokeText(`fps: ${(1/this.timeStep).toFixed(0)}`, 10, 10);
    }
    
    if (this.options.showQuadtree) {
      this.qtree.show(this.context);
    }
    this.context.restore();
  }
  
  getTimeStep() {
    return this.timeStep;
  }
}
