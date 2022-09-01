export default class GuiMaker {
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
    if (element) {
      element.innerHTML = innerHTML;
    }
  }

  // credit https://codesource.io/how-to-convert-a-string-to-html-in-javascript/
  add(parentSelector = "", param) {
    let parent = this.get(parentSelector);
    if (parent) {
      parent.insertAdjacentHTML("beforeend", param);
      return parent.lastChild;
    }
  }

  get(selector = "") {
    let element = document.querySelector(selector);
    if (!element) {
      return;
    }
    return element;
  }

  drawTable(parentSelector, data = []) {
    let Column, Row;
    Column = Row = ""
    for (let i = 0; i < data.length; i++) {
      for (let j = 0; j < data[i].length; j++) {
        Row += `<td>${data[i][j]}</td>`;
      }
      Column += `<tr>${Row}</tr>`;
      Row = "";
    }
    return this.add(parentSelector, `
    <table>
      ${Column}
    </table>`);
  }
}