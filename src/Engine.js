import debounce from "./utilities/debounce.js";
import Renderer2D from "./Renderer2D.js";
import GuiMaker from "./utilities/gui/GuiMaker.js";
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
    uiTheme: "dark"
  }) {
    this.options = {
      resolution: { width: 848, height: 480 },
      pixelDensity: 1,
      unitScale: 10,
      zoom: 3,
      frameRate: 30,
      showFps: true,
      showQuadtree: true,
      uiTheme: "dark"
    };
    if (options) {
      for (let option in options) {
        this.options[option] = options[option];
      }
    }
    this.ecs = new ECS;
    this.renderer = new Renderer2D;
    this.GuiMaker = new GuiMaker;

    this.menus = {
      main: "#main",
      editor: "#editor",
    }
  }

  init() {
    this.guiInit();
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
    if (!this.renderer.context) {
      console.error("Unable to initialize CanvasRenderingContext2D");
      return;
    }
    this.renderer.setResolution(this.options.resolution.width, this.options.resolution.height);
    this.renderer.setUnitScale(this.options.unitScale);
    this.renderer.setPixelDensity(this.options.pixelDensity);
    this.renderer.canvas.style.background = "blue";
    this.renderer.resizeToFit();

    this.renderer.context.translate(this.renderer.canvas.width / 2, this.renderer.canvas.height / 2)
    this.renderer.context.scale(this.options.zoom, this.options.zoom);

    this.GuiMaker.setTheme(this.options.uiTheme);

    this.defineMenus();
    this.attachEventListeners();

    this.switchMenu(this.menus.main);

    setInterval(() => {
      this.guiUpdate();
    }, 100);

    window.onresize = () => {
      this.isLooping = false;
      debounce(() => {
        this.renderer.resizeToFit();
        this.isLooping = true;
      }, 200);
    }
  }

  switchMenu(menu) {
    this.hideAllMenus();
    this.GuiMaker.get(menu).style.display = "block";
  }

  defineMenus() {
    // menu id="main"
    this.GuiMaker.add("body", `<div id="main" class="centered" style="display:none;"></div>`);
    this.GuiMaker.drawTable("#main",
      [[`<div style="font-size: 50px; background:orange;" class="header">Bozo</div>`],
      [`<button id="new-project-button" class="button" style="font-size: 20px;">New project</button>`]
      ]);

    // menu id="new-project-prompt"
    this.GuiMaker.add("body", `<div id="new-project-prompt" style="display:none;"></div>`);
    this.GuiMaker.add("#new-project-prompt", `<div style="background:rgb(0, 0, 0, 0.5); width:100%; height:100%; position:absolute; top:0px;"></div>`);
    this.GuiMaker.add("#new-project-prompt", `<div id="new-project-prompt-ui" class="table-container centered"></div>`)
    this.GuiMaker.drawTable("#new-project-prompt-ui",
      [[`New project`],
      [`Location:`, `<button id="new-project-location-button" class="button">choose location</button>`],
      [`<div id="location-path"></div>`],
      [`<button id="new-project-confirm">confirm</button>`, `<div style="float:right;"><button id="new-project-cancel">cancel</button></div>`]]);

    // menu id="editor"
    this.GuiMaker.add("body", `<div id="editor" style="display:none;"></div>`);
    this.renderer.showCanvas("#editor");
    // credit for clipboard icon https://www.w3schools.com/icons/tryit.asp?filename=tryicons_fa-clipboard
    // credit for grid style https://dev.to/dawnind/3-ways-to-display-two-divs-side-by-side-3d8b
    // credit for input https://www.w3schools.com/tags/att_input_value.asp
    this.GuiMaker.add("#editor", `
      <div class="scrollmenu" style="z-index: 1; position:absolute; height:51px; bottom: 0px;">
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
      this.GuiMaker.add("body", `<div class="table-container" id="${tabs[i].innerHTML}" style="display: none; width:100%; position:fixed; bottom:51px; height:185px;"></div>`);

      tabs[i].addEventListener("click", () => {
        currentMenuHTML = this.GuiMaker.get("#" + tabs[i].innerHTML);
        if (lastMenuHTML && lastMenuHTML != currentMenuHTML) {
          lastMenuHTML.style.display = "none";
          this.GuiMaker.get("#" + lastMenuHTML.id + "-tab").classList.remove("active");
        }
        if (currentMenuHTML.style.display === "none") {
          currentMenuHTML.style.display = "block";
          tabs[i].classList.add("active");
        } else {
          currentMenuHTML.style.display = "none";
          tabs[i].classList.remove("active");
        }
        lastMenuHTML = currentMenuHTML;
      });
    }

    // menu id="current-scene-info"
    this.GuiMaker.drawTable("#current-scene-info",
      [[`id: `, `<span id="scene-id"></span><button id="scene-id-clipboard-button" style="float:right;"><i class="fa fa-clipboard"></i></button>`],
      [`name: `, `<span id="scene-name"></span>`],
      [`entity count: `, `<span id="entity-count"></span>`]]);

    // menu id="entities"
    this.GuiMaker.add("#entities", `<div id="draw-components"></div>`);
    this.GuiMaker.add("#entities", `<div style="position:sticky;bottom:0px;" id="entities-buttons"></div>`);
    this.GuiMaker.drawTable("#entities-buttons",
      [[`<button class="button" id="create-entity" style="text-align:center; width:100%;">Add component</button>`, `<button class="button" id="add-component" style="text-align:center; width:100%;">Add entity</button>`]]);

    // menu id="components"
    this.GuiMaker.add("#components", `<div id="world-components"></div>`);
    this.GuiMaker.add("#components", `<div style="position:sticky;bottom:0px;" id="components-buttons"></div>`);
    this.GuiMaker.drawTable("#components-buttons",
      [[`<button class="button" style="text-align:center; width:100%;">New component</button>`]]);

    // menu id="systems"
    this.GuiMaker.add("#systems", `<div id="world-systems"></div>`);
    this.GuiMaker.add("#systems", `<div style="position:sticky;bottom:0px;" id="systems-buttons"></div>`);
    this.GuiMaker.drawTable("#systems-buttons",
      [[`<button class="button" style="text-align:center;width:100%;">New system</button>`]]);
  }

  attachEventListeners() {
    var dirHandle, path;
    this.GuiMaker.get("#new-project-button").onclick = () => {
      this.GuiMaker.get("#new-project-prompt").style.display = "block";
    }

    // credit: https://thewebdev.info/2021/04/25/how-to-create-a-file-object-in-javascript/#:~:text=We%20can%20create%20a%20file,File(parts%2C%20'sample.
    this.GuiMaker.get("#new-project-location-button").onclick = async () => {
      try {
        dirHandle = await window.showDirectoryPicker();
        path = "./" + dirHandle.name;
        this.GuiMaker.get("#location-path").innerText = path;
      } catch (err) { }
    }

    this.GuiMaker.get(`#new-project-confirm`).onclick = () => {
      this.GuiMaker.get(`#new-project-prompt`).style.display = "none";
      this.switchMenu(this.menus.editor);
    }

    this.GuiMaker.get(`#new-project-cancel`).onclick = () => {
      this.GuiMaker.get(`#new-project-prompt`).style.display = "none";
    }

    this.GuiMaker.get("#create-entity").onclick = () => {

    }

    this.GuiMaker.get("#add-component").onclick = () => {

    }

    this.GuiMaker.get("#scene-id-clipboard-button").onclick = () => {
      if (!navigator.clipboard) {
        return console.warn("Unable to copy scene id.");
      }
      let text = this.GuiMaker.get("#scene-id").innerHTML;
      navigator.clipboard.writeText(text);
    }
  }

  hideAllMenus() {
    for (let menu in this.menus) {
      this.GuiMaker.get(this.menus[menu]).style.display = "none";
    }
  }

  guiUpdate() {
    // this.GuiMaker.update("#scene-id", this.sceneManager.getCurrentSceneId());
    // this.GuiMaker.update("#scene-name", this.sceneManager.currentScene.name);
    // this.GuiMaker.update("#entity-count", this.sceneManager.currentEntityPool.count);
  }
}