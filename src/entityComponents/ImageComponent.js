export default class ImageComponent {
  constructor() {
    this.images = {};
  }

  addImage({ id, imageId, size }) {
    if (!imageId) {
      imageId = 0;
    }
    this.images[id] = { imageId, size };
  }

  getImages() {
    return this.images;
  }
}
