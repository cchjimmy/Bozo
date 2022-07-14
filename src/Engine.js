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
    resolution: { width: 800, height: 600 },
    pixelDensity: 1 / 4,
    unitScale: 30,
    frameRate: 30,
    showFps: true,
    showQuadtree: false,
    dev: true
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
    this.renderer.setSize(innerWidth, "100%");

    this.uiInit();

    setInterval(() => {
      this.uiUpdate();
    }, 1000 / this.options.frameRate);

    // for (let i = 0; i < 500; i++) {
    //   this.sceneManager.createEntity({
    //     position: new Vec2(randomRange(-5, 5), randomRange(-5, 5)),
    //     size: new Vec2(randomRange(1, 2), randomRange(1, 2)),
    //     velocity: new Vec2(randomRange(-1, 1), randomRange(-1, 1)),
    //     color: `rgba(${randomRange(0, 255)}, ${randomRange(0, 255)}, ${randomRange(0, 255)}, 1)`,
    //     collider: false
    //   });
    //   this.sceneManager.update(1 / this.options.frameRate, this.renderer.unitScale, this.renderer.canvas.width, this.renderer.canvas.height);
    // }

    // function resizeToFit(renderer, options) {
    //   if (innerWidth > innerHeight) {
    //     renderer.setSize(options.resolution.width * innerHeight / options.resolution.height, innerHeight);
    //   } else {
    //     renderer.setSize(innerWidth, options.resolution.height * innerWidth / options.resolution.width);
    //   }
    // }

    window.onresize = () => {
      this.isLooping = false;
      debounce(() => {
        this.renderer.setSize(innerWidth, "100%");
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
    requestAnimationFrame(() => { this.loop(); });
  }

  uiInit() {
    this.renderer.showCanvas();
    if (this.options.dev) {
      document.body.style.overflowY="auto";
      document.body.style.overflowX="hidden";
      // this.guiManager.create("toolbar");

      this.guiManager.create("Current_scene");

      // // credit for clipboard icon https://www.w3schools.com/icons/tryit.asp?filename=tryicons_fa-clipboard
      this.guiManager.add("#Current_scenecontainer", `
      <div id="sceneId">
        id: <span></span> 
        <button id="scene-id-clipboard-button" style="float:right"><i class="fa fa-clipboard"></i></button>
      </div>
      <div id="name">
        name: <span></span>
      </div>
      <div id="entity_count">
        entity count: <span></span>
      <div>`);

      this.guiManager.create("Inspector");

      // // // credit for grid style https://dev.to/dawnind/3-ways-to-display-two-divs-side-by-side-3d8b
      // // // credit for input https://www.w3schools.com/tags/att_input_value.asp
      this.guiManager.add(
        "#Inspectorcontainer",
        `position:
          <div style="display: grid; grid-template-columns: 1fr 1fr; grid-gap: 20px;">
            <div>
              <label for="x">x: </label>
              <input type="number" name="x" value="0" id="x" style="width: 50px;"></input>
            </div>
            <div>
              <label for="y">y: </label>
              <input type="number" name="y" value="0" id="y" style="width: 50px;"></input>
            </div>
          </div>
          </br>
          size:
          <div style="display: grid; grid-template-columns: 1fr 1fr; grid-gap: 20px;">
            <div>
              <label for="width">width: </label>
              <input type="number" name="width" value="1" id="width" style="width: 50px;"></input>
            </div>
            <div>
              <label for="height">height: </label>
              <input type="number" name="height" value="1" id="height" style="width: 50px;"></input>
            </div>
          </div>
          </br>
          <div style="display: grid; grid-template-columns: 1fr 1fr; grid-gap: 20px;">
            <button id="add-component">add component</button>
            <button id="create-entity">create entity</button>
          </div>`
      );

      const createEntityButton = document.querySelector("#create-entity");
      const addComponentButton = document.querySelector("#add-component");
      const clipboardButton = document.querySelector("#scene-id-clipboard-button");

      // // credit for clipboard https://stackoverflow.com/questions/400212/how-do-i-copy-to-the-clipboard-in-javascript
      clipboardButton.addEventListener("click", () => {
        if (!navigator.clipboard) {
          return console.warn("Unable to copy scene id");
        }
        let text = this.guiManager.get("sceneId span").innerHTML;
        navigator.clipboard.writeText(text);
      })

      createEntityButton.addEventListener("click", () => {
        const x = parseFloat(document.querySelector("#x").value);
        const y = parseFloat(document.querySelector("#y").value);
        const w = parseFloat(document.querySelector("#width").value);
        const h = parseFloat(document.querySelector("#height").value);

        if (isNaN(x) || isNaN(y) || isNaN(w) || isNaN(h)) {
          this.guiManager.add("#Inspectorcontainer", `<div id="invalidInput" style="color: red">Please input number values!</div>`);

          setTimeout(() => {
            this.guiManager.remove("#invalidInput");
          }, 3000);
          return;
        }
        this.sceneManager.createEntity({ position: new Vec2(x, y), size: new Vec2(w, h) });
        this.sceneManager.update(1 / this.options.frameRate, this.renderer.unitScale, this.renderer.canvas.width, this.renderer.canvas.height);
      })

      // addComponentButton.addEventListener("click", ()=> {

      // })
      // // this.guiManager.createContent({ id: "create_entity", contentId: "size", content: `size` });
      // // this.guiManager.createContent({ id: "create_entity", contentId: "velcocity", content: `velocity` });
      // // this.guiManager.createContent({ id: "create_entity", contentId: "color", content: `color` });
      // // this.guiManager.createContent({ id: "create_entity", contentId: "collider", content: `collider` });
      return;
    }
  }
  uiUpdate() {
    if (this.options.dev) {
      this.guiManager.update("#sceneId span", this.sceneManager.getCurrentSceneId());
      this.guiManager.update("#name span", this.sceneManager.currentScene.name);
      this.guiManager.update("#entity_count span", this.sceneManager.currentEntityPool.count);
    }
  }
}
