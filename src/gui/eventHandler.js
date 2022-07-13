import { guis } from "./GuiManager.js";

// https://htmldom.dev/make-a-draggable-element/
export function dragElement(elmnt) {
  var pos1 = 0;
  var pos2 = 0;
  var pos3 = 0;
  var pos4 = 0;

  var parentWidth = 0;
  var parentHeight = 0;
  var parentTop = 0;
  var parentLeft = 0;

  var isParentBody = false;
  var parent = null;

  // headerOffset
  var titleBarHeight = 0;

  elmnt.onmousedown = () => {
    moveToFront(elmnt);
  }

  if (document.getElementById(elmnt.id + "header")) {
    titleBarHeight = parseInt(document.getElementById(elmnt.id + "header").style.height);
    // if present, the header is where you move the DIV from:
    document.getElementById(elmnt.id + "header").onmousedown = dragMouseDown;

  } else {
    // otherwise, move the DIV from anywhere inside the DIV:
    elmnt.onmousedown = dragMouseDown;
  }

  function dragMouseDown(e) {
    // moveToFront(elmnt);
    parent = getParent(elmnt);
    isParentBody = parent == document.body;
    if (isParentBody) {
      parentWidth = window.innerWidth;
      parentHeight = window.innerHeight;
      parentTop = 0;
      parentLeft = 0;
    } else {
      parentWidth = parseInt(parent.style.width);
      parentHeight = parseInt(parent.style.height);
      parentTop = parseInt(parent.style.top);
      parentLeft = parseInt(parent.style.left);
    }

    e = e || window.event;
    e.preventDefault();
    // get the mouse cursor position at startup:
    pos3 = e.clientX;
    pos4 = e.clientY;
    document.onmouseup = closeDragElement;
    // call a function whenever the cursor moves:
    document.onmousemove = elementDrag;

    // prevent resizing too big
    if (parseInt(elmnt.style.width) > parentWidth) {
      elmnt.style.width = `${parentWidth}px`;
    }

    if (parseInt(elmnt.style.height) > parentHeight) {
      elmnt.style.height = `${parentHeight}px`;
    }

    // if docked undock.
    if (getParent(elmnt).classList.contains("dock-box")) {
      document.body.appendChild(elmnt);
    }
    // drawDockBoxes();
  }

  function elementDrag(e) {
    e = e || window.event;
    e.preventDefault();
    // calculate the new cursor position:
    pos1 = pos3 - e.clientX;
    pos2 = pos4 - e.clientY;
    pos3 = e.clientX;
    pos4 = e.clientY;
    // set the element's new position:
    elmnt.style.top = Math.floor(elmnt.offsetTop - pos2) + "px";
    elmnt.style.left = Math.floor(elmnt.offsetLeft - pos1) + "px";

    checkEdges(elmnt);
  }

  function closeDragElement() {
    // stop moving when mouse button is released:
    document.onmouseup = null;
    document.onmousemove = null;

    // update max size
    elmnt.style.maxWidth = `${calculateMaxWidth(elmnt)}px`;
    elmnt.style.maxHeight = `${calculateMaxHeight(elmnt)}px`;
    if (!isParentBody) {
      elmnt.style.maxHeight -= titleBarHeight;
    }

    // hideDockBoxes();
  }

  function checkEdges(elmnt) {
    // edges
    if (isParentBody) {
      // top
      if (parseInt(elmnt.style.top) < 0 || pos4 < parentTop) {
        elmnt.style.top = `0px`;
      }
    } else {
      // fullscreen detection
      if (document.getElementById(parent.id+"header") && !document.getElementById(parent.id + "header").onmousedown) {
        parentHeight = window.innerHeight;
        parentWidth = innerWidth;
      }
      // top
      if (parseInt(elmnt.style.top) < titleBarHeight || pos4 < parentTop + titleBarHeight) {
        elmnt.style.top = `${titleBarHeight}px`;
      }
    }
    // bottom
    if (parseInt(elmnt.style.top) > parentHeight - parseInt(elmnt.style.height) || (pos4 > parentHeight + parentTop)) {
      elmnt.style.top = `${parentHeight - parseInt(elmnt.style.height)}px`;
    }

    // left
    if (parseInt(elmnt.style.left) < 0 || pos3 < parentLeft) {
      elmnt.style.left = `0px`;
    }

    // right
    if (parseInt(elmnt.style.left) > parentWidth - parseInt(elmnt.style.width) || pos3 > parentLeft + parentWidth) {
      elmnt.style.left = `${parentWidth - parseInt(elmnt.style.width)}px`;
    }
  }

  function calculateMaxWidth(elmnt) {
    let maxWidth = Math.floor(parentWidth - parseInt(elmnt.style.left));
    if (maxWidth > parentWidth) {
      maxWidth = parentWidth;
    }
    return maxWidth;
  }

  function calculateMaxHeight(elmnt) {
    let maxHeight = Math.floor(parentHeight - parseInt(elmnt.style.top));
    if (maxHeight > parentHeight) {
      maxHeight = parentHeight;
    }
    return maxHeight;
  }
}

