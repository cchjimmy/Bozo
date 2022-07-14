var intervalId;
onmessage = (e) => {
  if (intervalId) {
    clearInterval(intervalId);
  }
  intervalId = setInterval(() => {
    var transforms = [];
    var colors = [];
    for (let i = 0; i < e.data.entityIds.length; i++) {
      let pos = e.data.components.position[e.data.entityIds[i]];
      let vel = e.data.components.velocity[e.data.entityIds[i]];
      let size = e.data.components.size[e.data.entityIds[i]];
      pos.x += vel.x * e.data.timeStep;
      pos.y += vel.y * e.data.timeStep;

      transforms.push(
        [Math.floor(pos.x * e.data.unitScale - (size.x * e.data.unitScale) / 2), // screen pos x
        Math.floor(-pos.y * e.data.unitScale - (size.y * e.data.unitScale) / 2), // screen pos y
        Math.floor(size.x * e.data.unitScale), // screen size x
        Math.floor(size.y * e.data.unitScale)] // screen size y
      );
      colors.push(e.data.components.color[e.data.entityIds[i]]);
    }
    postMessage({ transforms, colors });
  }, e.data.timeStep * 1000);
}
