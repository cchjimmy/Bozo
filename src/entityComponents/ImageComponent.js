export default class ImageComponent {
  constructor() {
    this.images = [];
  }

  addImage({ id, image, size }) {
    this.images.push({ id: id, image: image, size: size })
  }

  getImages() {
    return this.images;
  }
}