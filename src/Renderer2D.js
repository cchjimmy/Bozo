import Canvas2D from "./utilities/Canvas2D.js";
import Quadtree from "./utilities/Quadtree.js";

export default class Renderer2D extends Canvas2D {
  constructor() {
    super();
    this.boundary = {centerX: this.canvas.width / 2, centerY: this.canvas.height / 2, halfWidth: this.canvas.width / 2, halfHeight: this.canvas.height / 2}
    this.qtree = new Quadtree(this.boundary);
  }

  draw(objects) {
    this.context.fillStyle = "white";
    
    this.qtree.clear();
    for (let object in objects) {
      let currentObject = objects[object];
      
      this.qtree.insert({centerX: currentObject.position.x, centerY: currentObject.position.y, halfWidth: currentObject.size.x / 2, halfHeight: currentObject.size.y / 2});
    }
    let objectsToBeDrawn = this.qtree.queryRange(this.boundary);
    
    objectsToBeDrawn.forEach(object => {
      this.context.fillRect(object.centerX - object.halfWidth, object.centerY - object.halfHeight, object.halfWidth * 2, object.halfHeight *2);
    })
  }
}