export function elementFullscreen(elmnt) {
  let lastX, lastY, lastW, lastH = 0;
  let fS = document.getElementById(elmnt.id + "fullscreen");
  let header = document.getElementById(elmnt.id + "header");
  let headerEvent = header.onmousedown;
  if (!fS) {
    return;
  }
  let parent = document.getElementById(elmnt.id);

  fS.onmouseup = toggleFS;

  let FSSymbol = fS.innerHTML;

  function toggleFS() {
    if (parent.style.height != "100%" && parent.style.width != "100%") {
      parent.style.maxWidth = "100%";
      parent.style.maxHeight = "100%";

      lastX = parent.style.top;
      lastY = parent.style.left;
      lastW = parent.style.width;
      lastH = parent.style.height;

      parent.style.top = "0px";
      parent.style.left = "0px";
      parent.style.width = "100%";
      parent.style.height = "100%";

      fS.innerHTML = "&boxminus;";

      header.onmousedown = null;
    } else {
      parent.style.top = lastX;
      parent.style.left = lastY;
      parent.style.width = lastW;
      parent.style.height = lastH;

      fS.innerHTML = FSSymbol;

      header.onmousedown = headerEvent;
    }
  }
}

function moveToFront(elmnt) {
  guis.splice(guis.indexOf(elmnt), 1);
  guis.push(elmnt);
  guis.forEach(gui => {
    gui.style.zIndex = guis.indexOf(gui) + 1;
  });
}

function getParent(elmnt) {
  return elmnt.parentElement;
}

function drawDockBoxes() {
  let dockBoxes = document.querySelectorAll(".dock-box");
  if (dockBoxes) {
    for (let box of dockBoxes) {
      box.style.display = "block";
      box.addEventListener("mouseover", () => {
        console.log("hover");
      })
    }
  }
}

function hideDockBoxes() {
  let dockBoxes = document.querySelectorAll(".dock-box");
  if (dockBoxes) {
    for (let box of dockBoxes) {
      box.style.display = "none";
    }
  }
}

// https://htmldom.dev/create-resizable-split-views/
export function docking(elmnt) {
  // Query the element
  const resizer = elmnt.querySelector(".resizer");
  const leftSide = resizer.previousElementSibling;
  const rightSide = resizer.nextElementSibling;

  // // The current position of mouse
  let x = 0;
  let y = 0;

  // Width of left side
  let leftWidth = 0;

  // Handle the mousedown event
  // that's triggered when user drags the resizer
  const mouseDownHandler = function (e) {
    // Get the current mouse position
    x = e.clientX;
    y = e.clientY;
    leftWidth = leftSide.getBoundingClientRect().width;

    // Attach the listeners to `document`
    document.addEventListener('mousemove', mouseMoveHandler);
    document.addEventListener('mouseup', mouseUpHandler);
  };

  // Attach the handler
  resizer.addEventListener('mousedown', mouseDownHandler);

  const mouseMoveHandler = function (e) {
    // How far the mouse has been moved
    const dx = e.clientX - x;
    const dy = e.clientY - y;

    const newLeftWidth = ((leftWidth + dx) * 100) / resizer.parentNode.getBoundingClientRect().width;
    leftSide.style.width = `${newLeftWidth}%`;

    document.body.style.cursor = 'col-resize';

    leftSide.style.userSelect = 'none';
    leftSide.style.pointerEvents = 'none';

    rightSide.style.userSelect = 'none';
    rightSide.style.pointerEvents = 'none';
  };

  const mouseUpHandler = function () {
    resizer.style.removeProperty('cursor');
    document.body.style.removeProperty('cursor');

    leftSide.style.removeProperty('user-select');
    leftSide.style.removeProperty('pointer-events');

    rightSide.style.removeProperty('user-select');
    rightSide.style.removeProperty('pointer-events');

    // Remove the handlers of `mousemove` and `mouseup`
    document.removeEventListener('mousemove', mouseMoveHandler);
    document.removeEventListener('mouseup', mouseUpHandler);
  };

  let dockBoxes = document.querySelectorAll(".dock-box");
  dockBoxes.forEach(dockBox => {
    dockBox.addEventListener("dragover", () => {
      const currentDraggable = document.querySelector(".dragging");
      dockBox.appendChild(currentDraggable);
    })
  })

  let draggables = document.querySelectorAll(".draggable");
  draggables.forEach(draggable => {
    draggable.addEventListener("dragstart", () => {
      draggable.classList.add("dragging");
    })

    draggable.addEventListener("dragend", ()=> {
      draggable.classList.remove("dragging");
    })
  })  

}