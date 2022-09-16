import GuiMaker from "./utilities/gui/GuiMaker.js";
import { files } from "./files.js";

const GM = new GuiMaker;
const menus = {
  main: "#main",
  editor: "#editor",
}
// credit: https://medium.com/hypersphere-codes/detecting-system-theme-in-javascript-css-react-f6b961916d48
const darkThemeMq = window.matchMedia("(prefers-color-scheme: dark)");
darkThemeMq.matches ? document.body.classList = "dark" : document.body.classList = "light";

export default function generatePage() {
  defineMenus();
  attachEventListeners();

  switchMenu(menus.main);

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
  GM.add("body", `<div id="main" class="centered" style="display:none;"></div>`);
  GM.drawTable({
    parentSelector: "#main",
    td: [[`<div style="font-size: 50px; background:#ff8c00; padding:5px;" class="header">Bozo</div>`],
    [`<button id="new-project-button" style="font-size:20px; padding:5px;">New project</button>`],
    [`<button id="settings-button" style="font-size:20px; padding:5px;">Settings</button>`],
    ]
  });

  // menu id="new-project-prompt"
  GM.add("body", `<div id="new-project-prompt" style="display:none;"></div>`);
  GM.add("#new-project-prompt", mask).onclick = () => {
    GM.get('#new-project-prompt').style.display = "none";
  };
  GM.add("#new-project-prompt", `<div id="new-project-prompt-ui" class="centered" style="background:var(--header-background); overflow:auto;"></div>`);
  GM.add("#new-project-prompt-ui", `<div id="new-project-prompt-header" style="margin:10px;"></div>`);
  GM.drawTable({
    parentSelector: "#new-project-prompt-header",
    td: [
      [`<div style="color:var(--primary-text-color); font-size:20px;">New project</div>`, `<div style="float:right;"><button id="new-project-cancel">cancel</button></div>`]
    ]
  })
  GM.add("#new-project-prompt-ui", `<div id="new-project-prompt-list" class="table-container" style="margin:10px; padding:10px; border-radius:10px;"></div>`)
  GM.drawTable({
    parentSelector: "#new-project-prompt-list",
    td: [
      [`Project name:`, `<input id="project-name" placeholder="Project name" style="width:100%;"></input>`],
      [`Location:`, `<button id="new-project-location-button">choose location</button>`],
      [`<div id="location-path"></div>`],
      ["", `<div style="float:right;"><button id="new-project-confirm">confirm</button></div>`]]
  });

  // menu id="editor"
  GM.add("body", `<div id="editor" style="display:none; width:100%; height:100%;"></div>`);
  GM.add("#editor", '<canvas></canvas>')
  // credit for clipboard icon https://www.w3schools.com/icons/tryit.asp?filename=tryicons_fa-clipboard
  // credit for grid style https://dev.to/dawnind/3-ways-to-display-two-divs-side-by-side-3d8b
  // credit for input https://www.w3schools.com/tags/att_input_value.asp
  // credit for symbols https://www.toptal.com/designers/htmlarrows/symbols/#
  GM.drawTable({
    parentSelector: "#editor",
    td: [
      [`
        <div style="text-align:center;">
          <div id="editor-settings-tab" class="tab has-menu" style="width:40px; font-size:30px;">☰</div>
          <div class="tab" style="width:40px; font-size:30px;">➤</div>
        </div>
        `, `
        <div class="scrollmenu">
          <div class="tab has-menu" id="scenes-tab">scenes</div>
          <div class="tab has-menu" id="entities-tab">entities</div>
          <div class="tab has-menu" id="components-tab">components</div>
          <div class="tab has-menu" id="systems-tab">systems</div>
        </div>`]], colgroupAttributes: [`style="width:120px;"`], tableAttributes: `id="editor-scroll-menu"style="position:fixed; bottom:0px; background:var(--header-background); height:53px;"`
  });

  const tabs = GM.getAll(".tab.has-menu");
  var lastMenuHTML;
  var currentMenuHTML;
  let editorScrollMenuHeight = GM.get(`#editor-scroll-menu`).style.height;
  for (let i = 0; i < tabs.length; i++) {
    GM.add("body", `<div class="table-container" id="${tabs[i].id.slice(0, -4)}" style="display: none; width:100%; position:fixed; bottom:${editorScrollMenuHeight}; height:185px;"></div>`);

    // creates a menu for all .tab.has-menu elements
    tabs[i].addEventListener("click", () => {
      currentMenuHTML = GM.get("#" + tabs[i].id.slice(0, -4));
      if (lastMenuHTML && lastMenuHTML != currentMenuHTML) {
        lastMenuHTML.style.display = "none";
        GM.get("#" + lastMenuHTML.id + "-tab").classList.remove("active");
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

  // submenu id="scenes"
  GM.drawTable({
    parentSelector: "#scenes",
    td: []
  });

  // submenu id="entities"
  GM.add("#entities", `<div id="world-assemblages"></div>`);
  GM.add("#entities", `<div style="position:sticky;bottom:0px;" id="entities-buttons"></div>`);
  GM.drawTable({
    parentSelector: "#entities-buttons",
    td: [[`<button id="new-assemblage-button" style="text-align:center; width:100%;">New entity</button>`]]
  });

  // submenu id="components"
  GM.add("#components", `<div id="world-components"></div>`);
  GM.add("#components", `<div style="position:sticky; bottom:0px;" id="components-buttons"></div>`);
  GM.drawTable({
    parentSelector: "#components-buttons",
    td: [[`<button id="new-component-button" style="text-align:center; width:100%;">New component</button>`]]
  });

  // submenu id="systems"
  GM.add("#systems", `<div id="world-systems"></div>`);
  GM.add("#systems", `<div style="position:sticky; bottom:0px;" id="systems-buttons"></div>`);
  GM.drawTable({
    parentSelector: "#systems-buttons",
    td: [[`<button id="new-system-button" style="text-align:center; width:100%;">New system</button>`]]
  });

  // submenu id="editor-settings"

  // submenu id="settings"
  var settingsHeaderHeight;
  GM.add("body", `<div id="settings" style="display:none; width:100%; height:100%;"></div>`);
  GM.add("#settings", mask).onclick = () => {
    GM.get("#settings").style.display = 'none';
  };
  GM.add("#settings", `<div id="settings-ui" style="height:100%; width:300px; position:absolute; overflow:hidden; background:var(--header-background);"></div>`);
  GM.add("#settings-ui", `<div id="settings-header" style="margin:10px; height:30px;"></div>`)
  GM.drawTable({
    parentSelector: "#settings-header",
    td: [
      [`<div style="color:var(--primary-text-color); font-size:25px;">Settings</div>`, `<button id="settings-close-button" style="float:right;">close</button>`],
    ]
  });
  settingsHeaderHeight = GM.get("#settings-header").style.height;
  GM.add("#settings-ui", `<div id="settings-list" style="overflow:auto; padding:10px; margin:10px; border-radius:10px; height:calc(100% - ${settingsHeaderHeight} - 30px);" class="table-container"><div>`)
  GM.drawTable({
    parentSelector: "#settings-list",
    td: [
      [`<button id="a2hs-button" style="white-space:nowrap; width:200%; padding:5px;">Add To Home Screen</button>`],
      ['Themes', `<select id="theme-select" style="padding:5px;"><option>dark</option><option>light</option></select>`],
    ]
  });

  var themeOptions = GM.getAll("#theme-select option");
  for (let i = 0; i < themeOptions.length; i++) {
    if (themeOptions[i].innerText !== document.body.classList) return;
    themeOptions[i].toggleAttribute("selected");
  }
}

function attachEventListeners() {
  // settings
  GM.get("#settings-button").onclick = () => {
    GM.get("#settings").style.display = "block";
  }

  GM.get("#settings-close-button").onclick = () => {
    GM.get("#settings").style.display = "none";
  }

  GM.get('#theme-select').onchange = () => {
    document.body.classList = GM.get('#theme-select').value;
  }

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

  // new-project-prompt
  var dirHandle, buffer;
  var project = {};
  GM.get("#new-project-button").onclick = () => {
    GM.get("#new-project-prompt").style.display = "block";
  }

  // credit: https://developer.mozilla.org/en-US/docs/Web/API/File_System_Access_API
  GM.get("#new-project-location-button").onclick = async () => {
    try {
      dirHandle = await window.showDirectoryPicker();
      GM.get('#location-path').innerText = "./" + dirHandle.name;
    } catch (err) {
      console.trace(err);
    }
  }

  GM.get(`#new-project-confirm`).onclick = async () => {
    if (GM.get(`#project-name`).value === undefined || dirHandle === undefined) return;

    project.title = GM.get(`#project-name`).value;
    project.root = await dirHandle.getDirectoryHandle(project.title, { create: true });
    project.src = await project.root.getDirectoryHandle("src", { create: true });
    let srcFile = await project.root.getFileHandle("index.html", { create: true });
    let stream = await srcFile.createWritable();
    
    // index.html
    buffer = files.index;
    buffer = buffer.replace("$PROJECT_TITLE", project.title);
    await stream.write(buffer);
    await stream.close();

    // ./src/ECS.js
    srcFile = await project.src.getFileHandle("ECS.js", {create:true});
    stream = await srcFile.createWritable();
    buffer = files.ECS;
    await stream.write(buffer);
    await stream.close();

    GM.get(`#new-project-prompt`).style.display = "none";
    switchMenu(menus.editor);
  }

  GM.get(`#new-project-cancel`).onclick = () => {
    GM.get(`#new-project-prompt`).style.display = "none";
  }

  // entities
  GM.get("#new-assemblage-button").onclick = () => {
    console.log("new assemblage");
  }

  // components
  GM.get("#new-component-button").onclick = () => {
    console.log("new component");
  }

  // system
  GM.get("#new-system-button").onclick = () => {
    console.log('new system');
  }
}

function hideAllMenus() {
  for (let menu in menus) {
    GM.get(menus[menu]).style.display = "none";
  }
}

function guiUpdate() {
}