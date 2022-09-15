// credit: http://vasir.net/blog/game-development/how-to-build-entity-component-system-in-javascript
// credit: https://github.com/ecsyjs/ecsy
class ECS {
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
  // credit: https://www.samanthaming.com/tidbits/70-3-ways-to-clone-objects/
  clone() {
    return new this.constructor().copy(this);
  }

  copy(component) {
    for (let prop in component) {
      if (!this.hasOwnProperty(prop)) {
        continue;
      }
      if (typeof component[prop] == "object") {
        Object.assign(this[prop], component[prop]);
        continue;
      }
      this[prop] = component[prop];
    }
    return this;
  }
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
  constructor(world) {
    this._id = uuidv4();
    this._components = {};
    this.world = world;
  }

  get id() {
    return this._id;
  }

  addComponent(component) {
    if (!component.prototype.isComponent && !component.prototype.isTagComponent || !this.world.registeredComponents[component.name] || this.hasComponent(component)) {
      return this;
    }
    this._components[component.name] = new this.world.registeredComponents[component.name];;
    debounce({ context: this.world, func: this.world.newSystemsQuery });
    return this;
  }

  removeComponent(component) {
    if (!component.prototype.isComponent && !component.prototype.isTagComponent || !this.world.registeredComponents[component.name] || !this.hasComponent(component)) {
      return this;
    }
    delete this._components[component.name];
    debounce({ context: this.world, func: this.world.newSystemsQuery });
    return this;
  }

  hasComponent(component) {
    // credit: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Conditional_Operator
    return this._components[component.name] ? true : false;
  }

  hasAllComponents(components = []) {
    for (let i = 0; i < components.length; i++) {
      if (!this.hasComponent(components[i])) {
        return false;
      }
    }
    return true;
  }

  getComponent(component, clone = false) {
    if (!this.hasComponent(component)) {
      return;
    }
    let comp = this._components[component.name];
    return clone ? comp.clone() : comp;
  }
}

ECS.prototype.World = class World {
  constructor(ecs) {
    this.ecs = ecs;
    this._id = uuidv4();
    this.registeredComponents = {};
    this.assemblages = {};
    this.registeredSystems = {};
    this.entities = [];

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

  get id() {
    return this._id;
  }

  registerComponent(component) {
    if (this.registeredComponents[component] || !component.prototype.isComponent && !component.prototype.isTagComponent) {
      return this;
    }
    this.registeredComponents[component.name] = component;
    return this;
  }

  registerSystem(system) {
    if (this.registeredSystems[system] || !system.prototype.isSystem) {
      return this;
    }
    this.registeredSystems[system.name] = new system(this);
    this.enableSystem(system);
    return this;
  }

  getSystem(system) {
    return this.registeredSystems[system.name];
  }

  createEntity(assemblageName = "") {
    if (!assemblageName) {
      const e = new this.ecs.Entity(this);
      this.entities.push(e);
      return e;
    }
    if (!this.assemblages[assemblageName]) {
      return;
    }
    return this.assemblages[assemblageName]();
  }

  removeEntity(entity) {
    this.entities.splice(this.entities.indexOf(entity), 1);
  }

  newAssemblage(name = "", components = []) {
    if (!components.length) {
      return;
    }
    this.assemblages[name] = () => {
      let e = this.createEntity();
      for (let i = 0; i < components.length; i++) {
        e.addComponent(components[i]);
      }
      return e;
    };
  }

  update(param) {
    if (!this.isEnabled) {
      return;
    }
    for (let rs in this.registeredSystems) {
      if (this.registeredSystems[rs].isEnabled && this.registeredSystems[rs].isReady) {
        this.registeredSystems[rs].update(param);
      }
    }
  }

  /**
   * query outputs a list entites
   * @param {*} components 
   * @returns 
   */
  query(components = []) {
    let results = [];
    for (let entity in this.entities) {
      if (this.entities[entity].hasAllComponents(components)) {
        results.push(this.entities[entity]);
      }
    }
    return results;
  }

  newSystemsQuery() {
    for (let rs in this.registeredSystems) {
      this.registeredSystems[rs].query();
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
    this.registeredSystems[system.name].enable();
  }

  disableSystem(system) {
    this.registeredSystems[system.name].disable();
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