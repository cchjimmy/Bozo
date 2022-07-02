import ControllerComponent from "./entityComponents/ControllerComponent.js";
import ImageComponent from "./entityComponents/ImageComponent.js";
import TransformComponent from "./entityComponents/TransformComponent.js";
import uuidv4 from "./utilities/uuidv4.js";

export default class EntitiesHandler {
  constructor() {
    this.entities = {};
    this.IC = new ImageComponent;
    this.TC = new TransformComponent;
    this.CC = new ControllerComponent;
  }

  /**
   * adds an entity into entity handler
   * @param {*} param0 imageComponent: { image, size }, transformComponent: { position, rotation }, controllerComponent: boolean
   */
  addEntity({ imageComponent, transformComponent, controllerComponent }) {
    let id = uuidv4();
    let entity = {id: id};

    if (imageComponent) {
      imageComponent["id"] = id;
      this.IC.addImage(imageComponent);
      entity["imageComponent"] = this.IC.images[id];
    }

    if (transformComponent) {
      transformComponent["id"] = id;
      this.TC.addTransform(transformComponent);
      entity["transformComponent"] = this.TC.transforms[id];
    }

    if (controllerComponent) {
      this.CC.addController(entity);
      entity["controllerComponent"] = this.CC.entitiesWithController[id];
    }

    this.entities[id] = entity;
    return entity;
  }

  /**
   * returns an Object containing all entities
   * @returns an Object
   */
  getEntities() {
    return this.entities;
  }
}
