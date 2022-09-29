import GuiMaker from "./utils/gui/GuiMaker.js";
import Engine from "./utils/Engine.js";
import uuidv4 from "./utils/uuidv4.js";
import config from './config.js';

const GM = new GuiMaker;
const E = new Engine;

const menus = {
  // main: "#main",
  editor: "#editor",
}
const themes = ['light', 'dark'];
/**
 * credits for symbols
 * https://www.toptal.com/designers/htmlarrows/symbols/#
 * https://www.rapidtables.com/web/html/html-codes.html#
 * https://fontawesome.com/search?o=r&m=free
 */
const symbols = {
  circle: {
    normal: '●',
    outline: '◯',
    cross: '⨂'
  },
  play: '<i class="fa-solid fa-play"></i>',
  bars: '<i class="fa-solid fa-bars"></i>',
  undefined: 'N/A',
  xMark: '<i class="fa-solid fa-xmark"></i>',
  download: '<i class="fa-solid fa-download"></i>',
  pause: '<i class="fa-solid fa-pause"></i>',
  chevron: {
    right: '<i class="fa-solid fa-chevron-right"></i>',
    down: '<i class="fa-solid fa-chevron-down"></i>',
    up: '<i class="fa-solid fa-chevron-up"></i>',
    left: '<i class="fa-solid fa-chevron-left"></i>'
  },
  trashCan: '<i class="fa-solid fa-trash-can"></i>',
  powerOff: '<i class="fa-solid fa-power-off"></i>',
  check: '<i class="fa-solid fa-check"></i>',
  pen: '<i class="fa-solid fa-pen"></i>',
  plus: '<i class="fa-solid fa-plus"></i>',
  minus: '<i class="fa-solid fa-minus"></i>',
  gear: '<i class="fa-solid fa-gear"></i>',
  Bozo: {
    '32x32': '<div style="text-align:center; background:#ff8c00; line-height:32px; width:32px; height:32px; border-radius:4px; display:inline-block;">B</div>'
  }
}

// credit: https://medium.com/hypersphere-codes/detecting-system-theme-in-javascript-css-react-f6b961916d48
const darkThemeMq = window.matchMedia("(prefers-color-scheme: dark)");
darkThemeMq.matches ? document.body.classList = "dark" : document.body.classList = "light";

export default function generatePage() {
  E.init();
  defineMenus();
  attachEventListeners();
  switchMenu(menus.editor);
  E.renderer.changeCanvas(GM.get("canvas"));
  setInterval(() => {
    guiUpdate();
  }, 300);
}

function switchMenu(menu) {
  hideAllMenus();
  GM.get(menu).style.display = "block";
}

