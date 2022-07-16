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
   * @param {object} components
   */
  createEntity(components = {}) {
    let id = uuidv4();
    let entity = { id };
    this.currentEntityPool.entities[id] = entity;
    this.currentEntityPool.count++;

    let comp = {
      position: new Vec2(0, 0),
      size: new Vec2(1, 1),
      velocity: new Vec2(0, 0),
      color: "white",
      collider: false,
      camera: false
    }

    for (let component in components) {
      comp[component] = components[component];
    }

    for (let component in comp) {
    if (!this.components[this.currentEntityPool.id]) {
        this.components[this.currentEntityPool.id] = {}
      }
      if (!this.components[this.currentEntityPool.id][component]) {
        this.addComponent(this.currentEntityPool.id, component);
      }
      this.components[this.currentEntityPool.id][component][id] = comp[component];
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
    let pool = { id, entities: {}, count: 0 }
    this.entityPools[id] = pool;
    return pool;
  }

  getEntityPools() {
    return this.entityPools;
  }

  setCurrentEntityPool(id) {
    this.currentEntityPool = this.getEntityPools()[id];
  }

  addComponent(entityPoolId, component="") {
    this.components[entityPoolId][component] = {};
  }
}
