import ControllerComponent from "./entityComponents/ControllerComponent.js";
import ImageComponent from "./entityComponents/ImageComponent.js";
import TransformComponent from "./entityComponents/TransformComponent.js";
import uuidv4 from "./uuidv4.js";

export default class EntitiesHandler {
  constructor() {
    this.entities = [];
    this.IC = new ImageComponent;
    this.TC = new TransformComponent;
    this.CC = new ControllerComponent;
  }

  /**
   * adds an entity into entity handler
   * @param {*} param0 imageComponent: { image, size }, transformComponent: { position, rotation }, controllerComponent: boolean
   */
  addEntity({ imageComponent, transformComponent, controllerComponent }) {
    let entity = {id: uuidv4()};

    if (imageComponent) {
      this.IC.addImage({ id: entity.id, image: imageComponent.image, size: imageComponent.size});
    }

    if (transformComponent) {
      this.TC.addTransform({ id: entity.id, position: transformComponent.position, rotation: transformComponent.rotation});
    }

    if (controllerComponent) {
      this.CC.addController(entity);
    }

    this.entities.push(entity);
    return entity;
  }

  /**
   * returns an array of all entities
   * @returns an array
   */
  getEntities() {
    return this.entities;
  }
}