function defineMenus() {
  const mask = `<div style="background:rgb(0, 0, 0, 0.5); width:100%; height:100%; position:absolute; top:0px;"></div>`;

  // menu id="main"
  // GM.add("body", `<div id="main" class="centered" style="display:none;"></div>`);
  // GM.drawTable({
  //   parentSelector: "#main",
  //   td: [[`<div style="font-size: 50px; background:#ff8c00; padding:5px;" class="header">Bozo</div>`],
  //   [`<button id="new-project-button" style="font-size:20px; padding:5px;">New project</button>`],
  //   [`<button id="settings-button" style="font-size:20px; padding:5px;">Settings</button>`],
  //   ]
  // });

  // // menu id="new-project-prompt"
  // GM.add("body", `<div id="new-project-prompt" style="display:none;"></div>`);
  // GM.add("#new-project-prompt", mask).onclick = () => {
  //   GM.get('#new-project-prompt').style.display = "none";
  // };
  // GM.add("#new-project-prompt", `<div id="new-project-prompt-ui" class="centered" style="background:var(--header-background); overflow:auto;"></div>`);
  // GM.add("#new-project-prompt-ui", `<div id="new-project-prompt-header" style="margin:10px;"></div>`);
  // GM.drawTable({
  //   parentSelector: "#new-project-prompt-header",
  //   td: [
  //     [`<div style="color:var(--primary-text-color); font-size:20px;">New project</div>`, `<div style="float:right;"><button id="new-project-cancel">cancel</button></div>`]
  //   ]
  // })
  // GM.add("#new-project-prompt-ui", `<div id="new-project-prompt-list" class="table-container"></div>`)
  // GM.drawTable({
  //   parentSelector: "#new-project-prompt-list",
  //   td: [
  //     [`Project name:`, `<input id="project-title" placeholder="Project name" style="width:100%;"></input>`],
  //     [`Location:`, `<div id="location-path" style="white-space:nowrap; width:100%; overflow:auto;">${symbols.undefined}</div>`],
  //   ]
  // });
  // GM.add("#new-project-prompt-ui", `<div id="new-project-prompt-footer" style="margin:10px;"></div>`)
  // GM.drawTable({
  //   parentSelector: "#new-project-prompt-footer",
  //   td: [[`<button id="new-project-location-button">choose location</button>`, `<div style="float:right;"><button id="new-project-confirm">confirm</button></div>`]]
  // })

  // menu id="editor"
  // credit for grid style https://dev.to/dawnind/3-ways-to-display-two-divs-side-by-side-3d8b
  // credit for input https://www.w3schools.com/tags/att_input_value.asp
  let editorScrollMenuHeight = '70px';
  GM.add("body", `<div id="editor" style="display:none; width:100%; height:100%;"></div>`);
  GM.add("#editor", `<div class="centered"><canvas></canvas></div>`);
  GM.drawTable({
    parentSelector: "#editor",
    td: [
      [`<div id="scroll-menu-collapse" style="text-align:center; font-size:20px; height:50px; line-height:50px;">${symbols.chevron.down}</div>`],
      [`<div id="editor-scroll-menu" style="height:${editorScrollMenuHeight}; background:var(--header-background);"></div>`]
    ],
    tableAttributes: `style="position:absolute; bottom:0px;"`
  });
  GM.drawTable({
    parentSelector: '#editor-scroll-menu',
    td: [
      [`
        <div style="text-align:center;">
          <div id="settings-tab" class="tab" style="width:40px; font-size:20px; height:100%;">${symbols.bars}</div>
          <div id="play" class="tab" style="width:40px; font-size:20px; height:100%;">${symbols.play}</div>
        </div>
        `, `
        <div class="scrollmenu">
          <div class="tab has-menu" id="scenes-tab" style="height:100%;">Scenes</div>
          <div class="tab has-menu" id="entities-tab" style="height:100%;">Entities</div>
          <div class="tab has-menu" id="components-tab" style="height:100%;">Components</div>
          <div class="tab has-menu" id="systems-tab" style="height:100%;">Systems</div>
        </div>`],
    ],
    colgroupAttributes: [`style="width:120px;"`],
  });

  let hasMenuTabs = GM.getAll('.tab.has-menu');
  for (let i = 0; i < hasMenuTabs.length; i++) {
    // expecting id format: '...-tab'
    GM.add('body', `<div id="${hasMenuTabs[i].id.slice(0, -4)}" style="overflow:hidden; display:none; background:var(--header-background); width:100%; position:fixed; bottom:${editorScrollMenuHeight}; height:50%;"></div>`);
  }

  // submenu id="scenes"
  GM.drawTable({
    parentSelector: "#scenes",
    td: [
      [`<div id="all-scenes" style="margin:10px; overflow:auto; height:100%;"></div>`],
      [`<button id="new-scene-button" style="text-align:center; width:100%;">New scene</button>`]
    ],
    trAttributes: ['', 'style="height:30px;"'],
    tableAttributes: `style="height:100%;"`
  })

  // submenu id="entities"
  GM.drawTable({
    parentSelector: "#entities",
    td: [
      [`<div id="all-entities" style="margin:10px; overflow:auto; height:100%;"></div>`],
      [`<button id="new-entity-button" style="text-align:center; width:100%;">New entity</button>`]
    ],
    trAttributes: ['', 'style="height:30px;"'],
    tableAttributes: `style="height:100%;"`
  })

  // submenu id="components"
  GM.drawTable({
    parentSelector: "#components",
    td: [
      [`<div id="all-components" style="margin:10px; overflow:auto; height:100%;"></div>`],
      [`<button id="new-component-button" style="text-align:center; width:100%;">New component</button>`]
    ],
    trAttributes: ['', 'style="height:30px;"'],
    tableAttributes: `style="height:100%;"`
  })
  // component drawing methods dropdown menu
  drawDropdownMenu('component-drawing-methods-dropdown', ['Vec2', 'Color', 'Text', 'Checkbox', 'Number', 'Image'])

  // component settings dropdown
  drawDropdownMenu('component-settings', ['Edit', 'Remove']);

  // submenu id="systems"
  GM.drawTable({
    parentSelector: "#systems",
    td: [
      [`<div id="all-systems" style="margin:10px; overflow:auto; height:100%;"></div>`],
      [`<button id="new-system-button" style="text-align:center; width:100%;">New system</button>`]
    ],
    trAttributes: ['', 'style="height:30px;"'],
    tableAttributes: `style="height:100%;"`
  })

  // menu id="settings"
  GM.add("body", `<div id="settings" style="position:absolute; top:0px; display:none; width:100%; height:100%;"></div>`);
  GM.add("#settings", mask).onclick = () => {
    GM.get("#settings").style.display = 'none';
  };
  GM.add("#settings", `<div id="settings-ui" style="height:100%; width:50%; min-width:270px; position:absolute; overflow:hidden; background:var(--header-background);"></div>`);
  GM.drawTable({
    parentSelector: "#settings-ui",
    td: [
      [`<div id="settings-header" style="margin:10px;"></div>`],
      [`<div id="settings-list" style="overflow:auto;" class="table-container"><div>`]
    ]
  })
  GM.drawTable({
    parentSelector: "#settings-header",
    td: [
      [`<div style="color:var(--primary-text-color); font-size:25px; white-space:nowrap;">${symbols.Bozo["32x32"]} Settings</div>`, `<button id="settings-close-button" style="float:right;">${symbols.xMark}</button>`],
    ],
    colgroupAttributes: ['', 'style="width:60px;"']
  });
  GM.drawTable({
    parentSelector: "#settings-list",
    td: [
      [`<button id="a2hs-button" style="white-space:nowrap; width:200%; padding:5px;">${symbols.download} Install Bozo</button>`],
      ['Themes', `<select id="theme-select" style="padding:5px;"></select>`],
      [`<div id="renderer-options" style="width:200%;"></div>`],
    ]
  });

  // themes
  for (let i = 0; i < themes.length; i++) {
    let option = GM.add("#theme-select", `<option>${themes[i]}</option>`);
    if (!document.body.classList.contains(option.innerText)) continue;
    option.toggleAttribute("selected");
  }

  // renderer
  drawCollapsible("Renderer", "#renderer-options", 'var(--header-background)');
  GM.drawTable({
    parentSelector: `#renderer-options-collapsible-container`,
    td: [
      [`<div id="display-size-vec2-input"></div>`],
      [`<div id="pixel-density"></div>`],
      ['<div id="clear-color-input"></div>'],
      [`<div id="is-fullscreen"></div>`],
      [`<div id="renderer-options-apply" style="float:right;"><button>apply</button></div>`]
    ],
  })
  drawVec2Input("Display size", `#display-size-vec2-input`, { x: E.renderer.size.x, y: E.renderer.size.y });
  drawNumberInput("Pixel density", "#pixel-density", E.renderer.pixelDensity);
  drawColorInput("Clear color", "#clear-color-input", E.renderer.clearColor);
  drawCheckboxInput("Fullscreen", "#is-fullscreen", E.renderer.isFullscreen);
}

