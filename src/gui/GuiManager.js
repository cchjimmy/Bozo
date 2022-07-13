// import { dragElement } from "./eventHandler.js";

// export var guis = [];

export default class GuiManager {

  constructor() {
    this.setTheme("dark");
    // this.init();
  }

  setTheme(theme = "") {
    if (theme == "dark") {
      document.body.classList.add("dark");
    } else if (document.body.classList.contains("dark")) {
      document.body.classList.remove("dark");
    }
  }

  setBackground(id = "", color = 0) {
    let gui = this.get(id);
    if (gui) {
      gui.style.backgroundColor = color;
    }
  }

  resize(id = "", width = 100, height = 100) {
    let gui = this.get(id);
    if (gui) {
      gui.style.width = `${width}px`;
      gui.style.height = `${height}px`;
    }
  }

  create(id = "") {
    let gui = this.get(id);
    if (gui) {
      this.remove(id);
    }
    // let titleBarHeight = 25;

    // let empty = document.createElement("div");
    // empty.style.width = `${width}px`;
    // empty.style.height = `${height + titleBarHeight}px`
    // empty.id = id;
    // empty.classList.add("empty");

    let empty = this.addDiv({ divId: id, divClass: "empty" });
    this.addDiv({ parentId: id, divId: id + "header", divClass: "header", content: id });
    this.addDiv({ parentId: id, divId: id + "container", divClass: "container" })

    return empty;
    // dragElement(empty);
  }

  remove(id = "") {
    let div = this.get(id);
    if (div) {
      if (guis.includes(div)) { guis.slice(guis.indexOf(div), 1) };
      div.remove();
    }
  }

  // reposition(id = "", left = this.get(id).style.left, top = this.get(id).style.top) {
  //   let gui = this.get(id);
  //   if (gui) {
  //     gui.style.top = `${top}px`;
  //     gui.style.left = `${left}px`;
  //   }
  // }

  draw(id = "") {
    let div = this.get(id);
    if (div) {
      div.style.display = "inline-block";
      // gui.style.flexWrap = "wrap";
    }
  }

  hide(id = "") {
    let div = this.get(id);
    if (div) {
      div.style.display = "none";
    }
  }

  updateDiv({divId="", content=""}) {
    let div = this.get(divId);
    if (div) {
      div.innerHTML = content;
    }
  }

  addDiv({ parentId = "", divId = "", divClass = "", content }) {
    let div = document.createElement("div");
    if (divId) { div.id = divId; }
    if (divClass) { div.classList.add(divClass); }
    if (content) { div.innerHTML = content }
    if (parentId) {
      let parent = this.get(parentId);
      parent.appendChild(div);
    } else {
      document.body.appendChild(div);
    }
    return div;
  }

  removeTitle(id = "") {
    let header = this.get(id + "header");
    if (header) {
      header.innerText = "";
    }
  }

  removeHeader(id = "") {
    let gui = this.get(id);
    let header = this.get(id + "header");
    if (gui && header) {

      // let buttonContainer = this.get(id + "buttonContainer");
      header.remove();
      // gui.removeChild(buttonContainer);
      // dragElement(gui);

      // gui.style.height = `${parseInt(gui.style.height) - parseInt(header.style.height)}px`;
    }
  }

  get(id = "") {
    return document.querySelector("#" + id);
  }

  // createDockBoxes() {
  //   let wrapper = document.createElement("div");
  //   document.body.appendChild(wrapper);
  //   wrapper.classList.add("dock-box-container");
  //   wrapper.style.opacity = 0;

  //   let box = document.createElement("div");
  //   box.classList.add("dock-box");
  //   box.style.width = "50%";
  //   wrapper.appendChild(box);

  //   let resizer = document.createElement("div");
  //   resizer.classList.add("resizer");
  //   resizer.id = "dragMe";
  //   wrapper.appendChild(resizer);

  //   box = document.createElement("div");
  //   box.classList.add("dock-box");
  //   box.style.flex = "1";
  //   wrapper.appendChild(box);

  //   docking(wrapper);
  // }

  /**
   * 
   * @param {string} id 
   * @param {string} name 
   * @param {function} callback 
   */
  addOption(id = "", name = "", callback) {
    let wrapper = document.createElement("div");
    wrapper.style.display = "flex";
    wrapper.style.alignItems = "center";
    wrapper.style.padding = "2px"
    wrapper.style.boxSizing = "border-box";

    let button = document.createElement("button");
    button.addEventListener("click", callback);
    button.style.height = "20px";
    button.style.width = "20px";

    let title = document.createElement("div");
    title.style.paddingRight = "20px";
    title.innerText = name;

    wrapper.appendChild(title);
    wrapper.appendChild(button);

    this.display(id, wrapper);
  }

  // init() {
  //   // this.createDockBoxes();

  //   this.setTheme("dark");
  //   this.create("test");
  //   this.draw("test");

  //   credit for the text https://www.lipsum.com
  //   this.display("test", `What is Lorem Ipsum?
  //   Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.

  //   Why do we use it?
  //   It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum is that it has a more-or-less normal distribution of letters, as opposed to using 'Content here, content here', making it look like readable English. Many desktop publishing packages and web page editors now use Lorem Ipsum as their default model text, and a search for 'lorem ipsum' will uncover many web sites still in their infancy. Various versions have evolved over the years, sometimes by accident, sometimes on purpose (injected humour and the like).


  //   Where does it come from?
  //   Contrary to popular belief, Lorem Ipsum is not simply random text. It has roots in a piece of classical Latin literature from 45 BC, making it over 2000 years old. Richard McClintock, a Latin professor at Hampden-Sydney College in Virginia, looked up one of the more obscure Latin words, consectetur, from a Lorem Ipsum passage, and going through the cites of the word in classical literature, discovered the undoubtable source. Lorem Ipsum comes from sections 1.10.32 and 1.10.33 of "de Finibus Bonorum et Malorum" (The Extremes of Good and Evil) by Cicero, written in 45 BC. This book is a treatise on the theory of ethics, very popular during the Renaissance. The first line of Lorem Ipsum, "Lorem ipsum dolor sit amet..", comes from a line in section 1.10.32.

  //   The standard chunk of Lorem Ipsum used since the 1500s is reproduced below for those interested. Sections 1.10.32 and 1.10.33 from "de Finibus Bonorum et Malorum" by Cicero are also reproduced in their exact original form, accompanied by English versions from the 1914 translation by H. Rackham.

  //   Where can I get some?
  //   There are many variations of passages of Lorem Ipsum available, but the majority have suffered alteration in some form, by injected humour, or randomised words which don't look even slightly believable. If you are going to use a passage of Lorem Ipsum, you need to be sure there isn't anything embarrassing hidden in the middle of text. All the Lorem Ipsum generators on the Internet tend to repeat predefined chunks as necessary, making this the first true generator on the Internet. It uses a dictionary of over 200 Latin words, combined with a handful of model sentence structures, to generate Lorem Ipsum which looks reasonable. The generated Lorem Ipsum is therefore always free from repetition, injected humour, or non-characteristic words etc.`);
  //   this.create("main");
  //   this.draw("main");
  //   this.reposition("main", 100);
  //   this.display("main", this.get("test"));
  //   this.display("main", "Demo Settings\n\n");
  //   for(let i = 0; i < 10; i ++) {
  //     this.addOption("main", "test", () => {
  //       console.log("test");
  //     });
  //   }
  // }
}