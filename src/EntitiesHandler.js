import uuidv4 from "./uuidv4.js";

export default class EntitiesHandler {
  constructor() {
    this.entities = [];
  }

  /**
   * adds an entity into entity handler
   */
  addEntity() {
    this.entities.push({id: uuidv4()});
  }

  /**
   * returns an array of all entities
   * @returns an array
   */
  getEntities() {
    return this.entities;
  }
}