function attachEventListeners() {
  // // main
  // GM.get("#settings-button").onclick = () => {
  //   GM.get("#settings").style.display = "block";
  // }

  // // main new-project-prompt
  // var dirHandle;
  // var project = {};
  // GM.get("#new-project-button").onclick = () => {
  //   GM.get("#new-project-prompt").style.display = "block";
  // }
  // // credit: https://developer.mozilla.org/en-US/docs/Web/API/File_System_Access_API
  // GM.get("#new-project-location-button").onclick = async () => {
  //   dirHandle = await window.showDirectoryPicker();
  //   GM.get('#location-path').innerText = "./" + dirHandle.name;
  // }
  // GM.get(`#new-project-confirm`).onclick = async () => {
  //   if (GM.get(`#project-title`).value === "" || dirHandle === undefined) return;
  //   project.title = GM.get(`#project-title`).value;
  //   for await (let key of dirHandle.keys()) {
  //     if (key !== project.title) continue;
  //     return console.log("directory exists please rename");
  //   }
  //   project.root = await dirHandle.getDirectoryHandle(project.title, { create: true });
  //   project.src = await project.root.getDirectoryHandle("src", { create: true });

  //   // /index.html
  //   overwriteFileInDir(project.root, "index.html", files.index.replace("$PROJECT_TITLE", project.title))

  //   // /src/ECS.js
  //   overwriteFileInDir(project.src, "ECS.js", files.ECS);

  //   async function overwriteFileInDir(dir, fileName, buffer) {
  //     let srcFile = await dir.getFileHandle(fileName, { create: true });
  //     let stream = await srcFile.createWritable();
  //     await stream.write(buffer);
  //     await stream.close();
  //   }

  //   GM.get(`#new-project-prompt`).style.display = "none";
  //   switchMenu(menus.editor);
  // }
  // GM.get(`#new-project-cancel`).onclick = () => {
  //   GM.get(`#new-project-prompt`).style.display = "none";
  // }

  // scroll-menu-collapse
  GM.get("#scroll-menu-collapse").onclick = () => {
    GM.get("#editor-scroll-menu").classList.toggle("hidden");
    if (GM.get("#editor-scroll-menu").classList.contains("hidden")) {
      GM.update("#scroll-menu-collapse", symbols.chevron.up);
    } else {
      GM.update("#scroll-menu-collapse", symbols.chevron.down);
    }
  }

  // settings
  {
    GM.get("#settings-close-button").onclick = () => {
      GM.get("#settings").style.display = "none";
    }
    GM.get('#theme-select').onchange = () => {
      document.body.classList = GM.get('#theme-select').value;
    }
    GM.get("#renderer-options").onchange = () => {
      if (!GM.get("#renderer-unapplied-changes")) GM.add("#renderer-options-collapsible-container", `<div id="renderer-unapplied-changes">There are unapplied changes</div>`);
    }
    GM.get("#renderer-options-apply").onclick = () => {
      E.renderer.setSize = { x: parseInt(GM.get("#display-size-vec2-input-x").value), y: parseInt(GM.get("#display-size-vec2-input-y").value) };
      E.renderer.setClearColor = GM.get("#clear-color-input-color").value;
      E.renderer.setPixelDensity = parseInt(GM.get("#pixel-density-number").value);
      E.renderer.setFullscreen = GM.get("#is-fullscreen-checkbox").checked;
      E.renderer.handleFullscreen();
      GM.remove("#renderer-unapplied-changes");
    }
    // credit: https://github.com/mdn/pwa-examples/tree/master/a2hs
    let deferredPrompt;
    const a2hs = GM.get("#a2hs-button");
    a2hs.style.display = "none";
    window.addEventListener("beforeinstallprompt", (e) => {
      e.preventDefault();
      deferredPrompt = e;
      a2hs.style.display = "block";
      a2hs.onclick = () => {
        a2hs.style.display = "none";
        deferredPrompt.prompt();
        deferredPrompt.userChoice.then(() => {
          deferredPrompt = null;
        })
      }
    })
    window.addEventListener("appinstalled", () => {
      console.log("app installed");
      deferredPrompt = null;
    })
  }

  // tab behavior
  {
    const tabs = GM.getAll(".tab");
    for (let i = 0; i < tabs.length; i++) {
      tabs[i].onclick = () => {
        tabs[i].classList.toggle("active");
      };
    }
  }

  // hasMenuTabs
  {
    const hasMenuTabs = GM.getAll(".tab.has-menu");
    var current;
    var last;
    for (let i = 0; i < hasMenuTabs.length; i++) {
      hasMenuTabs[i].onclick = () => {
        current = hasMenuTabs[i];
        if (!current.classList.contains("active")) {
          if (last && last != current) {
            last.classList.remove("active");
            GM.get(`#${last.id.slice(0, -4)}`).style.display = "none";
          }
          current.classList.add("active");
          GM.get(`#${current.id.slice(0, -4)}`).style.display = "block";
        } else {
          current.classList.remove("active");
          GM.get(`#${current.id.slice(0, -4)}`).style.display = "none";
        }
        last = current;
      }
    }
    GM.get('#settings-tab').onclick = () => {
      GM.get('#settings').style.display = "block";
    }
  }

  // scenes
  GM.get("#new-scene-button").onclick = () => {
    let world = E.ecs.createWorld();
    GM.add(`#all-scenes`, `<div id="scene-info-${world.id}" class="table-container"></div>`);
    GM.drawTable({
      parentSelector: `#scene-info-${world.id}`,
      td: [
        ['Title:', `<input id="world-title-${world.id}" style="width:100%;" value="${world.title}"></input>`],
        ['Active status:', `<div id="is-active-${world.id}">${symbols.circle.outline}</div>`],
      ],
      colgroupAttributes: [`style="width:20%; min-width:130px;"`]
    })
    GM.drawTable({
      parentSelector: `#scene-info-${world.id}`,
      td: [
        [`<button id="scene-active-${world.id}" style="width:100%;">${symbols.check} Set active</button>`, `<button id="scene-remove-${world.id}" style="width:100%;">${symbols.trashCan} Remove</button>`],
      ],
    })
    GM.get(`#world-title-${world.id}`).onchange = () => {
      world.setTitle = GM.get(`#world-title-${world.id}`).value;
    }
    GM.get(`#scene-remove-${world.id}`).onclick = () => {
      GM.remove(`#scene-${world.id}`);
      E.ecs.removeWorld(world.id);
    }
    GM.get(`#scene-active-${world.id}`).onclick = () => {
      E.ecs.setActiveWorld = world;
      checkActiveWorld();
    }
    checkActiveWorld();

    function checkActiveWorld() {
      for (let i = 0; i < E.ecs.worlds.length; i++) {
        let result = E.ecs._activeWorld.id === E.ecs.worlds[i].id ? `<div style="color:lightgreen; font-size:25px;">${symbols.circle.normal}</div>` : `<div style="font-size:25px;">${symbols.circle.outline}</div>`;
        GM.update(`#is-active-${E.ecs.worlds[i].id}`, result);
      }
    }
  }

  // assemblages
  GM.get("#new-entity-button").onclick = () => {
    let id = uuidv4();
    GM.add("#all-entities", `<div class="table-container" id="container-${id}"></div>`);
    GM.drawTable({
      parentSelector: `#container-${id}`,
      td: [
        ["Title:", `<input style="width:100%;" id="title-${id}" value="New entity">`],
        [`Registration status:`, `<div id="status-${id}" style="font-size:25px;">${symbols.circle.outline}</div>`],
        [`Components:`, `<div id="components-${id}"></div>`],
      ],
      colgroupAttributes: [`style="width:20%; min-width:130px;"`]
    })
    GM.drawTable({
      parentSelector: `#container-${id}`,
      td: [
        [`<button id="edit-${id}" style="width:100%;">Edit components</button>`, `<button style="width:100%;" id="register-${id}">Register</button>`, `<button id="remove-${id}" style="width:100%;">${symbols.trashCan} Remove</button>`]
      ]
    })
    GM.get(`#remove-${id}`).onclick = () => {
      GM.remove(`#container-${id}`);
    }
    GM.get(`#edit-${id}`).onclick = () => {

    }
    GM.get(`#container-${id}`).onchange = () => {
    }
  }

  // components
  GM.get("#new-component-button").onclick = drawNewComponent;

  // Draw predefined components from config.js
  for (let i = 0; i < config.components.length; i++) {
    drawNewComponent(config.components[i]);
  }
  function drawNewComponent(compObj) {
    // Unique id for the component and divs
    let id = uuidv4();
    let component = compObj || {};
    GM.add('#all-components', `<div class="table-container" id="container-${id}"></div>`);
    GM.drawTable({
      parentSelector: `#container-${id}`,
      td: [
        [`Title:`, `<input style="width:100%;" id="title-${id}" value="${component.title || `New component`}">`, `<div style="text-align:center;"><button id="component-settings-${id}">${symbols.gear}</button></div>`],
      ],
      colgroupAttributes: [`style="width:20%; min-width:130px;"`, ``, `style="width:80px;"`]
    })

    drawCollapsible(`Data`, `#container-${id}`, 'var(--header-background)');
    GM.add(`#container-${id}-collapsible-container`, `<div id="data-list-${id}"></div>`);
    GM.add(`#container-${id}-collapsible-container`, `<button style="width:100%;" id="data-add-${id}">${symbols.plus}</button>`)

    // When it isn't a PointerEvent, it is a predefined component
    if (compObj.constructor.name !== 'PointerEvent') {
      GM.get(`#data-add-${id}`).classList.toggle('hidden', true);
      deserializeInputs(`#data-list-${id}`, component.data, false, false);
    }

    GM.get(`#component-settings-${id}`).onclick = (e) => {
      let settings = GM.get(`#component-settings-${id}`);
      let dropdown = GM.get('#component-settings');
      if (settings.lastChild == dropdown) {
        dropdown.classList.toggle('hidden');
      } else {
        dropdown.classList.remove('hidden');
        settings.appendChild(dropdown);
      }

      switch (e.target.innerText) {
        case 'Edit':
          GM.get(`#data-add-${id}`).classList.toggle('hidden');
          if (GM.get(`#data-add-${id}`).classList.contains('hidden')) {
            let dataObj = serializeInputs(`#data-list-${id}`);
            if (!dataObj) return;
            component.title = GM.get(`#title-${id}`).value;
            component.data = dataObj;
            deserializeInputs(`#data-list-${id}`, component.data, false, false);
          } else {
            deserializeInputs(`#data-list-${id}`, component.data);
          }
          break;
        case 'Remove':
          document.body.appendChild(GM.get('#component-drawing-methods-dropdown'));
          document.body.appendChild(GM.get('#component-settings'));
          GM.remove(`#container-${id}`);
          break;
        default:
          break;
      }
    }

    GM.get(`#data-add-${id}`).onclick = drawData;

    // Should put the DOM manipulation code in a separate function
    function drawData(e) {
      drawInput(e.target.innerText, ``, `#data-list-${id}`);
      let add = GM.get(`#data-add-${id}`);
      let dropdown = GM.get('#component-drawing-methods-dropdown');
      if (add.lastChild == dropdown) {
        dropdown.classList.toggle('hidden');
      } else {
        dropdown.classList.remove('hidden');
        add.appendChild(dropdown);
      }
    }
  }

  // system
  GM.get("#new-system-button").onclick = () => {
    let id = uuidv4();
    GM.add('#all-systems', `<div class="table-container" id="container-${id}"></div>`);
    GM.drawTable({
      parentSelector: `#container-${id}`,
      td: [
        [`Title:`, `<input style="width:100%;" id="title-${id}" value="New system">`],
        [`Registration status:`, `<div id="status-${id}" style="font-size:25px;">${symbols.circle.outline}</div>`]
      ],
      colgroupAttributes: [`style="width:20%; min-width:100px;"`]
    })
    GM.drawTable({
      parentSelector: `#container-${id}`,
      td: [
        [`<button id="edit-${id}" style="width:100%;">Edit</button>`, `<button style="width:100%;" id="register-${id}">Register</button>`, `<button style="width:100%;" id="remove-${id}">Remove</button>`]
      ]
    })
    GM.get(`#remove-${id}`).onclick = () => {
      GM.remove(`#container-${id}`);
    }
    GM.get(`#edit-${id}`).onclick = () => {

    }
  }

  GM.get('#play').onclick = () => {
    GM.get(`#play`).classList.toggle('active');
    GM.get('#play').classList.contains('active') ? E.ecs.activeWorld?.disable() : E.ecs.activeWorld?.enable();
  }
}

