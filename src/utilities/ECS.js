// credit: http://vasir.net/blog/game-development/how-to-build-entity-component-system-in-javascript
// credit: https://github.com/ecsyjs/ecsy
export default class ECS {
  constructor() {
    this.worlds = {};
  }

  createWorld() {
    const world = new this.World(this);
    this.worlds[world.id] = world;
    return world;
  }

  removeWorld(id) {
    if (!this.worlds[id]) {
      return;
    }
    delete this.worlds[id];
  }
}

ECS.prototype.Component = class Component {
  // constructor() { }

  // clone() {
  //   let clone = Object.create(this);
  //   for (let property in this) {
  //     clone[property] = this[property];
  //   }
  //   return clone;
  // }
};

ECS.prototype.Component.prototype.isComponent = true;

ECS.prototype.TagComponent = class TagComponent { };

ECS.prototype.TagComponent.prototype.isTagComponent = true;

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
      this.queries[property] = this.world.queryComponents(this.constructor.queries[property]);
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
  constructor(world) {
    this.id = uuidv4();
    this.components = {};
    this.world = world;
  }

  addComponent(component) {
    if (!component.prototype.isComponent && !component.prototype.isTagComponent || !this.world.components[component.name]) {
      return this;
    }
    this.components[component.name] = new this.world.components[component.name];
    debounce({ context: this.world, func: this.world.newSystemsQuery });
    return this;
  }

  removeComponent(component) {
    if (!this.components[component.name]) {
      return;
    }
    delete this.components[component.name];
    debounce({ context: this.world, func: this.world.newSystemsQuery });
    return this;
  }

  getComponent(component) {
    if (!this.components[component.name]) {
      return;
    }
    return this.components[component.name];
  }
}

ECS.prototype.World = class World {
  constructor(ecs) {
    this.ecs = ecs;
    this.id = uuidv4();
    this.components = {};
    this.assemblages = {};
    this.systems = {};
    this.entities = {};

    this._isEnabled = true;

    this.state;
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

  registerComponent(component) {
    if (this.components[component.name] || !component.prototype.isComponent && !component.prototype.isTagComponent) {
      return this;
    }
    this.components[component.name] = component;
    return this;
  }

  registerSystem(system) {
    if (this.systems[system.name] || !system.prototype.isSystem) {
      return this;
    }
    this.systems[system.name] = new system(this);
    this.enableSystem(this.systems[system.name].constructor);
    return this;
  }

  getSystem(system) {
    return this.systems[system.name];
  }

  createEntity(assemblageName = "") {
    if (!assemblageName) {
      const e = new this.ecs.Entity(this);
      this.entities[e.id] = e;
      return e;
    }
    if (!this.assemblages[assemblageName]) {
      return;
    }
    return this.assemblages[assemblageName]();
  }

  newAssemblage(name = "", components = []) {
    if (!components.length) {
      return;
    }
    this.assemblages[name] = () => {
      const e = this.createEntity();
      for (let i = 0; i < components.length; i++) {
        e.addComponent(components[i]);
      }
      return e;
    };
  }

  update(param) {
    if (!this._isEnabled) {
      return;
    }
    for (let system in this.systems) {
      if (this.systems[system].isEnabled && this.systems[system].isReady) {
        this.systems[system].update(param);
      }
    }
  }

  /**
   * query outputs a list entites
   * @param {*} components 
   * @returns 
   */
  queryEntities(components = []) {
    let results = [];
    for (let i = 0; i < components.length; i++) {
      results[components[i].name] = [];
    }
    for (let entity in this.entities) {
      let hasAllComponents = true;
      for (let i = 0; i < components.length; i++) {
        if (!this.entities[entity].getComponent(components[i])) {
          hasAllComponents = false;
          break;
        }
      }
      if (hasAllComponents) {
        let clone = this.entities[entity]
        results.push(clone);
      }
    }
    return results;
  }

  /**
   * query outputs lists of components in an object
   * @param {*} components 
   * @returns 
   */
  queryComponents(components = []) {
    let results = {};
    let count = 0;
    for (let i = 0; i < components.length; i++) {
      results[components[i].name] = [];
    }
    for (let entity in this.entities) {
      let hasAllComponents = true;
      for (let i = 0; i < components.length; i++) {
        if (!this.entities[entity].getComponent(components[i])) {
          hasAllComponents = false;
          break;
        }
      }
      if (hasAllComponents) {
        count++;
        for (let i = 0; i < components.length; i++) {
          if (this.entities[entity].getComponent(components[i]).isTagComponent) {
            continue;
          }
          results[components[i].name].push(this.entities[entity].getComponent(components[i]).clone());
        }
      }
    }
    results.length = count;
    return results;
  }

  newSystemsQuery() {
    for (let system in this.systems) {
      this.systems[system].query();
    }
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

  enableSystem(system) {
    this.systems[system.name].enable();
  }

  disableSystem(system) {
    this.systems[system.name].disable();
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