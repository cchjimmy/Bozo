import debounce from "./utilities/debounce.js";

// importScripts("./utilities/debounce.js")

var screenPosX;
var screenPosY;
var screenSizeX;
var screenSizeY;

var intervalId;
onmessage = (e) => {
  debounce(() => {
    if (e.data.name == "newProperties") {
      if (intervalId) {
        clearInterval(intervalId);
      }
    }
    intervalId = setInterval(() => {
      var transforms = [];
      var colors = [];
      for (let i = 0; i < e.data.entityIds.length; i++) {
        e.data.components.position[e.data.entityIds[i]].x += (e.data.components.velocity[e.data.entityIds[i]].x * e.data.timeStep);
        e.data.components.position[e.data.entityIds[i]].y += (e.data.components.velocity[e.data.entityIds[i]].y * e.data.timeStep);

        screenSizeX = e.data.components.size[e.data.entityIds[i]].x * e.data.unitScale;
        screenSizeY = e.data.components.size[e.data.entityIds[i]].y * e.data.unitScale;
        screenPosX = e.data.components.position[e.data.entityIds[i]].x * e.data.unitScale + e.data.canvasWidth / 2 - screenSizeX / 2;
        screenPosY = -e.data.components.position[e.data.entityIds[i]].y * e.data.unitScale + e.data.canvasHeight / 2 - screenSizeY / 2;
        transforms.push([Math.floor(screenPosX), Math.floor(screenPosY), Math.floor(screenSizeX), Math.floor(screenSizeY)]);
        colors.push(e.data.components.color[e.data.entityIds[i]]);
      }
      postMessage({ components: e.data.components, transforms, colors });
    }, e.data.timeStep * 1000);
  }, 100);
}