function hideAllMenus() {
  for (let menu in menus) {
    GM.get(menus[menu]).style.display = "none";
  }
}

function guiUpdate() {
}

function deserializeInputs(parentSelector, dataObj, inputs = true, editableLabels = true) {
  if (!dataObj) return;
  GM.update(parentSelector, ``);
  for (let prop in dataObj) {
    let name = editableLabels ? `<input placeholder="${dataObj[prop].type} input label" value="${prop}">` : prop;
    drawInput(dataObj[prop].type, name, parentSelector, dataObj[prop].data);
  }
  if (inputs) return;
  let inputElements = GM.getAll(`${parentSelector} input`);
  for (let i = 0; i < inputElements.length; i++) {
    inputElements[i].disabled = true;
  }
}

function serializeInputs(parentSelector) {
  let inputs = GM.getAll(`${parentSelector} input`);
  let values = [];
  let types = [];
  let dataObj = {};
  let valuesIndex = 0;

  // Need to know the type of data to serialize
  for (let i = 0; i < inputs.length; i++) {
    // The end of an id is always the type
    let inputIdLast = inputs[i].id.split('-').pop();
    switch (inputIdLast) {
      // When there is 'x' at the end of an id, it is a Vec2
      case 'x':
        types.push('Vec2');
        break;
      // So don't care about 'y' anymore
      case 'y':
        break;
      // Type needs to be capitalized
      default:
        // Not all ids can be split, this prevents that
        if (!inputIdLast) break;
        // Capitalization
        types.push(inputIdLast.at(0).toUpperCase() + inputIdLast.slice(1));
        break;
    }
    values.push(inputs[i].type !== "checkbox" ? inputs[i].value : inputs[i].checked);
  }

  // Construct the data object
  for (let i = 0; i < types.length; i++) {
    let title, data;
    switch (types[i]) {
      case 'Vec2':
        title = values[valuesIndex] || ' ';
        data = { x: parseFloat(values[valuesIndex + 1]), y: parseFloat(values[valuesIndex + 2]) };
        valuesIndex += 3;
        break;
      default:
        title = values[valuesIndex] || ' ';
        data = values[valuesIndex + 1];
        valuesIndex += 2;
        break;
    }
    // If title is space, continue to prevent collision in dataObj. However, the data is lost.
    if (title === ' ') continue;

    dataObj[title] = { data, type: types[i] };
  }
  return dataObj;
}

