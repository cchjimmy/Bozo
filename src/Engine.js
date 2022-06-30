import Canvas2D from "./Canvas.js";
import EntitiesHandler from "./EntitiesHandler.js";

export default class Engine {
  constructor() {
    this.c = new Canvas2D;
    this.eh = new EntitiesHandler;
    this.isLooping = false;
  }

  init() {
    if (!this.c.context) {
      console.log("Unable to initialize CanvasRenderingContext2D")
      return;
    }

    this.c.setSize(innerWidth, innerHeight);

    this.eh.addEntity();
    console.log(this.eh.getEntities());

    // credit: https://stackoverflow.com/questions/63301553/debounce-function-not-working-in-javascript
    let timer;
    function debounce(func, timeout = 300){
      return ((...args) => {
        clearTimeout(timer);
        timer = setTimeout(() => { func.apply(this, args); }, timeout);
      })();
    }

    window.onresize = () => {
      this.isLooping = false;
      debounce(() => {
        this.c.setSize(innerWidth, innerHeight);
        this.isLooping = true;
      }, 200);
    }

    this.isLooping = true;
    this.loop();
  }

  loop() {
    this.eh.update();
    if (this.isLooping) {
      
    }
    requestAnimationFrame(() => { this.loop();});
  }
}
