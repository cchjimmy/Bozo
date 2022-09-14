import GM from "./utilities/gui/GuiMaker.js";

const GuiMaker = new GM;
const menus = {
  main: "#main",
  editor: "#editor",
}

export default (() => {
  // credit: https://medium.com/hypersphere-codes/detecting-system-theme-in-javascript-css-react-f6b961916d48
  const darkThemeMq = window.matchMedia("(prefers-color-scheme: dark)");
  darkThemeMq.matches ? document.body.classList = "dark" : document.body.classList = "light";

  defineMenus();
  attachEventListeners();
  
  switchMenu(menus.main);

  setInterval(() => {
    guiUpdate();
  }, 300);
})();

function switchMenu(menu) {
  hideAllMenus();
  GuiMaker.get(menu).style.display = "block";
}

function defineMenus() {
  const mask = `<div style="background:rgb(0, 0, 0, 0.5); width:100%; height:100%; position:absolute; top:0px;"></div>`;

  // menu id="main"
  GuiMaker.add("body", `<div id="main" class="centered" style="display:none;"></div>`);
  GuiMaker.drawTable({
    parentSelector: "#main",
    td: [[`<div style="font-size: 50px; background:#ff8c00;" class="header">Bozo</div>`],
    [`<button id="new-project-button" class="button" style="font-size:20px;">New project</button>`],
    [`<button id="settings-button" class="button" style="font-size:20px;">Settings</button>`],
    ]
  });

  // menu id="new-project-prompt"
  GuiMaker.add("body", `<div id="new-project-prompt" style="display:none;"></div>`);
  GuiMaker.add("#new-project-prompt", mask).onclick = () => {
    GuiMaker.get('#new-project-prompt').style.display = "none";
  };
  GuiMaker.add("#new-project-prompt", `<div id="new-project-prompt-ui" class="centered" style="background:var(--header-background); overflow:auto;"></div>`);
  GuiMaker.add("#new-project-prompt-ui", `<div style="color:var(--primary-text-color); font-size:20px; margin:10px;">New project</div>`);
  GuiMaker.add("#new-project-prompt-ui", `<div id="new-project-prompt-list" class="table-container" style="margin:10px; padding:10px; border-radius:10px;"></div>`)
  GuiMaker.drawTable({
    parentSelector: "#new-project-prompt-list",
    td: [
      [`Project name:`, `<input id="project-name" placeholder="Project name" style="width:100%;"></input>`],
      [`Location:`, `<button id="new-project-location-button" class="button">choose location</button>`],
      [`<div id="location-path"></div>`],
      [`<button id="new-project-confirm" class="button">confirm</button>`, `<div style="float:right;"><button class="button" id="new-project-cancel">cancel</button></div>`]]
  });

  // menu id="editor"
  GuiMaker.add("body", `<div id="editor" style="display:none; width:100%; height:100%;"></div>`);

  // credit for clipboard icon https://www.w3schools.com/icons/tryit.asp?filename=tryicons_fa-clipboard
  // credit for grid style https://dev.to/dawnind/3-ways-to-display-two-divs-side-by-side-3d8b
  // credit for input https://www.w3schools.com/tags/att_input_value.asp
  GuiMaker.drawTable({
    parentSelector: "#editor", td: [[`<div style="text-align:center;">
  <i id="editor-settings-tab" class="tab has-menu fa fa-bars" style="width:40px;"></i>
  <svg class="tab has-menu" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512"><!--! Font Awesome Pro 6.2.0 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license (Commercial License) Copyright 2022 Fonticons, Inc. --><path d="M0 96C0 78.3 14.3 64 32 64H416c17.7 0 32 14.3 32 32s-14.3 32-32 32H32C14.3 128 0 113.7 0 96zM0 256c0-17.7 14.3-32 32-32H416c17.7 0 32 14.3 32 32s-14.3 32-32 32H32c-17.7 0-32-14.3-32-32zM448 416c0 17.7-14.3 32-32 32H32c-17.7 0-32-14.3-32-32s14.3-32 32-32H416c17.7 0 32 14.3 32 32z"/></svg>
  <i id="play" class="tab fa fa-play" style="width:40px;"></i>
</div>`, `
<div class="scrollmenu">
  <div class="tab has-menu" id="current-scene-info-tab">current-scene-info</div>
  <div class="tab has-menu" id="entities-tab">entities</div>
  <div class="tab has-menu" id="components-tab">components</div>
  <div class="tab has-menu" id="systems-tab">systems</div>
</div>`]], colgroupAttributes: [`style="width:120px;"`], tableAttributes: `id="editor-scroll-menu"style="position:fixed; bottom:0px; background:var(--header-background); height:53px;"`
  });

  const tabs = GuiMaker.getAll(".tab.has-menu");
  var lastMenuHTML;
  var currentMenuHTML;
  let editorScrollMenuHeight = GuiMaker.get(`#editor-scroll-menu`).style.height;
  for (let i = 0; i < tabs.length; i++) {
    GuiMaker.add("body", `<div class="table-container" id="${tabs[i].id.slice(0, -4)}" style="display: none; width:100%; position:fixed; bottom:${editorScrollMenuHeight}; height:185px;"></div>`);

    tabs[i].addEventListener("click", () => {
      currentMenuHTML = GuiMaker.get("#" + tabs[i].id.slice(0, -4));
      if (lastMenuHTML && lastMenuHTML != currentMenuHTML) {
        lastMenuHTML.style.display = "none";
        GuiMaker.get("#" + lastMenuHTML.id + "-tab").classList.remove("active");
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
  GuiMaker.drawTable({
    parentSelector: "#current-scene-info",
    td: [[`name: `, `<span id="scene-name"></span>`],
    [`entity count: `, `<span id="entity-count"></span>`]]
  });

  // submenu id="entities"
  GuiMaker.add("#entities", `<div id="draw-components"></div>`);
  GuiMaker.add("#entities", `<div style="position:sticky;bottom:0px;" id="entities-buttons"></div>`);
  GuiMaker.drawTable({
    parentSelector: "#entities-buttons",
    td: [[`<button class="button" id="create-entity" style="text-align:center; width:100%;">Add component</button>`, `<button class="button" id="add-component" style="text-align:center; width:100%;">Add entity</button>`]]
  });

  // submenu id="components"
  GuiMaker.add("#components", `<div id="world-components"></div>`);
  GuiMaker.add("#components", `<div style="position:sticky; bottom:0px;" id="components-buttons"></div>`);
  GuiMaker.drawTable({
    parentSelector: "#components-buttons",
    td: [[`<button class="button" style="text-align:center; width:100%;">New component</button>`]]
  });

  // submenu id="systems"
  GuiMaker.add("#systems", `<div id="world-systems"></div>`);
  GuiMaker.add("#systems", `<div style="position:sticky; bottom:0px;" id="systems-buttons"></div>`);
  GuiMaker.drawTable({
    parentSelector: "#systems-buttons",
    td: [[`<button class="button" style="text-align:center; width:100%;">New system</button>`]]
  });

  // submenu id="editor-settings"

  // submenu id="settings"
  var settingsHeaderHeight;
  GuiMaker.add("body", `<div id="settings" style="display:none; width:100%; height:100%;"></div>`);
  GuiMaker.add("#settings", mask).onclick = () => {
    GuiMaker.get("#settings").style.display = 'none';
  };
  GuiMaker.add("#settings", `<div id="settings-ui" style="height:100%; width:300px; position:absolute; overflow:hidden; background:var(--header-background);"></div>`);
  GuiMaker.add("#settings-ui", `<div id="settings-header" style="margin:10px; height:30px;"></div>`)
  GuiMaker.drawTable({
    parentSelector: "#settings-header",
    td: [
      [`<div style="color:var(--primary-text-color); font-size:25px;">Settings</div>`, `<button id="settings-close-button" class="button" style="float:right;">close</button>`],
    ]
  });
  settingsHeaderHeight = GuiMaker.get("#settings-header").style.height;
  GuiMaker.add("#settings-ui", `<div id="settings-list" style="overflow:auto; padding:10px; margin:10px; border-radius:10px; height:calc(100% - ${settingsHeaderHeight} - 30px);" class="table-container"><div>`)
  GuiMaker.drawTable({
    parentSelector: "#settings-list",
    td: [
      [`<button id="a2hs-button" class="button" style="white-space:nowrap; width:200%;">Add To Home Screen</button>`],
      ['theme', `<select id="theme-select"><option>dark</option><option>light</option></select>`],
    ]
  });

  let themeOptions = GuiMaker.getAll("#theme-select option");
  for (let i = 0; i < themeOptions.length; i++) {
    if (themeOptions[i].innerText == document.body.classList) {
      themeOptions[i].toggleAttribute("selected");
    }
  }
}

function attachEventListeners() {
  GuiMaker.get("#settings-button").onclick = () => {
    GuiMaker.get("#settings").style.display = "block";
  }

  GuiMaker.get("#settings-close-button").onclick = () => {
    GuiMaker.get("#settings").style.display = "none";
  }

  GuiMaker.get('#theme-select').onchange = () => {
    document.body.classList = GuiMaker.get('#theme-select').value;
  }

  var dirHandle, path, projectName;
  GuiMaker.get("#new-project-button").onclick = () => {
    GuiMaker.get("#new-project-prompt").style.display = "block";
  }

  // credit: https://thewebdev.info/2021/04/25/how-to-create-a-file-object-in-javascript/#:~:text=We%20can%20create%20a%20file,File(parts%2C%20'sample.
  GuiMaker.get("#new-project-location-button").onclick = async () => {
    try {
      dirHandle = await window.showDirectoryPicker();
      path = "./" + dirHandle.name;
      GuiMaker.get("#location-path").innerText = path;
    } catch (err) { }
  }

  GuiMaker.get(`#new-project-confirm`).onclick = async () => {
    projectName = GuiMaker.get(`#project-name`).value;
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
      GuiMaker.get(`#new-project-prompt`).style.display = "none";
      switchMenu(menus.editor);
    } catch (err) {

    }
  }

  GuiMaker.get(`#new-project-cancel`).onclick = () => {
    GuiMaker.get(`#new-project-prompt`).style.display = "none";
  }

  GuiMaker.get("#create-entity").onclick = () => {

  }

  GuiMaker.get("#add-component").onclick = () => {

  }

  let deferredPrompt;
  const a2hs = GuiMaker.get("#a2hs-button");
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
}

function hideAllMenus() {
  for (let menu in menus) {
    GuiMaker.get(menus[menu]).style.display = "none";
  }
}

function guiUpdate() {
  // GuiMaker.update("#scene-id", sceneManager.getCurrentSceneId());
  // GuiMaker.update("#scene-name", sceneManager.currentScene.name);
  // GuiMaker.update("#entity-count", sceneManager.currentEntityPool.count);
}