// Separated each input types drawing method, so each one can be customized. There are still more types of inputs though.
function drawColorInput(name, parentSelector, defaultValue = "#000000") {
  let id = `${parentSelector.slice(1)}-color`;
  GM.drawTable({
    parentSelector,
    td: [
      [`<label for="${id}">${name}</label>:`, `<input id="${id}" type="color" value="${defaultValue}">`]
    ]
  })
}

function drawImageInput(name, parentSelector) {
  let id = `${parentSelector.slice(1)}-image`;
  GM.drawTable({
    parentSelector,
    td: [
      [`<label for="${id}">${name}</label>:`, `<input id="${id}" type="image" value="choose image">`]
    ]
  })
}

function drawVec2Input(name, parentSelector, defaultValues = { x: 0, y: 0 }) {
  let idx = `${parentSelector.slice(1)}-x`;
  let idy = `${parentSelector.slice(1)}-y`;
  GM.drawTable({
    parentSelector,
    td: [
      [`<label style="white-space:nowrap;">${name}</label>:`],
      [`<div style="background:red; width:100%; padding:5px;"><label for="${idx}">x</label></div>`, `<div style="background:green; width:100%; padding:5px;"><label for="${idy}">y</label></div>`],
      [`<input id="${idx}" type="number" style="width:100%;" value="${defaultValues.x}">`, `<input id="${idy}" type="number" style="width:100%;" value="${defaultValues.y}">`]
    ],
  });
}

