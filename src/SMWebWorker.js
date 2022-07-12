var screenPosX;
var screenPosY;
var screenSizeX;
var screenSizeY;

var intervalId;
onmessage = (e) => {
  if (e.data.name == "newProperties") {
    if (intervalId) {
      clearInterval(intervalId);
    }
  }
  intervalId = setInterval(() => {
    var transforms = [];
    var colors = [];
    for (let i = 0; i < e.data.entityIds.length; i++) {
      let worldPosX = e.data.components.position[e.data.entityIds[i]].x += e.data.components.velocity[e.data.entityIds[i]].x * e.data.timeStep;
      let worldPosY = e.data.components.position[e.data.entityIds[i]].y += e.data.components.velocity[e.data.entityIds[i]].y * e.data.timeStep;

      screenPosX = Math.floor(worldPosX * e.data.unitScale + e.data.canvasWidth / 2);
      screenPosY = Math.floor(-worldPosY * e.data.unitScale + e.data.canvasHeight / 2);
      screenSizeX = Math.floor(e.data.components.size[e.data.entityIds[i]].x * e.data.unitScale);
      screenSizeY = Math.floor(e.data.components.size[e.data.entityIds[i]].y * e.data.unitScale);
      transforms.push([screenPosX, screenPosY, screenSizeX, screenSizeY]);
      colors.push(e.data.components.color[e.data.entityIds[i]]);
    }
    postMessage({ components: e.data.components, transforms, colors });
  }, e.data.timeStep * 1000);
}