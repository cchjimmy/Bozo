import Vec2 from "./Vec2.js";
import Renderer2D from "./Renderer2D.js";
import Scene from "./Scene.js";

export default class Engine {
  constructor() {
    this.scene = new Scene;
    this.renderer = new Renderer2D;
  }

  init() {
    if (!this.renderer.context) {
      console.error("Unable to initialize CanvasRenderingContext2D")
      return;
    }

    this.renderer.setSize(innerWidth, innerHeight);

    this.scene.addEntity({entityComponents: { transformComponent: { position: new Vec2(10, 10) }, imageComponent: { size: new Vec2(10, 10) } }});

    // credit: https://stackoverflow.com/questions/63301553/debounce-function-not-working-in-javascript
    let timer;
    function debounce(func, timeout = 300) {
      return ((...args) => {
        clearTimeout(timer);
        timer = setTimeout(() => { func.apply(this, args); }, timeout);
      })();
    }

    window.onresize = () => {
      this.isLooping = false;
      debounce(() => {
        this.renderer.setSize(innerWidth, innerHeight);
        this.isLooping = true;
      }, 200);
    }

    this.isLooping = true;
    this.loop();
  }

  loop() {
    this.update();

    // draw only when not resizing
    if (this.isLooping) {
      // this.renderer.draw();
    }

    requestAnimationFrame(() => { this.loop(); });
  }

  update() {

  }
}