function drawNumberInput(name, parentSelector, defaultValue = 0) {
  let id = `${parentSelector.slice(1)}-number`;
  GM.drawTable({
    parentSelector,
    td: [
      [`<label for="${id}">${name}</label>:`, `<input id="${id}" type="number" value="${defaultValue}" style="width:100%;">`]
    ],
  })
}

function drawTextInput(name, parentSelector, defaultValue = ``) {
  let id = `${parentSelector.slice(1)}-text`;
  GM.drawTable({
    parentSelector,
    td: [
      [`<label for="${id}">${name}</label>:`, `<input id="${id}" value="${defaultValue}" style="width:100%;">`]
    ]
  })
}

function drawCheckboxInput(name, parentSelector, defaultValue = false) {
  let id = `${parentSelector.slice(1)}-checkbox`;
  let isChecked = "";
  if (defaultValue) isChecked = 'checked';
  GM.drawTable({
    parentSelector,
    td: [
      [`<label for="${id}">${name}</label>:`, `<input id="${id}" type="checkbox" ${isChecked}>`]
    ]
  });
}

function drawCollapsible(name, parentSelector, containerBackground, isCollapsed = true) {
  GM.drawTable({
    parentSelector,
    td: [
      [`<div id="${parentSelector.slice(1)}-collapsible-header" class="collapsible">${name} <span>${symbols.chevron.right}</span></div>`],
      [`<div id="${parentSelector.slice(1)}-collapsible-container" class="table-container" style="display:none; background:${containerBackground};"></div>`]
    ]
  });
  let span = GM.get(`#${parentSelector.slice(1)}-collapsible-header span`);
  let container = GM.get(`#${parentSelector.slice(1)}-collapsible-container`);

  if (!isCollapsed) {
    span.innerHTML = symbols.chevron.down;
    container.style.display = "block";
  }

  GM.get(`#${parentSelector.slice(1)}-collapsible-header`).onclick = () => {
    if (container.style.display == "none") {
      span.innerHTML = symbols.chevron.down;
      container.style.display = "block";
    } else {
      span.innerHTML = symbols.chevron.right;
      container.style.display = "none";
    }
  }
}

function drawDropdownMenu(id, td) {
  GM.add('body', `<div class="hidden" style="background:var(--body-background-color); color:var(--secondary-text-color);" id="${id}"></div>`)
  let data = [];
  for (let i = 0; i < td.length; i++) {
    data.push([`<div class="dropdown-content" style="padding:3px;">${td[i]}</div>`]);
  }
  GM.drawTable({
    parentSelector: `#${id}`,
    td: data,
  })
}

// This function utilizes the other input drawing functions, so only one function is needed for serializing
function drawInput(type, name, parentSelector, defaultValues) {
  let label = name ? name : `<input placeholder="${type} input label">`;
  switch (type) {
    case 'Vec2':
      drawVec2Input(label, parentSelector, defaultValues);
      break;
    case 'Text':
      drawTextInput(label, parentSelector, defaultValues);
      break;
    case 'Color':
      drawColorInput(label, parentSelector, defaultValues);
      break;
    case 'Number':
      drawNumberInput(label, parentSelector, defaultValues);
      break;
    case 'Checkbox':
      drawCheckboxInput(label, parentSelector, defaultValues);
      break;
    case 'Image':
      drawImageInput(label, parentSelector);
      break;
    default:
      break;
  }
}