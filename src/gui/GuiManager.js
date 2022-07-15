// import { dragElement } from "./eventHandler.js";

// export var guis = [];

export default class GuiManager {
  constructor() {
  }

  setTheme(theme = "") {
    if (theme == "dark") {
      document.body.classList.add("dark");
    } else if (document.body.classList.contains("dark")) {
      document.body.classList.remove("dark");
    }
  }

  remove(selector = "") {
    let element = this.get(selector);
    if (element) {
      element.remove();
    }
  }

  update(selector = "", innerHTML) {
    let element = this.get(selector);
    if (element)
      element.innerHTML = innerHTML;
  }

  // credit https://codesource.io/how-to-convert-a-string-to-html-in-javascript/
  add(parentSelector = "", param) {
    let parent = this.get(parentSelector);
    if (parent) { parent.insertAdjacentHTML("beforeend", param); }
  }

  get(selector = "") {
    return document.querySelector(selector);
  }
}