import uuidv4 from "./utilities/uuidv4.js";
import Vec2 from "./utilities/Vec2.js";

export default class EntitiesManager {
  constructor() {
    this.entityPools = {};
    this.currentEntityPool = null;
    this.components = {};
  }

  /**
   * adds an entity into current entity pool
   * @param {Object} components
   */
  createEntity(components) {
    let id = uuidv4();
    let entity = { id };
    this.currentEntityPool.entities[id] = entity;

    let comp = { 
      position: new Vec2(0, 0),
      size: new Vec2(1, 1),
      velocity: new Vec2(0, 0),
      color: "white",
      collider: false,
      camera: false
    };

    if (components) {
      for (let component in components) {
        comp[component] = components[component];
      }
    }
    
    for (let component in comp) {
      if (!this.components[component]) {
        this.components[component] = {};
      }
      this.components[component][id] = comp[component];
    }
    return entity;
  }

  /**
   * returns an array containing all entity ids in current entity pool
   * @returns an array
   */
  getEntityIds() {
    let ids = [];
    for (let entity in this.currentEntityPool.entities) {
      ids.push(entity);
    }
    return ids;
  }

  createEntityPool(id) {
    let pool = { id, entities: {} }
    this.entityPools[id] = pool;
    return pool;
  }

  getEntityPools() {
    return this.entityPools;
  }

  setCurrentEntityPool(id) {
    this.currentEntityPool = this.getEntityPools()[id];
  }
}
