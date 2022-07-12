onmessage = (e) => {
  setInterval(() => {
    var screenPosX
    var screenPosY
    var screenSizeX
    var screenSizeY
    var transforms = [];
    var colors = [];
    for (let i = 0; i < e.data[2].length; i++) {
      e.data[1].position[e.data[2][i]].x += e.data[1].velocity[e.data[2][i]].x * e.data[0];
      e.data[1].position[e.data[2][i]].y += e.data[1].velocity[e.data[2][i]].y * e.data[0];

      screenPosX = Math.floor((e.data[1].position[e.data[2][i]].x) * e.data[3] + e.data[4] / 2);
      screenPosY = Math.floor((-e.data[1].position[e.data[2][i]].y) * e.data[3] + e.data[5] / 2);
      screenSizeX = Math.floor(e.data[1].size[e.data[2][i]].x * e.data[3]);
      screenSizeY = Math.floor(e.data[1].size[e.data[2][i]].y * e.data[3]);
      transforms.push([screenPosX, screenPosY, screenSizeX, screenSizeY]);
      colors.push(e.data[1].color[e.data[2][i]]);
    }
    postMessage([e.data[1], transforms, colors]);
  }, e.data[0] * 1000);
}