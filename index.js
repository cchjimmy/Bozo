const textureSize = 16; // side length of each tile in pixels
const worldSize = 500; // worldSize^2 tiles
const viewportX = 0;
const viewportY = 0;

var player;
var cam;
var texture;
var font;
var fps;
// var backdrop;
var viewport;
var mousePos;

var buttons = [];
var toggles = [];
var entities = [];

var playing = false;
var mainMenu = true;
var settingsMenu = false;
var selection = false;

var debug = true;
var fullsrn = false;
var entityShadow = true;

var tiles = [];
var tileIds = [];
var tileNames = ['Grass', 'Orange thing', 'Person', 'Water', 'Rock', 'Blank'];

function generate() {
  let id;
  noiseSeed(800);

  for (let j = 0; j < worldSize; j++) {
    for (let i = 0; i < worldSize; i++) {
      id = 3;
      if (noise(i / 100, j / 100) > 0.5) {
        id = 0;
      }
      tileIds.push(id);
      world.image(tiles[tileIds[i + j * worldSize]], i * textureSize, (worldSize - j - 1) * textureSize);
    }
  }
}

function worldUpdate() {
  viewport.translate(-cam.pos.x, cam.pos.y);
  viewport.image(world, 0, -worldSize * textureSize);
}

function separateTextures(x, y) {
  let gridArea = createVector(x, y);
  let n = 0;
  for (let y = 0; y < gridArea.y; y++) {
    for (let x = 0; x < gridArea.x; x++) {
      tiles[n] = createImage(textureSize, textureSize);
      tiles[n].loadPixels();

      for (let j = y * textureSize; j < (1 + y) * textureSize; j++) {
        for (let i = x * textureSize; i < (1 + x) * textureSize; i++) {
          let c = texture.get(i, j);
          tiles[n].set(i - x * textureSize, j - y * textureSize, c);
        }
      }

      tiles[n].updatePixels();
      n++;
    }
  }
}

// function separateTextures(x, y) {
//   let gridArea = createVector(x, y);
//   let n = 0;
//   for (let y = 0; y < gridArea.y; y++) {
//     for (let x = 0; x < gridArea.x; x++) {
//       tiles[n] = createGraphics(textureSize, textureSize);
//       tiles[n].image(texture, 0, 0, textureSize, textureSize, x * textureSize, y * textureSize, textureSize, textureSize);
//       n++;
//     }
//   }
// }

function preload() {
  texture = loadImage('textures/texture4832.png');
  // backdrop = loadImage('textures/sky.jpeg')
  // texture = loadImage('textures/texture.png');
  font = loadFont('fonts/Mulish-VariableFont_wght.ttf');
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  viewport = createGraphics(windowWidth, windowHeight);
  viewport.textFont(font);
  separateTextures(3, 2); // number of tiles (x, y) in texture
  noCursor();
  cursor(CROSS);
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  viewport = createGraphics(windowWidth, windowHeight);
}

