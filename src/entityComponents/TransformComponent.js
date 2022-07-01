export default class TransformComponent {
  constructor() {
    this.transforms = [];
  }

  /**
   * adds transform information to an array
   * @param {uuid} id id of entity
   * @param {Vec2} position use Vec2 class to define position
   * @param {Number} rotation measure in radians
   */
  addTransform({ id, position, rotation }) {
    this.transforms.push({ id: id, position: position, rotation: rotation });
  }

  /**
   * returns an array of transforms
   * @returns an array
   */
  getTransforms() {
    return this.transforms;
  }
}