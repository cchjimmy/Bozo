import Vec2 from "./utilities/Vec2.js";
import debounce from "./utilities/debounce.js";
import Renderer2D from "./Renderer2D.js";
import SceneManager from "./SceneManager.js";
import AssetManager from "./AssetManager.js";
import randomRange from "./utilities/randomRange.js";
import CameraManager from "./CameraManager.js";
import GuiManager from "./gui/GuiManager.js";
import AudioManager from "./AudioManager.js";
import ECS from "./ECS.js";

export default class Engine {
  constructor(options = {
    resolution: { width: 848, height: 480 },
    pixelDensity: 1,
    unitScale: 10,
    zoom: 3,
    frameRate: 30,
    showFps: true,
    showQuadtree: true,
    dev: true,
    uiTheme: "dark"
  }) {
    this.options = {};
    if (options) {
      for (let option in options) {
        this.options[option] = options[option];
      }
    }

    this.ecs = new ECS;
    // this.sceneManager = new SceneManager;
    this.renderer = new Renderer2D;
    // this.assetManager = new AssetManager;
    // this.cameraManager = new CameraManager;
    this.guiManager = new GuiManager;
    // this.audioManager = new AudioManager;
  }

  init() {
    if (!this.renderer.context) {
      console.error("Unable to initialize CanvasRenderingContext2D");
      return;
    }
    this.renderer.setResolution(this.options.resolution.width, this.options.resolution.height);
    this.renderer.setUnitScale(this.options.unitScale);
    this.renderer.setPixelDensity(this.options.pixelDensity);
    this.renderer.canvas.style.background = "blue";
    resizeToFit.apply(this);
    function resizeToFit() {
      if (innerHeight>this.renderer.canvas.height) {
        this.renderer.setSize(innerWidth, this.renderer.canvas.height * innerWidth / this.renderer.canvas.width);
      } else {
        this.renderer.setSize(this.renderer.canvas.width * innerHeight / this.renderer.canvas.height, innerHeight);
      }
    }
    

    this.renderer.context.translate(this.renderer.canvas.width / 2, this.renderer.canvas.height / 2)
    this.renderer.context.scale(this.options.zoom, this.options.zoom);
    this.renderer.showCanvas("body");

    this.guiManager.setTheme(this.options.uiTheme);

    if (this.options.dev) {
      this.guiInit();

      setInterval(() => {
        this.guiUpdate();
      }, 1000 / this.options.frameRate);
    }

    window.onresize = () => {
      this.isLooping = false;
      debounce(() => {
        resizeToFit.apply(this);
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
      // this.renderer.draw(this.sceneManager.getTransforms(), this.sceneManager.getColors());
    }

    // if (this.options.showQuadtree) {
    //   this.renderer.qtree.show(this.renderer.context);
    // }
    requestAnimationFrame(() => { this.loop(); });
  }

  guiInit() {
    // credit for clipboard icon https://www.w3schools.com/icons/tryit.asp?filename=tryicons_fa-clipboard
    // credit for grid style https://dev.to/dawnind/3-ways-to-display-two-divs-side-by-side-3d8b
    // credit for input https://www.w3schools.com/tags/att_input_value.asp
    this.guiManager.add("body", `
      <div class="scrollmenu" style="z-index: 1;">
        <div class="tab has-menu" id="current-scene-info-tab">current-scene-info</div>
        <div class="tab has-menu" id="entities-tab">entities</div>
        <div class="tab has-menu" id="components-tab">components</div>
        <div class="tab has-menu" id="systems-tab">systems</div>
        <div class="tab" id="play" style="display: inline-block; position: sticky; right: 0px; width: 40px;"><i class="fa fa-play"></i></div>
      </div>`);

    const tabs = document.querySelectorAll(".tab.has-menu");
    var lastMenuHTML;
    var currentMenuHTML;
    for (let i = 0; i < tabs.length; i++) {
      this.guiManager.add("body", `<div class="table-container" id="${tabs[i].innerHTML}" style="display: none;"></div>`);

      tabs[i].addEventListener("click", () => {
        currentMenuHTML = this.guiManager.get("#" + tabs[i].innerHTML);
        if (lastMenuHTML && lastMenuHTML != currentMenuHTML) {
          lastMenuHTML.setAttribute("style", "display: none;");
          this.guiManager.get("#" + lastMenuHTML.id + "-tab").classList.remove("active");
        }
        if (currentMenuHTML.style.display === "none") {
          currentMenuHTML.setAttribute("style", "display: block;");
          tabs[i].classList.add("active");
        } else {
          currentMenuHTML.setAttribute("style", "display: none;");
          tabs[i].classList.remove("active");
        }
        lastMenuHTML = currentMenuHTML;
      });
    }
    defineMenus.apply(this);
    attachEventListeners.apply(this);

    function defineMenus() {
      // menu id="current-scene-info"
      this.guiManager.drawTable("#current-scene-info",
        [[`id: `, `<span id="scene-id"></span><button id="scene-id-clipboard-button" style="float:right;"><i class="fa fa-clipboard"></i></button>`],
        [`name: `, `<span id="scene-name"></span>`],
        [`entity count: `, `<span id="entity-count"></span>`]]);

      // menu id="entities"
      this.guiManager.add("#entities", `<div id="draw-components"></div>`);
      // this.guiManager.drawTable("#draw-components", [['bruh'], ['bruh'], ['bruh'], ['bruh'], ['bruh'], ['bruh']]);
      this.guiManager.add("#entities", `<div style="position:sticky;bottom:0px;" id="entities-buttons"></div>`);
      this.guiManager.drawTable("#entities-buttons",
        [[`<button class="button" id="create-entity" style="text-align:center; width:100%;">Add component</button>`, `<button class="button" id="add-component" style="text-align:center; width:100%;">Add entity</button>`]]);

      // menu id="components"
      this.guiManager.add("#components", `<div id="world-components"></div>`);
      this.guiManager.add("#components", `<div style="position:sticky;bottom:0px;" id="components-buttons"></div>`);
      this.guiManager.drawTable("#components-buttons",
        [[`<button class="button" style="text-align:center; width:100%;">New component</button>`]]);

      // menu id="systems"
      this.guiManager.add("#systems", `<div id="world-systems"></div>`);
      this.guiManager.add("#systems", `<div style="position:sticky;bottom:0px;" id="systems-buttons"></div>`);
      this.guiManager.drawTable("#systems-buttons",
        [[`<button class="button" style="text-align:center;width:100%;">New system</button>`]]);
    }

    function attachEventListeners() {
      const createEntityButton = document.querySelector("#create-entity");
      createEntityButton.onclick = () => {

      }

      const addComponentButton = document.querySelector("#add-component");
      addComponentButton.onclick = () => {

      }

      const clipboardButton = document.querySelector("#scene-id-clipboard-button");
      clipboardButton.onclick = () => {
        if (!navigator.clipboard) {
          return console.warn("Unable to copy scene id.");
        }
        let text = this.guiManager.get("#scene-id").innerHTML;
        navigator.clipboard.writeText(text);
      }
    }
  }

  guiUpdate() {
    // this.guiManager.update("#scene-id", this.sceneManager.getCurrentSceneId());
    // this.guiManager.update("#scene-name", this.sceneManager.currentScene.name);
    // this.guiManager.update("#entity-count", this.sceneManager.currentEntityPool.count);
  }
}