function draw() {
  if (keyIsDown(27)) { // esc
    mainMenu = true;
    playing = false;
    settingsMenu = false;
    selection = false;
  }

  if (keyIsDown(82)) { // r
    entities = [];
    entities.push(player);
  }

  // interfaces
  if (mainMenu) {
    viewport.push();
    viewport.textAlign(CENTER, CENTER);

    // background
    viewport.fill(59, 52, 59);
    viewport.noStroke();
    viewport.rect(0, 0, viewport.width, viewport.height);

    // some texts
    viewport.fill(255);
    viewport.textSize(32);
    viewport.text('Game', viewport.width / 2, viewport.height / 4);

    viewport.textSize(11);
    viewport.text('Note: this is not a virus, just a game!', viewport.width - 100, viewport.height - 20)

    // buttons
    buttons[0] = new Button('Play', viewport.width / 2, viewport.height * 0.60, 100, 35);
    buttons[1] = new Button('Settings', viewport.width / 2, viewport.height * 0.60 + 40, 100, 35);
    for (let i = 0; i <= 1; i++) {
      buttons[i].show();
    }
    viewport.pop();
  }

  if (settingsMenu) {
    viewport.push();
    viewport.textAlign(CENTER, CENTER);

    // background
    viewport.fill(59, 52, 59);
    viewport.noStroke();
    viewport.rect(0, 0, viewport.width, viewport.height);
    // viewport.background(59, 52, 59);

    // title
    viewport.fill(255);
    viewport.textSize(32);
    viewport.text('Settings', 100, 30);

    // toggles
    toggles[0] = new Toggle('Fullscreen', fullsrn, 50, 100);
    toggles[1] = new Toggle('Debug', debug, 50, 100 + 30);
    toggles[2] = new Toggle('Entity shadow', entityShadow, 50, 100 + 60);
    for (let i = 0; i <= 2; i++) {
      toggles[i].show();
    }
    viewport.pop();
  }

  if (playing) {
    fps = 1 / (deltaTime / 1000);
    // viewport.image(backdrop, 0, 0);
    viewport.fill('#93bdc2');
    viewport.noStroke();
    viewport.rect(0, 0, viewport.width, viewport.height);

    mousePos = createVector((mouseX - viewport.width / 2 + cam.pos.x * cam.scl) / (textureSize * cam.scl), -(mouseY - viewport.height / 2 - cam.pos.y * cam.scl) / (textureSize * cam.scl));

    viewport.push();
    cam.update();
    worldUpdate();

    entities.sort((a, b) => { return - a.pos.y + b.pos.y });
    entities.forEach(entity => {
      entity.update();
    });
    viewport.pop();

    if (debug) {
      viewport.push();
      viewport.fill(0, 100);
      viewport.rect(0, 0, 280, 110);

      viewport.textAlign(LEFT, TOP);
      viewport.noStroke();
      viewport.fill(255);
      viewport.textSize(15);

      viewport.text('debug', 10, 5);
      viewport.text('scale: ' + floor(cam.scl), 10, 20);
      viewport.text('player position: ' + floor(player.pos.x / textureSize) + ', ' + floor(player.pos.y / textureSize), 10, 35);
      // viewport.text('fps: ' + floor(fps), 10, 30);
      viewport.text('mouse position: ' + floor(mousePos.x) + ', ' + floor(mousePos.y), 10, 50);
      viewport.text('camera position: ' + floor(cam.pos.x / textureSize) + ', ' + floor(cam.pos.y / textureSize), 10, 65);
      viewport.text('currently on: ' + tileNames[tileIds[floor(player.pos.x / textureSize) + floor(player.pos.y / textureSize) * worldSize]], 10, 80);

      viewport.pop();
    }
  }

  if (selection) {
    push();
    // background
    fill(59, 52, 59);
    noStroke();
    rect(0, 0, windowWidth, windowHeight);

    // title
    fill(255);
    textSize(32);
    text('Select', 100, 30);

    fill(49, 42, 49);
    noStroke();
    rect(width * 0.25 + 100, 90, width * 0.45, height * 0.7, 10, 10, 10, 10);

    // buttons
    buttons[2] = new Button('', width * 0.25, 110, 150, 40);
    buttons[3] = new Button('', width * 0.25, 160, 150, 40);
    buttons[4] = new Button('', width * 0.25, 210, 150, 40);
    buttons[5] = new Button('', width * 0.25, 260, 150, 40);
    for (let i = 2; i <= 5; i++) {
      buttons[i].show();
    }
    pop();
  }

  image(viewport, viewportX, viewportY);
}

function mousePressed() {
  // buttons, toggles functionality definition
  if (mainMenu) {
    if (buttons[0].hover()) { // play
      playing = true;
      settingsMenu = false;
      mainMenu = false;
      selection = false;

      tileIds = [];
      entities = [];

      cam = new Camera();
      player = new Entity(2, 500, 500, 1, 3, 'player');
      entities.push(player);
      world = createGraphics(worldSize * textureSize, worldSize * textureSize);
      generate();
    }

    if (buttons[1].hover()) { // settings
      playing = false;
      settingsMenu = true;
      mainMenu = false;
      selection = false;
    }
  }

  if (settingsMenu) {
    if (toggles[0].hover()) { // fullscreen
      fullscreen(!fullsrn);
      fullsrn = !fullsrn;
    }

    if (toggles[1].hover()) { // debug
      debug = !debug;
    }

    if (toggles[2].hover()) { // entity shadow
      entityShadow = !entityShadow;
    }
  }

  if (selection) {
    // if (buttons[2].hover()) {
    //   image(textures[2], width * 0.6, 100, 100, 100);
    // }
  }

  if (playing && mousePos != null) {
    entities.push(new Entity(2, mousePos.x, mousePos.y, 1, 1, 'npc'));
  }
}

class Camera {
  constructor() {
    this.pos = createVector(0 * textureSize, 0 * textureSize);
    this.scl = 2.5;
  }

