export default class GuiMaker {
  remove(selector = "") {
    let element = this.get(selector);
    if (!element) return;
    element.remove();
  }

  update(selector = "", innerHTML) {
    let element = this.get(selector);
    if (!element) return;
    element.innerHTML = innerHTML;
  }

  // credit https://codesource.io/how-to-convert-a-string-to-html-in-javascript/
  add(parentSelector = "", innerHTML) {
    let parent = this.get(parentSelector);
    if (!parent) return;
    parent.insertAdjacentHTML("beforeend", innerHTML);
    return parent.lastChild;
  }

  get(selector = "") {
    return document.querySelector(selector);
  }

  getAll(selector = "") {
    return document.querySelectorAll(selector);
  }

  drawTable({ parentSelector = "", td = [], trAttributes = [], tableAttributes = "", colgroupAttributes = [], caption = "" }) {
    let Column, Row, Colgroup;
    Column = Row = Colgroup = "";
    for (let i = 0; i < td.length; i++) {
      for (let j = 0; j < td[i].length; j++) {
        Row += `<td>${td[i][j]}</td>`;
      }
      Column += `<tr ${trAttributes[i]}>${Row}</tr>`;
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