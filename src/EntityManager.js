import uuidv4 from "./utilities/uuidv4.js";

export default class EntitiesManager {
  constructor() {
    this.entities = {};
  }

  /**
   * adds an entity into entity handler
   * @param {Object} entityComponents
   */
  addEntity(entityComponents) {
    let id = uuidv4();
    let entity = { id };

    for (let component in entityComponents) {
      entity[component] = entityComponents[component];
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
