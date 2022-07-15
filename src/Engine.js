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
    resolution: { width: 848, height: 480 },
    pixelDensity: 1,
    unitScale: 10,
    zoom: 3,
    frameRate: 30,
    showFps: true,
    showQuadtree: false,
    dev: true,
    uiTheme: "dark"
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
    this.renderer.setSize(innerWidth, this.renderer.height * innerWidth / this.renderer.width);

    this.renderer.context.translate(this.renderer.canvas.width / 2, this.renderer.canvas.height / 2)
    this.renderer.context.scale(this.options.zoom, this.options.zoom);
    this.guiInit();

    setInterval(() => {
      this.guiUpdate();
    }, 1000 / this.options.frameRate);

    for (let i = 0; i < 100; i++) {
      this.sceneManager.createEntity({
        position: new Vec2(randomRange(-5, 5), randomRange(-5, 5)),
        size: new Vec2(randomRange(1, 2), randomRange(1, 2)),
        velocity: new Vec2(randomRange(-1, 1), randomRange(-1, 1)),
        color: `rgba(${randomRange(0, 255)}, ${randomRange(0, 255)}, ${randomRange(0, 255)}, 1)`,
        collider: false
      });
      this.sceneManager.update(1 / this.options.frameRate, this.renderer.unitScale, this.renderer.canvas.width, this.renderer.canvas.height);
    }

    window.onresize = () => {
      this.isLooping = false;
      debounce(() => {
        this.renderer.setSize(innerWidth, this.renderer.height * innerWidth / this.renderer.width);
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

  guiInit() {
    this.guiManager.setTheme(this.options.uiTheme);

    this.guiManager.add("body", `<table id="table"></table>`);
    this.guiManager.add("#table", `<tbody id="canvas-container"><tr><td></td></tr></tbody>`)
    this.renderer.showCanvas("#canvas-container td");
    if (this.options.dev) {
      // credit for clipboard icon https://www.w3schools.com/icons/tryit.asp?filename=tryicons_fa-clipboard
      // credit for grid style https://dev.to/dawnind/3-ways-to-display-two-divs-side-by-side-3d8b
      // credit for input https://www.w3schools.com/tags/att_input_value.asp
      this.guiManager.add("#table", `
      <tbody class="scrollmenu header">
        <th id="tab">current-scene-info</th>
        <th id="tab">entity-spawner</th>
      </tbody>
        `);

      //id="current-scene-info"
      this.guiManager.add("#table", `
      <tbody id="current-scene-info" style="display: none;">
        <tr class="container"><td id="scene-id">
            id: <span></span><button id="scene-id-clipboard-button" style="float:right"><i class="fa fa-clipboard"></i></button>
        </td></tr>

        <tr class="container"><td id="name">
            name: <span></span>
        </td></tr>

        <tr class="container"><td id="entity-count">
            entity count: <span></span>
        </td></tr>
      </tbody>`);

      //id="entity-spawner"
      this.guiManager.add("#table", `
      <tbody id="entity-spawner" style="display: none;">
        <tr class="container"><td>
            position:
        </td></tr>

        <tr class="container"><td>
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px;">
              <div>
                <label for="x">x: </label>
                <input type="number" name="x" value="0" id="x" style="width: 50px;"></input>
              </div>
              <div>
                <label for="y">y: </label>
                <input type="number" name="y" value="0" id="y" style="width: 50px;"></input>
              </div>
            </div>
        </td></tr>

        <tr class="container"><td></br></td></tr>

        <tr class="container"><td>
            size:
        </td></tr>

        <tr class="container"><td>
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px;">
              <div>
                <label for="width">width: </label>
                <input type="number" name="width" value="1" id="w" style="width: 50px;"></input>
              </div>
              <div>
                <label for="height">height: </label>
                <input type="number" name="height" value="1" id="h" style="width: 50px;"></input>
              </div>
            </div>
        </td></tr>

        <tr class="container"><td>
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px;">
              <button id="add-component">add component</button>
              <button id="create-entity">create entity</button>
            </div>
        </td></tr>
      </tbody>`);

      const tabs = document.querySelectorAll("#tab");

      var currentMenu;
      var lastMenu;
      var currentMenuHTML;
      for (let i = 0; i < tabs.length; i++) {
        tabs[i].addEventListener("click", () => {
          currentMenu = tabs[i].innerHTML;
          if (currentMenu == "current-scene-info") {
            // const clipboardButton = document.querySelector("#scene-id-clipboard-button");
            // clipboardButton.addEventListener("click", copySceneId);
            currentMenuHTML = this.guiManager.get("#" + currentMenu);
          }
          if (currentMenu == "entity-spawner") {
            currentMenuHTML = this.guiManager.get("#" + currentMenu);
          }
          if (lastMenu && lastMenu != currentMenuHTML) {
            lastMenu.setAttribute("style", "display: none;");
          }
          if (currentMenuHTML.style.display === "none") {
            currentMenuHTML.setAttribute("style", "display: table-row; height: auto; overflow-y: scroll;");
          } else {
            currentMenuHTML.setAttribute("style", "display: none;");
          }
          lastMenu = currentMenuHTML;
        });

        // if (currentMenu == "entitySpawner") {
        //   const createEntityButton = document.querySelector("#create-entity");
        //   createEntityButton.addEventListener("click", spawnEntity(this.guiManager, this.sceneManager, this.options, this.renderer));
        //   // const addComponentButton = document.querySelector("#add-component");
        //   // addComponentButton.addEventListener("click", ()=> {
        //   // })
        // }
      }

      // function copySceneId() {
      //   if (!navigator.clipboard) {
      //     return console.warn("Unable to copy scene id");
      //   }
      //   let text = this.guiManager.get("#sceneId span").innerHTML;
      //   navigator.clipboard.writeText(text);
      // }

      // function spawnEntity(guiManager, sceneManager, options, renderer) {
      //   const x = parseFloat(document.querySelector("#x").value);
      //   const y = parseFloat(document.querySelector("#y").value);
      //   const w = parseFloat(document.querySelector("#width").value);
      //   const h = parseFloat(document.querySelector("#height").value);

      //   if (isNaN(x) || isNaN(y) || isNaN(w) || isNaN(h)) {
      //     guiManager.add("#Inspectorcontainer", `<div id="invalidInput" style="color: red">Please input number values!</div>`);

      //     setTimeout(() => {
      //       guiManager.remove("#invalidInput");
      //     }, 3000);
      //     return;
      //   }
      //   sceneManager.createEntity({ position: new Vec2(x, y), size: new Vec2(w, h) });
      //   sceneManager.update(1 / options.frameRate, renderer.unitScale, renderer.canvas.width, renderer.canvas.height);
      // }
    }
  }
  guiUpdate() {
    if (this.options.dev) {
      this.guiManager.update("#scene-id span", this.sceneManager.getCurrentSceneId());
      this.guiManager.update("#name span", this.sceneManager.currentScene.name);
      this.guiManager.update("#entity-count span", this.sceneManager.currentEntityPool.count);
    }
  }
}
