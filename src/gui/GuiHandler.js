import { docking, dragElement, elementFullscreen } from "./eventHandler.js";

export var guis = [];

export default class GuiHandler {

  constructor() {
    this.init();
  }

  setTheme(theme = "") {
    if (theme == "dark") {
      document.body.classList.add("dark");
    } else if (document.body.classList.contains("dark")) {
      document.body.classList.remove("dark");
    } else {
      return;
    }
  }

  setBackground(id = "", color = 0) {
    let gui = this.get(id);
    if (gui) {
      gui.style.backgroundColor = color;
    }
    return;
  }

  display(id = "", content = []) {
    let mainContainer = this.get(id + "container");

    if (mainContainer) {
      if (content == []) return;

      let contentContainer = document.createElement("div");

      switch (typeof content) {
        case typeof "":
          console.log(typeof "");
          contentContainer.innerText = content;
          mainContainer.appendChild(contentContainer);
          break;

        case typeof mainContainer:
          console.log(typeof mainContainer, "mc");
          if (content.classList.contains("empty")) {
            console.warn("Cannot display a container within another container.");
          } else {
            contentContainer.appendChild(content);
            mainContainer.appendChild(contentContainer);
          }
          break;

        default:
          contentContainer.appendChild(content);
          mainContainer.appendChild(contentContainer);
          break;
      }
    }
    return;
  }

  resize(id = "", width = 100, height = 100) {
    let gui = this.get(id);
    if (gui) {
      gui.style.width = `${width}px`;
      gui.style.height = `${height}px`;
    }
    return;
  }

  create(id = "", width = 100, height = 100) {
    let gui = this.get(id);
    if (gui) {
      this.remove(id);
    }

    let titleBarHeight = 25

    let empty = document.createElement("div");
    empty.style.width = `${width}px`;
    empty.style.height = `${height + titleBarHeight}px`
    empty.id = id;
    empty.classList.add("empty", "draggable");
    empty.setAttribute("draggable", true);

    let container = document.createElement("div");
    container.id = id + "container";
    container.classList.add("container");

    let header = document.createElement("div");
    header.classList.add("header");
    header.id = id + "header";

    let buttonContainer = document.createElement("div");
    buttonContainer.classList.add("buttonContainer");
    buttonContainer.id = id + "buttonContainer";

    let close = document.createElement("button");
    close.classList.add("button");
    close.innerHTML = "&times;";
    close.id = id + "close";

    let fullscreen = document.createElement("button");
    fullscreen.classList.add("button");
    fullscreen.innerHTML = "&square;";
    fullscreen.id = id + "fullscreen";

    buttonContainer.appendChild(close);
    buttonContainer.appendChild(fullscreen);

    // &boxminus; html code for minimize
    empty.appendChild(buttonContainer);
    empty.appendChild(header);
    empty.appendChild(container);

    document.body.appendChild(empty);

    dragElement(empty);
    elementFullscreen(empty);

    this.title(id, id);
    guis.push(empty);

    this.reposition(id, 0, 0);
    return;
  }

  remove(id = "") {
    let gui = this.get(id);
    if (gui) {
      guis.splice(guis.indexOf(gui), 1);
      document.body.removeChild(gui);
    }
    return;
  }

  reposition(id = "", x = this.get(id).style.left, y = this.get(id).style.top) {
    let gui = this.get(id);
    if (gui) {
      gui.style.top = `${y}px`;
      gui.style.left = `${x}px`;
    }
    return;
  }

  draw(id = "", x = this.get(id).style.left, y = this.get(id).style.top) {
    let gui = this.get(id);
    if (gui) {
      gui.style.display = "block";
      this.reposition(id, x, y);
    }
    return;
  }

  hide(id = "") {
    let gui = this.get(id);
    if (gui) {
      gui.style.display = "none";
    }
    return;
  }

  title(id = "", title = "") {
    let header = this.get(id + "header");
    if (header) {
      header.innerText = title;
    }
    return;
  }

