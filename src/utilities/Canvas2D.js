export default class Canvas2D {
  constructor() {
    document.body.appendChild(document.createElement("canvas"));
    this.canvas = document.querySelector("canvas");
    this.context = this.canvas.getContext("2d");
  }

  /**
   * customise the size of canvas
   * @param {Number} width 
   * @param {Number} height 
   */
  setSize(width, height) {
    this.canvas.width = width;
    this.canvas.height = height;
  }

  /**
   * clears all pixels
   */
  clear() {
    this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
  }
}