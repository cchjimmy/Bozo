import debounce from "./utilities/debounce.js";
import Canvas2D from "./utilities/Canvas2D.js";
import GuiMaker from "./utilities/gui/GuiMaker.js";
import ECS from "./utilities/ECS.js";

export default class Engine {
  constructor(options = {
    resolution: { width: 848, height: 480 },
    pixelDensity: 1,
    unitScale: 10,
    frameRate: 30,
    zoom: 3,
    showFps: true,
    showQuadtree: true,
    uiTheme: "dark"
  }) {
    this.options = {
      resolution: { width: 848, height: 480 },
      pixelDensity: 1,
      unitScale: 10,
      frameRate: 30,
      zoom: 3,
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
    this.renderer = new Canvas2D;
    this.GuiMaker = new GuiMaker;

    this.menus = {
      main: "#main",
      editor: "#editor",
      settings: "#settings"
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
      this.renderer.clear("blue");
      // this.renderer.draw(this.sceneManager.getTransforms(), this.sceneManager.getColors());
    }

    // if (this.options.showQuadtree) {
    //   this.renderer.qtree.show(this.renderer.context);
    // }
    requestAnimationFrame(() => { this.loop(); });
  }

  guiInit() {
    if (!this.renderer.context) {
      return console.error("Unable to initialize renderer.");
    }
    this.renderer.setResolution(this.options.resolution.width, this.options.resolution.height);
    this.renderer.setUnitScale = this.options.unitScale;
    this.renderer.setPixelDensity = this.options.pixelDensity;
    this.renderer.setZoom(this.options.zoom);

    this.renderer.canvas.classList.add("centered");

    this.GuiMaker.setTheme(this.options.uiTheme);

    this.defineMenus();
    this.attachEventListeners();

    this.switchMenu(this.menus.main);
    // this.switchMenu(this.menus.editor);

    setInterval(() => {
      this.guiUpdate();
    }, 100);

    window.onresize = () => {
      this.isLooping = false;
      debounce({
        func: () => {
          this.isLooping = true;
        }
      });
    }
  }

  switchMenu(menu) {
    this.hideAllMenus();
    this.GuiMaker.get(menu).style.display = "block";
  }

  defineMenus() {
    // menu id="main"
    this.GuiMaker.add("body", `<div id="main" class="centered" style="display:none;"></div>`);
    this.GuiMaker.drawTable({
      parentSelector: "#main",
      td: [[`<div style="font-size: 50px; background:orange;" class="header">Bozo</div>`],
      [`<button id="new-project-button" class="button" style="font-size: 20px;">New project</button>`],
      [`<button id="settings-button" class="button" style="font-size: 20px;">Settings</div>`]
      ]
    });

    // menu id="settings"
    this.GuiMaker.add("body", `<div id="settings"></div>`);
    this.GuiMaker.add(`#settings`, `<h2>Settings</h2>`)

    // menu id="new-project-prompt"
    this.GuiMaker.add("body", `<div id="new-project-prompt" style="display:none;"></div>`);
    this.GuiMaker.add("#new-project-prompt", `<div style="background:rgb(0, 0, 0, 0.5); width:100%; height:100%; position:absolute; top:0px;"></div>`);
    this.GuiMaker.add("#new-project-prompt", `<div id="new-project-prompt-ui" class="table-container centered"></div>`)
    this.GuiMaker.drawTable({
      parentSelector: "#new-project-prompt-ui",
      td: [[`<div>New project</div>`],
      [`Project name:`, `<input id="project-name" placeholder="Project name"></input>`],
      [`Location:`, `<button id="new-project-location-button" class="button">choose location</button>`],
      [`<div id="location-path"></div>`],
      [`<button id="new-project-confirm">confirm</button>`, `<div style="float:right;"><button id="new-project-cancel">cancel</button></div>`]]
    });

    // menu id="editor"
    this.GuiMaker.add("body", `<div id="editor" style="display:none; width:100%; height:100%;"></div>`);
    this.renderer.showCanvas("#editor");
    // credit for clipboard icon https://www.w3schools.com/icons/tryit.asp?filename=tryicons_fa-clipboard
    // credit for grid style https://dev.to/dawnind/3-ways-to-display-two-divs-side-by-side-3d8b
    // credit for input https://www.w3schools.com/tags/att_input_value.asp

    this.GuiMaker.drawTable({
      parentSelector: "#editor", td: [[`<div style="text-align:center;">
    <i id="editor-settings-tab" class="tab has-menu fa fa-bars" style="width:40px;"></i>
    <i id="play" class="tab fa fa-play" style="width:40px;"></i>
  </div>`, `
  <div class="scrollmenu">
    <div class="tab has-menu" id="current-scene-info-tab">current-scene-info</div>
    <div class="tab has-menu" id="entities-tab">entities</div>
    <div class="tab has-menu" id="components-tab">components</div>
    <div class="tab has-menu" id="systems-tab">systems</div>
  </div>`]], colgroupAttributes: [`style="width:120px;"`], tableAttributes: `id="editor-scroll-menu"style="position:fixed; bottom:0px; background:var(--header-background); height:53px;"`
    });

    const tabs = this.GuiMaker.getAll(".tab.has-menu");
    var lastMenuHTML;
    var currentMenuHTML;
    let editorScrollMenuHeight = this.GuiMaker.get(`#editor-scroll-menu`).style.height;
    for (let i = 0; i < tabs.length; i++) {
      this.GuiMaker.add("body", `<div class="table-container" id="${tabs[i].id.slice(0, -4)}" style="display: none; width:100%; position:fixed; bottom:${editorScrollMenuHeight}; height:185px;"></div>`);

      tabs[i].addEventListener("click", () => {
        currentMenuHTML = this.GuiMaker.get("#" + tabs[i].id.slice(0, -4));
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

    // submenu id="current-scene-info"
    this.GuiMaker.drawTable({
      parentSelector: "#current-scene-info",
      td: [[`name: `, `<span id="scene-name"></span>`],
      [`entity count: `, `<span id="entity-count"></span>`]]
    });

    // submenu id="entities"
    this.GuiMaker.add("#entities", `<div id="draw-components"></div>`);
    this.GuiMaker.add("#entities", `<div style="position:sticky;bottom:0px;" id="entities-buttons"></div>`);
    this.GuiMaker.drawTable({
      parentSelector: "#entities-buttons",
      td: [[`<button class="button" id="create-entity" style="text-align:center; width:100%;">Add component</button>`, `<button class="button" id="add-component" style="text-align:center; width:100%;">Add entity</button>`]]
    });

    // submenu id="components"
    this.GuiMaker.add("#components", `<div id="world-components"></div>`);
    this.GuiMaker.add("#components", `<div style="position:sticky;bottom:0px;" id="components-buttons"></div>`);
    this.GuiMaker.drawTable({
      parentSelector: "#components-buttons",
      td: [[`<button class="button" style="text-align:center; width:100%;">New component</button>`]]
    });

    // submenu id="systems"
    this.GuiMaker.add("#systems", `<div id="world-systems"></div>`);
    this.GuiMaker.add("#systems", `<div style="position:sticky;bottom:0px;" id="systems-buttons"></div>`);
    this.GuiMaker.drawTable({
      parentSelector: "#systems-buttons",
      td: [[`<button class="button" style="text-align:center;width:100%;">New system</button>`]]
    });

    // submenu id="editor-settings"

  }

  attachEventListeners() {
    var dirHandle, path, projectName;
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

    this.GuiMaker.get(`#new-project-confirm`).onclick = async () => {
      projectName = this.GuiMaker.get(`#project-name`).value;
      try {
        let projectRootHandle = await dirHandle.getDirectoryHandle(projectName, { create: true });
        // let projectSrcDirHandle = await projectDirHandle.getDirectoryHandle("src", { create: true });
        let htmlFileHandle = await projectRootHandle.getFileHandle("index.html", { create: true });
        let stream = await htmlFileHandle.createWritable();
        await stream.write(`
          <!DOCTYPE html>
          <html lang="en">
          <head>
            <meta charset="UTF-8">
            <meta http-equiv="X-UA-Compatible" content="IE=edge">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>${projectName}</title>
          </head>
          <body>
            <h1>nice</h1>
          </body>
          </html>`);
        await stream.close();
        this.GuiMaker.get(`#new-project-prompt`).style.display = "none";
        this.switchMenu(this.menus.editor);
      } catch (err) {

      }
    }

    this.GuiMaker.get(`#new-project-cancel`).onclick = () => {
      this.GuiMaker.get(`#new-project-prompt`).style.display = "none";
    }

    this.GuiMaker.get("#create-entity").onclick = () => {

    }

    this.GuiMaker.get("#add-component").onclick = () => {

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