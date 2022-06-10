export default class Canvas2D {
  constructor() {
    document.body.appendChild(document.createElement("canvas"));
    this.canvas = document.querySelector("canvas");
    this.context = this.canvas.getContext("2d");
  }

  expandCanvas() {
    this.canvas.width = innerWidth;
    this.canvas.height = innerHeight;
  }

  setSize(width, height) {
    this.canvas.width = width;
    this.canvas.height = height;
  }

  background(color) {
    this.context.save();
    if (color != undefined) {
      this.context.fillStyle = color;
    }
    this.context.fillRect(0, 0, this.canvas.width, this.canvas.height);
    this.context.restore();
  }
}