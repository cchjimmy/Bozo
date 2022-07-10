/**
 * @param boundary { centerX, centerY, halfWidth, halfHeight }
 */
export default class Quadtree {
  constructor(boundary, capacity = 10, maxLevel = 10) {
    this.boundary = boundary;
    this.capacity = capacity;
    this.objects = [];
    this.nodes = [];
    this.level = 0;
    this.maxLevel = maxLevel;
  }

  /**
   * inserts an object into quadtree
   * @param {Object} object { centerX, centerY, halfWidth, halfHeight }
   * @returns 
   */
  insert(object) {
    if (this.level == 0 && !this.contains(object)) {
      return false;
    }

    // if subnodes exist, insert object to subnodes
    if (this.nodes.length) {
      let indices = this.getIndex(object);
      for (let i = 0; i < indices.length; i++) {
        this.nodes[indices[i]].insert(object);
      }
      return true;
    }

    this.objects.push(object);

    // if capacity is exceeded, push all objects to subnodes
    if (this.objects.length > this.capacity && this.level < this.maxLevel) {
      if (!this.nodes.length) {
        this.subdivide();
      }
      for (let i = 0; i < this.objects.length; i++) {
        let indices = this.getIndex(this.objects[i]);
        for (let k = 0; k < indices.length; k++) {
          this.nodes[indices[k]].insert(this.objects[i]);
        }
      }
      this.objects = [];
    }
    return true;
  }

  /**
   * returns an array of indices indicating the subnodes the object overlaps
   * @param {Object} object { centerX, centerY, halfWidth, halfHeight }
   * @returns an array
   */
  getIndex(object) {
    let indices = [];
    let startIsWest = object.centerX - object.halfWidth < this.boundary.centerX;
    let startIsNorth = object.centerY - object.halfHeight < this.boundary.centerY;
    let endIsEast = object.centerX + object.halfWidth > this.boundary.centerX;
    let endIsSouth = object.centerY + object.halfHeight > this.boundary.centerY;

    /**
     * 0|1
     * ---
     * 2|3
     */
    if (startIsNorth && startIsWest) {
      indices.push(0);
    }
    if (startIsNorth && endIsEast) {
      indices.push(1);
    }
    if (endIsSouth && startIsWest) {
      indices.push(2);
    }
    if (endIsSouth && endIsEast) {
      indices.push(3);
    }

    return indices;
  }

  /**
   * splits quadtree into 4 subnodes with identical area
   */
  subdivide() {
    let subHalfWidth = this.boundary.halfWidth / 2;
    let subHalfHeight = this.boundary.halfHeight / 2;

    /**
     * 0|1
     * ---
     * 2|3
     */
    this.nodes[0] = new Quadtree({ centerX: this.boundary.centerX - subHalfWidth, centerY: this.boundary.centerY - subHalfHeight, halfWidth: subHalfWidth, halfHeight: subHalfHeight }, this.capacity, this.maxLevel);
    this.nodes[1] = new Quadtree({ centerX: this.boundary.centerX + subHalfWidth, centerY: this.boundary.centerY - subHalfHeight, halfWidth: subHalfWidth, halfHeight: subHalfHeight }, this.capacity, this.maxLevel);
    this.nodes[2] = new Quadtree({ centerX: this.boundary.centerX - subHalfWidth, centerY: this.boundary.centerY + subHalfHeight, halfWidth: subHalfWidth, halfHeight: subHalfHeight }, this.capacity, this.maxLevel);
    this.nodes[3] = new Quadtree({ centerX: this.boundary.centerX + subHalfWidth, centerY: this.boundary.centerY + subHalfHeight, halfWidth: subHalfWidth, halfHeight: subHalfHeight }, this.capacity, this.maxLevel);

    for (let i = 0; i < this.nodes.length; i++) {
      this.nodes[i].level = this.level + 1;
    }
  }

  /**
   * return objects contained within boundaries that overlap with the query object
   * @param {Object} object { centerX, centerY, halfWidth, halfHeight }
   * @param {CanvasRenderingContext2D} context 
   * @returns an array
   */
  queryRange(object, context) {
    let found = [];

    if (context) {
      context.save();
      context.fillStyle = "red";
      context.fillRect(this.boundary.centerX - 2.5, this.boundary.centerY - 2.5, 5, 5);
      context.restore();
    }

    found = this.objects;

    if (this.nodes.length) {
      let indices = this.getIndex(object);
      for (let i = 0; i < indices.length; i++) {
        found = found.concat(this.nodes[indices[i]].queryRange(object, context));
      }
    }

    found = found.filter((object, index) => {
      return found.indexOf(object) >= index;
    });

    

    return found;
  }

  /**
   * clears everything within the quadtree
   */
  clear() {
    this.objects = [];
    if (this.nodes.length) {
      for (let i = 0; i < this.nodes.length; i++) {
        this.nodes[i].clear();
      }
    }
    this.nodes = [];
  }

  /**
   * checks if an object is contained within a boundary
   * @param {Object} object { centerX, centerY, halfWidth, halfHeight }
   * @returns boolean
   */
  contains(object) {
    return (object.centerX - object.halfWidth <= this.boundary.centerX + this.boundary.halfWidth &&
      object.centerX + object.halfWidth >= this.boundary.centerX - this.boundary.halfWidth &&
      object.centerY - object.halfHeight <= this.boundary.centerY + this.boundary.halfHeight &&
      object.centerY + object.halfHeight >= this.boundary.centerY - this.boundary.halfHeight)
  }

  /**
   * shows all elements within the quadtree and its boundaries
   * @param {CanvasRenderingContext2D} context 
   * @returns 
   */
  show(context) {
    if (context == undefined) {
      console.log("Please input a valid context");
      return;
    }

    context.save();
    // show objects
    context.fillStyle = "rgba(0, 255, 0, 0.5)";
    if (this.objects.length) {
      for (let i = 0; i < this.objects.length; i++) {
        context.fillRect(this.objects[i].centerX - this.objects[i].halfWidth, this.objects[i].centerY - this.objects[i].halfHeight, this.objects[i].halfWidth * 2, this.objects[i].halfHeight * 2);
      }
    }

    // show boundary
    context.strokeStyle = "white";
    context.strokeRect(this.boundary.centerX - this.boundary.halfWidth, this.boundary.centerY - this.boundary.halfHeight, this.boundary.halfWidth * 2, this.boundary.halfHeight * 2);

    // do the same for subnodes if exist
    if (this.nodes.length) {
      for (let i = 0; i < this.nodes.length; i++) {
        this.nodes[i].show(context);
      }
    }
    context.restore();
  }

  /**
   * relocates and resizes boundary
   * @param {Object} boundary { centerX, centerY, halfWidth, halfHeight }
   */
  newBoundary(boundary) {
    this.boundary = boundary;
  }
}
