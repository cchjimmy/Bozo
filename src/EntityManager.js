import uuidv4 from "./utilities/uuidv4.js";

export default class EntitiesManager {
  constructor() {
    this.entityPools = {};
    this.currentEntityPool = null;
  }

  /**
   * adds an entity into current entity pool
   * @param {Object} entityComponents
   */
  addEntity(entityComponents) {
    let id = uuidv4();
    let entity = { id };

    for (let component in entityComponents) {
      entity[component] = entityComponents[component];
    }

    this.currentEntityPool.entities[id] = entity;
    return entity;
  }

  /**
   * returns an array containing all entity ids
   * @returns an array
   */
  getEntityIds() {
    let ids = [];
    for (let entity in this.currentEntityPool) {
      ids.push(entity);
    }
    return ids;
  }
  
  addEntityPool(id) {
    let pool = { id, entities: {} }
    this.entityPools[id] = pool;
    return pool;
  }

  getEntityPools() {
    return this.entityPools;
  }
}
