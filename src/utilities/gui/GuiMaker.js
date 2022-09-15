class GuiMaker {
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
    return document.querySelector(selector);
  }

  getAll(selector = "") {
    return document.querySelectorAll(selector);
  }

  drawTable({ parentSelector = "", tableAttributes = "", td = [], colgroupAttributes = [], caption = "" }) {
    let Column, Row, Colgroup;
    Column = Row = Colgroup = "";
    for (let i = 0; i < td.length; i++) {
      for (let j = 0; j < td[i].length; j++) {
        Row += `<td>${td[i][j]}</td>`;
      }
      Column += `<tr>${Row}</tr>`;
      Row = "";
    }
    for (let i = 0; i < colgroupAttributes.length; i++) {
      Colgroup += `<col ${colgroupAttributes[i]}>`;
    }
    return this.add(parentSelector, `
    <table ${tableAttributes}>
      <caption>
        ${caption}
      </caption>
      <colgroup>
        ${Colgroup}
      </colgroup>
      ${Column}
    </table>`);
  }
}
window.GuiMaker = new GuiMaker;