  removeTitle(id = "") {
    let header = this.get(id + "header");
    if (header) {
      header.innerText = "";
    }
    return;
  }

  removeHeader(id = "") {
    let gui = this.get(id);
    if (gui) {
      let header = this.get(id + "header");
      let buttonContainer = this.get(id + "buttonContainer");
      gui.removeChild(header);
      gui.removeChild(buttonContainer);
      dragElement(gui);

      gui.style.height = `${parseInt(gui.style.height) - parseInt(header.style.height)}px`;
    }
    return;
  }

  get(id = "") {
    return document.querySelector("#" + id);
  }

  createDockBoxes() {
    let wrapper = document.createElement("div");
    document.body.appendChild(wrapper);
    wrapper.classList.add("dock-box-container");
    wrapper.style.opacity = 0;

    let box = document.createElement("div");
    box.classList.add("dock-box");
    box.style.width = "50%";
    wrapper.appendChild(box);

    let resizer = document.createElement("div");
    resizer.classList.add("resizer");
    resizer.id = "dragMe";
    wrapper.appendChild(resizer);

    box = document.createElement("div");
    box.classList.add("dock-box");
    box.style.flex = "1";
    wrapper.appendChild(box);

    docking(wrapper);
    return;
  }

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

  init() {
    console.log(g("hi").html());
    this.createDockBoxes();

    this.setTheme("dark");
    this.create("test");
    this.draw("test");
    this.display("test", `What is Lorem Ipsum?
    Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.
    
    Why do we use it?
    It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum is that it has a more-or-less normal distribution of letters, as opposed to using 'Content here, content here', making it look like readable English. Many desktop publishing packages and web page editors now use Lorem Ipsum as their default model text, and a search for 'lorem ipsum' will uncover many web sites still in their infancy. Various versions have evolved over the years, sometimes by accident, sometimes on purpose (injected humour and the like).
    
    
    Where does it come from?
    Contrary to popular belief, Lorem Ipsum is not simply random text. It has roots in a piece of classical Latin literature from 45 BC, making it over 2000 years old. Richard McClintock, a Latin professor at Hampden-Sydney College in Virginia, looked up one of the more obscure Latin words, consectetur, from a Lorem Ipsum passage, and going through the cites of the word in classical literature, discovered the undoubtable source. Lorem Ipsum comes from sections 1.10.32 and 1.10.33 of "de Finibus Bonorum et Malorum" (The Extremes of Good and Evil) by Cicero, written in 45 BC. This book is a treatise on the theory of ethics, very popular during the Renaissance. The first line of Lorem Ipsum, "Lorem ipsum dolor sit amet..", comes from a line in section 1.10.32.
    
    The standard chunk of Lorem Ipsum used since the 1500s is reproduced below for those interested. Sections 1.10.32 and 1.10.33 from "de Finibus Bonorum et Malorum" by Cicero are also reproduced in their exact original form, accompanied by English versions from the 1914 translation by H. Rackham.
    
    Where can I get some?
    There are many variations of passages of Lorem Ipsum available, but the majority have suffered alteration in some form, by injected humour, or randomised words which don't look even slightly believable. If you are going to use a passage of Lorem Ipsum, you need to be sure there isn't anything embarrassing hidden in the middle of text. All the Lorem Ipsum generators on the Internet tend to repeat predefined chunks as necessary, making this the first true generator on the Internet. It uses a dictionary of over 200 Latin words, combined with a handful of model sentence structures, to generate Lorem Ipsum which looks reasonable. The generated Lorem Ipsum is therefore always free from repetition, injected humour, or non-characteristic words etc.`);
    this.create("main");
    this.draw("main");
    this.reposition("main", 100);
    this.display("main", this.get("test"));
    this.display("main", "Demo Settings\n\n");
    for(let i = 0; i < 10; i ++) {
      this.addOption("main", "test", () => {
        console.log("test");
      });
    }
    
    return;
  }
}

export function g(className = "") {
  const element = document.createElement("div");
  element.classList.add(className);
  const self = {
    element: element,
    html: ()=>self.element,
  }
  return self;
}