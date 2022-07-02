import Canvas2D from "./utilities/Canvas2D.js";

export default class Renderer2D extends Canvas2D {
  constructor() {
    super();
  }

  draw() {
    for (let i = 0; i < images.length; i++) {
      for (let j = 0; j < transforms.length; j++) {
        let currentImage = images[i];
        let currentTransform = transforms[j];
        if (currentImage.id == currentTransform.id) {
          this.context.drawImage(currentImage.image, currentTransform.position.x - (currentTransform.size.x / 2), currentTransform.position.y - (currentTransform.size.y / 2), currentTransform.size.x, currentTransform.size.y);
        }
      }
    }
  }
}