export default class TransformComponent {
  constructor() {
    this.transforms = {};
  }

  /**
   * adds transform information to an array
   * @param {uuid} id id of entity
   * @param {Vec2} position use Vec2 class to define position
   * @param {Number} rotation measure in radians
   */
  addTransform({ id, position, rotation = 0 }) {
    this.transforms[id] = { position: position, rotation: rotation };
  }

  /**
   * returns an Object containing all transforms
   * @returns an Object
   */
  getTransforms() {
    return this.transforms;
  }
}