  update() {
    // follows player
    this.pos = player.pos;

    if (keyIsDown(38)) { // ArrowUp
      this.scl += 0.01;
      if (this.scl >= 5) {
        this.scl = 5;
      }
    }

    if (keyIsDown(40)) { // ArrowDown
      this.scl -= 0.01;
      if (this.scl <= 0.005) {
        this.scl = 0.005;
      }
    }

    if (keyIsDown(32)) { // Space
      this.scl = 2.5;
    }

    // rotation?
    // if (keyIsDown(37)) { // ArrowLeft

    // }

    // translate -> rotate -> scale
    viewport.translate(viewport.width / 2, viewport.height / 2);
    viewport.scale(this.scl);
  }
}

class Button {
  constructor(name, x, y, w, h) {
    this.name = name;
    this.x = x;
    this.y = y;
    this.w = w;
    this.h = h;
  }

  show() {
    viewport.push();
    viewport.noStroke();
    viewport.fill(255);
    viewport.rect(this.x - this.w / 2, this.y - this.h / 2, this.w, this.h, 10, 10, 10, 10);
    viewport.fill(0);
    viewport.textSize(11);
    viewport.text(this.name, this.x - this.w / 2, this.y - this.h / 2, this.w, this.h);

    if (this.hover()) {
      viewport.fill(255);
      viewport.strokeWeight(10);
      viewport.textSize(20);
      viewport.text('>', this.x - this.w / 2 - 15, this.y - 4);
      viewport.text('<', this.x + this.w / 2 + 15, this.y - 4);
    }
    viewport.pop();
  }

  hover() {
    if (mouseX <= viewportX + this.x + this.w / 2 && mouseX >= viewportX + this.x - this.w / 2 && mouseY <= viewportY + this.y + this.h / 2 && mouseY >= viewportY + this.y - this.h / 2) {
      return true;
    }
    return false;
  }
}

class Toggle {
  constructor(name, state, x, y) {
    this.name = name;
    this.state = state;
    this.x = x;
    this.y = y;
  }

  show() {
    viewport.push();
    viewport.textAlign(LEFT, CENTER);
    viewport.textSize(20);
    viewport.fill(255);
    viewport.noStroke();
    viewport.text(this.name, this.x, this.y);
    viewport.text(this.state, viewport.width - 80, this.y);

    viewport.stroke(255);
    viewport.strokeWeight(2.5);
    if (this.state) {
      viewport.fill('green');
    } else {
      viewport.fill(59, 52, 59);
    }
    viewport.rect(viewport.width - 120, this.y, 20, 10, 10, 10, 10, 10);
    viewport.pop();
  }

  hover() {
    if (mouseX <= viewportX + viewport.width - 120 + 20 + 2.5 && mouseX >= viewportX + viewport.width - 120 - 2.5 && mouseY <= viewportY + this.y + 10 + 2.5 && mouseY >= viewportY + this.y - 2.5) {
      return true;
    }
    return false;
  }
}

class Entity {
  constructor(id, x, y, size, speed, type) {
    this.id = id;
    this.pos = createVector(x * textureSize, y * textureSize);
    this.size = size * textureSize;
    this.speed = speed;
    this.type = type;
  }

  update() {
    let speed = this.speed * textureSize * (1 / fps); // because of delta time this.speed needs to be in the update function

    if (this.type == 'player') {
      // movement
      if (keyIsDown(87)) { // w
        this.pos.y += speed;
      }

      if (keyIsDown(65)) { // a
        this.pos.x -= speed;
      }

      if (keyIsDown(83)) { // s
        this.pos.y -= speed;
      }

      if (keyIsDown(68)) { // d
        this.pos.x += speed;
      }
    }
    this.show();
  }

  show() {
    viewport.push();
    if (this.pos.x < this.size / 2) {
      this.pos.x = this.size / 2;
    }
    if (this.pos.y < this.size / 2) {
      this.pos.y = this.size / 2;
    }
    if (this.pos.x > this.size * worldSize - this.size / 2) {
      this.pos.x = this.size * worldSize - this.size / 2;
    }
    if (this.pos.y > this.size * worldSize - this.size / 2) {
      this.pos.y = this.size * worldSize - this.size / 2;
    }

    viewport.translate(this.pos.x, -this.pos.y);

    if (dist(cam.pos.x, cam.pos.y, this.pos.x, this.pos.y) < 10 * textureSize) {
      // shadow
      if (entityShadow) {
        viewport.noStroke();
        viewport.fill(0, 50);
        viewport.ellipse(0, 0, (this.size / 2 + 5), this.size / 4);
      }

      viewport.image(tiles[this.id], - this.size / 2, - this.size, this.size);
    }
    viewport.pop();
  }
}

function dist(x1, y1, x2, y2) {
  return ((x1 - x2) ^ 2 + (y1 - y2) ^ 2) ^ 0.5;
}