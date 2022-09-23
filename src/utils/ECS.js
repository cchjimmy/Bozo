// credit: http://vasir.net/blog/game-development/how-to-build-entity-component-system-in-javascript
// credit: https://github.com/ecsyjs/ecsy

export default class ECS {
  constructor() {
    this._worlds = [];
    this._activeWorld;
    this._registeredSystems = [];
    this._registeredComponents = {};
    this._assemblages = [];
  }

  set setActiveWorld(world) {
    this._activeWorld = world;
  }

  get activeWorld() {
    return this._activeWorld;
  }

  get systems() {
    return this._registeredSystems;
  }

  get components() {
    return this._registeredComponents;
  }

  get assemblages() {
    return this._assemblages;
  }

  get worlds() {
    return this._worlds;
  }

  createWorld(isEnabled = true) {
    const world = new this.World(this);
    isEnabled ? world.enable() : world.disable();
    this.worlds.push(world);
    this._activeWorld = world;
    return world;
  }

  /**
   * removes a world
   * @param {string} id 
   * @returns the removed world
   */
  removeWorld(id) {
    if (this._activeWorld?.id === id) this._activeWorld = null;
    for (let i = 0; i < this.worlds.length; i++) {
      if (this.worlds[i].id !== id) continue;
      return this.worlds.splice(i, 1);
    }
  }

  update(param) {
    this._activeWorld?.update(param);
  }

  registerComponent(component) {
    this._registeredComponents[component.title] = component.data;
  }

  registerSystem(system) {
    if (doesObjectExist(system, this._registeredSystems) || !system.prototype.isSystem) return this;
    this._registeredSystems.push(system);
    return this;
  }

  unregisterSystem(system) {
    if (!doesObjectExist(system, this._registeredSystems)) return;
    return this._registeredSystems.splice(this._registeredSystems.indexOf(system), 1);
  }
}

ECS.prototype.System = class System {
  constructor(world) {
    this.world = world;
    this.queries = {};
    this._isEnabled = false;
    this._isReady = false;
  }

  query() {
    this._isReady = false;
    for (let property in this.constructor.queries) {
      this.queries[property] = this.world.query(this.constructor.queries[property]);
    }
    this._isReady = true;
  }

  get isReady() {
    return this._isReady;
  }

  get isEnabled() {
    return this._isEnabled;
  }

  enable() {
    this._isEnabled = true;
  }

  disable() {
    this._isEnabled = false;
  }

  update() { }
}

ECS.prototype.System.prototype.isSystem = true;

ECS.prototype.Entity = class Entity {
  constructor(ecs, world) {
    this._id = uuidv4();
    this._components = {};
    this.ecs = ecs;
    this.world = world;
  }

  get id() {
    return this._id;
  }

  addComponent(component) {
    if (this.hasComponent(component)) return this;
    this._components.push(new component);
    debounce({ context: this.world, func: this.world.newSystemsQuery });
    return this;
  }

  removeComponent(component) {
    if (!this.hasComponent(component)) return this;
    this._components.splice(this._components.indexOf(this._components.find(comp => comp instanceof component)), 1)
    debounce({ context: this.world, func: this.world.newSystemsQuery });
    return this;
  }

  hasComponent(component) {
    // credit: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Conditional_Operator
    return doesObjectExist(component, this._components);
  }

  hasAllComponents(components = []) {
    for (let i = 0; i < components.length; i++) {
      if (!this.hasComponent(components[i])) return false;
    }
    return true;
  }

  getComponent(component, clone = false) {
    if (!this.hasComponent(component)) return;
    let comp = this._components.find(comp => comp instanceof component);
    return clone ? comp.clone() : comp;
  }

  clone() {
    let clone = new Entity(this.ecs, this.world);
    for (let i = 0; i < this._components.length; i++) {
      
      clone._components.push(component);
    }
    return clone;
  }
}

ECS.prototype.World = class World {
  constructor(ecs) {
    this.ecs = ecs;
    this._id = uuidv4();
    this._title = "New world";
    this._systems = [];
    this._entities = [];

    this._isEnabled = true;

    // this.state;
  }

  // saveState() {
  //   let final = [];
  //   for (let entity in this.entities) {
  //     final.push({ id: this.entities[entity].id, components: this.entities[entity].components });
  //   }
  //   this.state = JSON.stringify(final);
  // }

  // loadState() {
  //   // let state = JSON.parse(this.state);
  //   this.newSystemsQuery();
  // }

  get id() {
    return this._id;
  }

  get title() {
    return this._title;
  }

  /**
   * sets title of world
   * @param {string} title
   */
  set setTitle(title) {
    this._title = title;
  }

  get isEnabled() {
    return this._isEnabled;
  }

  addEntity(components = []) {
    let entity = new this.ecs.Entity(this.ecs, this);
    for (let i = 0; i < components.length; i++) {
      entity.addComponent(components[i]);
    }
    this._entities.push(entity);
    return entity;
  }

  removeEntity(entity) {
    return this._entities.splice(this.entities.indexOf(entity), 1);
  }

  update(param) {
    if (!this.isEnabled) return;
    for (let i = 0; i < this._systems.length; i++) {
      if (!this._systems[i].isEnabled || !this._systems[i].isReady) continue;
      this._systems[i].update(param);
    }
  }

  /**
   * query outputs a list entites
   * @param {array} components 
   * @returns 
   */
  query(components = []) {
    let results = [];
    for (let i = 0; i < this._entities.length; i++) {
      if (!this._entities[i].hasAllComponents(components)) continue;
      results.push(this._entities[i]);
    }
    return results;
  }

  newSystemsQuery() {
    for (let i = 0; i < this._systems.length; i++) {
      this._systems[i].query();
    }
  }

  enable() {
    this._isEnabled = true;
  }

  disable() {
    this._isEnabled = false;
  }

  addSystem(system) {
    if (doesObjectExist(system, this._systems)) return;
    let sys = new system(this)
    this._systems.push(sys);
    sys.enable();
    return this;
  }

  getSystem(system) {
    return this._systems.find(sys => sys instanceof system);
  }

  removeSystem(system) {
    return this.systems.splice(this.systems.indexOf(this.getSystem(system), 1));
  }
}

var timer = {};
function debounce({ context = this, func = () => { }, timeout = 300 }) {
  return ((...args) => {
    clearTimeout(timer[func]);
    timer[func] = setTimeout(() => { func.apply(context, args); delete timer[func]; }, timeout);
  })();
}

// credit https://stackoverflow.com/questions/105034/how-to-create-a-guid-uuid
function uuidv4() {
  return ([1e7] + -1e3 + -4e3 + -8e3 + -1e11).replace(/[018]/g, c =>
    (c ^ crypto.getRandomValues(new Uint8Array(1))[0] & 15 >> c / 4).toString(16)
  );
}

/**
 * checks if an object type exists in an array
 * @param {object} object the object itself not an instance of it
 * @param {array} array array to be evaluated
 * @returns {boolean}
 */
function doesObjectExist(object, array) {
  return array.some(obj => obj instanceof object || obj === object);
}

/**
 * checks if an object instance exists in an array
 * @param {object} instance must be an instance of an object not the object itself
 * @param {array} array array to be evaluated
 * @returns {boolean}
 */
function doesInstanceExist(instance, array) {
  return array.includes(instance);
}
