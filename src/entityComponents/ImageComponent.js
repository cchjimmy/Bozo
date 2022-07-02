export default class ImageComponent {
  constructor() {
    this.images = {};
  }

  addImage({ id, image, size }) {
    if (!image) {
      image = new Image(size.x, size.y);
      image.src = "../../res/gun.png";
    }
    this.images[id] = { id: id, image: image, size: size };
  }

  getImages() {
    return this.images;
  }
}