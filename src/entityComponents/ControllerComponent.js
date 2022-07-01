export default class ControllerComponent {
  constructor() {
    this.entitiesWithController = [];

    // credit: https://www.gavsblog.com/blog/detect-single-and-multiple-keypress-events-javascript
    this.keys = {};
    document.addEventListener("keydown", (e) => {
      this.keys[e.key] = true;
    })
    document.addEventListener("keyup", (e) => {
      delete this.keys[e.key]
    })
  }

  addController(entity) {
    this.entitiesWithController.push(entity);
  }

  update() {
    
  }
}