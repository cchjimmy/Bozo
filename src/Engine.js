import Vec2 from "./utilities/Vec2.js";
import debounce from "./utilities/debounce.js";
import Renderer2D from "./Renderer2D.js";
import SceneManager from "./SceneManager.js";
import AssetManager from "./AssetManager.js";
import randomRange from "./utilities/randomRange.js";
import CameraManager from "./CameraManager.js";
import GuiManager from "./gui/GuiManager.js";
import AudioManager from "./AudioManager.js";

export default class Engine {
  constructor(options = {
    resolution: { width: 256, height: 240 },
    pixelDensity: 1,
    unitScale: 10,
    frameRate: 30,
    showFps: true,
    showQuadtree: false,
    debug: true
  }) {
    this.options = {};
    if (options) {
      for (let option in options) {
        this.options[option] = options[option];
      }
    }

    this.sceneManager = new SceneManager;
    this.renderer = new Renderer2D;
    this.assetManager = new AssetManager;
    this.cameraManager = new CameraManager;
    this.guiManager = new GuiManager;
    this.audioManager = new AudioManager;
  }

  init() {
    if (!this.renderer.context) {
      console.error("Unable to initialize CanvasRenderingContext2D");
      return;
    }

    this.renderer.setResolution(this.options.resolution.width, this.options.resolution.height);
    this.renderer.setUnitScale(this.options.unitScale);
    this.renderer.setPixelDensity(this.options.pixelDensity);

    this.uiInit();

    // for (let i = 0; i < 1; i++) {
    //   this.sceneManager.createEntity({
    //     position: new Vec2(randomRange(-5, 5), randomRange(-5, 5)),
    //     size: new Vec2(randomRange(1, 2), randomRange(1, 2)),
    //     velocity: new Vec2(randomRange(-1, 1), randomRange(-1, 1)),
    //     color: `rgba(${randomRange(0, 255)}, ${randomRange(0, 255)}, ${randomRange(0, 255)}, 1)`,
    //     collider: false
    //   });
    //   this.sceneManager.update(1 / this.options.frameRate, this.renderer.unitScale, this.renderer.canvas.width, this.renderer.canvas.height);
    // }

    function resizeToFit(renderer, options) {
      if (innerWidth > innerHeight) {
        renderer.setSize(options.resolution.width * innerHeight / options.resolution.height, innerHeight);
      } else {
        renderer.setSize(innerWidth, options.resolution.height * innerWidth / options.resolution.width);
      }
    }
    resizeToFit(this.renderer, this.options);

    window.onresize = () => {
      this.isLooping = false;
      debounce(() => {
        resizeToFit(this.renderer, this.options);
        this.isLooping = true;
      }, 200);
    }

    this.isLooping = true;
    this.loop();
  }

  loop() {
    // draw only when not resizing
    if (this.isLooping) {
      this.renderer.clear();
      this.renderer.draw(this.sceneManager.getTransforms(), this.sceneManager.getColors());
    }

    if (this.options.showQuadtree) {
      this.renderer.qtree.show(this.renderer.context);
    }

    this.uiUpdate();

    requestAnimationFrame(() => { this.loop(); });
  }

  uiInit() {
    if (this.options.debug) {
      this.guiManager.create("Current_scene");
      this.guiManager.draw("Current_scene");
      this.guiManager.createContent({ id: "Current_scene", contentId: "sceneId", content: `id: ${this.sceneManager.getCurrentSceneId()}` })
      this.guiManager.createContent({ id: "Current_scene", contentId: "name", content: `name: <span>${this.sceneManager.currentScene.name}</span>` });
      this.guiManager.createContent({ id: "Current_scene", contentId: "entity_count", content: `entity count: <span>${this.sceneManager.currentEntityPool.count}</span>` });

      this.guiManager.create("create_entity");
      this.guiManager.draw("create_entity", 200);

      // credit for grid style https://dev.to/dawnind/3-ways-to-display-two-divs-side-by-side-3d8b
      // credit for input https://www.w3schools.com/tags/att_input_value.asp
      this.guiManager.createContent({
        id: "create_entity",
        content:
          `position:
      <form style="display: grid; grid-template-columns: 1fr 1fr; grid-gap: 20px;">
        <div>
          <label for="x">x: </label>
          <input type="number" name="x" value="0" id="x" style="width: 50px;"></input>
        </div>
        <div>
          <label for="y">y: </label>
          <input type="number" name="y" value="0" id="y" style="width: 50px;"></input>
        </div>
      </form>
      </br>
      size:
      <form style="display: grid; grid-template-columns: 1fr 1fr; grid-gap: 20px;">
        <div>
          <label for="width">width: </label>
          <input type="number" name="width" value="1" id="width" style="width: 50px;"></input>
        </div>
        <div>
          <label for="height">height: </label>
          <input type="number" name="height" value="1" id="height" style="width: 50px;"></input>
        </div>
      </form>
      </br>
      <button id="add-component">add component</button>
      <input type="submit" id="create-entity" value="create entity"></input>`
      });

      const createEntityButton = document.querySelector("#create-entity");
      // console.log(createEntityButton);
      
      createEntityButton.addEventListener("click", ()=> {
        const x = parseInt(document.querySelector("#x").value);
        const y = parseInt(document.querySelector("#y").value);
        const w = parseInt(document.querySelector("#width").value);
        const h = parseInt(document.querySelector("#height").value);
        
        this.sceneManager.createEntity({position: new Vec2(x, y), size: new Vec2(w, h)});
        this.sceneManager.update(1 / this.options.frameRate, this.renderer.unitScale, this.renderer.canvas.width, this.renderer.canvas.height);
      })
      // this.guiManager.createContent({ id: "create_entity", contentId: "size", content: `size` });
      // this.guiManager.createContent({ id: "create_entity", contentId: "velcocity", content: `velocity` });
      // this.guiManager.createContent({ id: "create_entity", contentId: "color", content: `color` });
      // this.guiManager.createContent({ id: "create_entity", contentId: "collider", content: `collider` });
    }
  }
  uiUpdate() {
    if (this.options.debug) {
      this.guiManager.updateContent({ contentId: "name span", content: this.sceneManager.currentScene.name });
      this.guiManager.updateContent({ contentId: "entity_count span", content: this.sceneManager.currentEntityPool.count });
    }
  }
}
