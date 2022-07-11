onmessage = (e) => {
  setInterval(() => {
    for (let i = 0; i < e.data[2].length; i++) {
      e.data[1].position[e.data[2][i]].x += e.data[1].velocity[e.data[2][i]].x * e.data[0];
      e.data[1].position[e.data[2][i]].y += e.data[1].velocity[e.data[2][i]].y * e.data[0];
    }
    postMessage(e.data[1]);
  }, e.data[0] * 1000);
}