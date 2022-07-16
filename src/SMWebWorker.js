var intervalId;
onmessage = (e) => {
  if (intervalId) {
    clearInterval(intervalId);
  }
  intervalId = setInterval(() => {
    var transforms = [];
    var colors = [];
    for (let entity of e.data.entityIds) {
      let pos = e.data.components.position[entity];
      let vel = e.data.components.velocity[entity] || {x: 0, y: 0};
      let size = e.data.components.size[entity];
      pos.x += vel.x * e.data.timeStep;
      pos.y += vel.y * e.data.timeStep;

      transforms.push(
        [Math.floor(pos.x * e.data.unitScale - (size.x * e.data.unitScale) / 2), // screen pos x
        Math.floor(-pos.y * e.data.unitScale - (size.y * e.data.unitScale) / 2), // screen pos y
        Math.floor(size.x * e.data.unitScale), // screen size x
        Math.floor(size.y * e.data.unitScale)] // screen size y
      );
      colors.push(e.data.components.color[entity] || "white");
    }
    postMessage({ transforms, colors });
  }, e.data.timeStep * 1000);
}
