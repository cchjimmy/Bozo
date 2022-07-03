import Canvas2D from "./utilities/Canvas2D.js"
import uuidv4 from "./utilities/uuidv4.js";

export default class Renderer2D extends Canvas2D {
  constructor() {
    super();
    this.images = {};
    this.textureCoordinates = {};
  }

  separateTextureAtlas(image, cellWidth, cellHeight) {
    let imageId = uuidv4();
    let sourceCoordinates = [];
    this.images[imageId] = { imageId: imageId, textureAtlas: image };

    for (let y = 0; y < image.height; y += cellHeight) {
      for (let x = 0; x < image.width; x += cellWidth) {
        sourceCoordinates.push([x, y, x + cellWidth, y + cellHeight]);
      }
    }

    this.textureCoordinates[imageId] = { imageId: imageId, sourceCoordinates: sourceCoordinates };

    return this.textureCoordinates[imageId];
  }

  draw() {
  }
}