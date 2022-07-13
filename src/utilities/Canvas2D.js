export default class Canvas2D {
  constructor() {
    document.body.appendChild(document.createElement("canvas"));
    this.canvas = document.querySelector("canvas");
    this.context = this.canvas.getContext("2d", {alpha:false});
  }

  /**
   * sets resolution of canvas
   * @param {number} width 
   * @param {number} height 
   */
  setResolution(width, height) {
    this.canvas.width = width;
    this.canvas.height = height;
  }

  /**
   * sets drawn size of canvas
   * @param {number} width 
   * @param {number} height 
   */
  setSize(width, height) {
    this.canvas.style.width = `${width}px`;
    this.canvas.style.height = `${height}px`;
  }

  /**
   * clears all pixels
   */
  clear() {
    this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
  }
}
