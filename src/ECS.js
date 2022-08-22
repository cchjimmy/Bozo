var timer;
function debounce({ context = this, func = () => { }, timeout = 300 }) {
  return ((...args) => {
    clearTimeout(timer);
    timer = setTimeout(() => { func.apply(context, args) }, timeout);
  })();
}

function uuidv4() {
  return ([1e7] + -1e3 + -4e3 + -8e3 + -1e11).replace(/[018]/g, c =>
    (c ^ crypto.getRandomValues(new Uint8Array(1))[0] & 15 >> c / 4).toString(16)
  );
}

// http://vasir.net/blog/game-development/how-to-build-entity-component-system-in-javascript
export default class ECS {
  constructor() {
    this.Worlds = {};
  }

  createWorld() {
    const world = new this.World(this);
    this.Worlds[world.id] = world;
    return world;
  }

  removeWorld(id) {
    if (!this.Worlds[id]) {
      return console.warn(`The world ID: '${id}' does not exist.`);
    }
    delete this.Worlds[id];
  }
}

ECS.prototype.Component = class Component { };

ECS.prototype.Component.prototype.isComponent = true;

ECS.prototype.TagComponent = class TagComponent { };

ECS.prototype.TagComponent.prototype.isTagComponent = true;

ECS.prototype.System = class System {
  constructor(world) {
    this.world = world;
    this.queries = {};
    this.enabled = false;
    this.isReady = false;
  }

  query() {
    this.isReady = false;
    for (let property in this.constructor.queries) {
      this.queries[property] = this.world.query(this.constructor.queries[property]);
    }
    this.isReady = true;
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
    if (!component.prototype.isComponent && !component.prototype.isTagComponent || !this.world.Components[component.name]) {
      console.warn(`The input component '${component.name}' is either not registered or it does not extend from the ECS component class.`);
      return this;
    }
    this.components[component.name] = new this.world.Components[component.name];
    debounce({ context: this.world, func: this.world.newSystemsQuery });
    return this;
  }

  removeComponent(component) {
    if (!this.components[component.name]) {
      return console.warn(`No components were removed, component '${component.name}' does not exist on entity ID: ${this.id}.`);
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

  JSONString() {
    let object = {
      id: this.id,
      components: this.components
    };
    return JSON.stringify(object);
  }
}

ECS.prototype.World = class World {
  constructor(ecs) {
    this.ecs = ecs;
    this.id = uuidv4();
    this.Components = {};
    this.Assemblages = {};
    this.Systems = {};
    this.Entities = {};
    this.lastTime = performance.now() / 1000;
  }

  registerComponent(component) {
    if (!component.prototype.isComponent && !component.prototype.isTagComponent) {
      console.warn("Please input a valid component for registration.");
      return this
    }
    this.Components[component.name] = component;
    return this;
  }

  registerSystem(system) {
    if (!system.prototype.isSystem) {
      console.warn("Please input a valid system for registration.");
      return this;
    }
    this.Systems[system.name] = new system(this);
    return this;
  }

  createEntity(assemblageName = "") {
    if (!assemblageName) {
      const e = new this.ecs.Entity(this);
      this.Entities[e.id] = e;
      return e;
    }
    if (!this.Assemblages[assemblageName]) {
      return console.warn(`The entity assemblage '${assemblageName}' does not exist.`)
    }
    return this.Assemblages[assemblageName]();
  }

  newAssemblage(name = "", components = []) {
    if (!components.length) {
      return console.warn("Please input components as an array for a new assemblage.");
    }
    this.Assemblages[name] = () => {
      const e = this.createEntity();
      for (let i = 0; i < components.length; i++) {
        e.addComponent(components[i]);
      }
      return e;
    };
  }

  update() {
    let now = performance.now() / 1000;
    let delta = now - this.lastTime;
    this.lastTime = now;
    for (let system in this.Systems) {
      if (this.Systems[system].enabled && this.Systems[system].ready) {
        this.Systems[system].update(delta);
      }
    }
  }

  query(components = []) {
    let results = {};
    let hasAllComponents = true;
    for (let i = 0; i < components.length; i++) {
      results[components[i].name] = [];
    }
    for (let entity in this.Entities) {
      hasAllComponents = true;
      for (let i = 0; i < components.length; i++) {
        if (!this.Entities[entity].getComponent(components[i])) {
          hasAllComponents = false;
          break;
        }
      }
      if (hasAllComponents) {
        for (let i = 0; i < components.length; i++) {
          results[components[i].name].push(this.Entities[entity].getComponent(components[i]));
        }
      }
    }
    // https://www.javascripttutorial.net/array/javascript-remove-duplicates-from-array/
    // result = result.filter((value, index) => { return result.indexOf(value) === index });
    return results;
  }

  newSystemsQuery() {
    for (let system in this.Systems) {
      this.Systems[system].query();
    }
  }

  play() {
    for (let system in this.Systems) {
      this.Systems[system].enabled = true;
    }
  }

  stop() {
    for (let system in this.Systems) {
      this.Systems[system].enabled = false;
    }
  }
}