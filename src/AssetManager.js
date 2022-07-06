import uuidv4 from "./utilities/uuidv4.js";

export default class AssetManager {
  constructor() {
    this.images = {};
    this.textureCoordinates = {};
  }

  separateTextureAtlas(image, cellWidth, cellHeight) {
    let sourceCoordinates = [];
    let img = this.addImage(image);

    for (let y = 0; y < img.image.height; y += cellHeight) {
      for (let x = 0; x < img.image.width; x += cellWidth) {
        sourceCoordinates.push([x, y, x + cellWidth, y + cellHeight]);
      }
    }

    this.textureCoordinates[img.id] = { id: img.id, sourceCoordinates };

    console.log(this.getImageIds());
    return { id: img.id, sourceCoordinates };
  }

  addImage(image) {
    if (typeof image == []) {
      let images = [];
      for (let i = 0; i < image.length; i++) {
        let id = uuidv4();

        this.images[id] = { id, image: image[i] };
        images.push({ id, image: image[i] })

      }
      return images;
    }

    let id = uuidv4();
    this.images[id] = { id, image };
    return { id, image };
  }

  getImageIds() {
    let ids = [];
    for (let image in this.images) {
      ids.push(image);
    }
    return ids;
  }
}
