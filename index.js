const subTextureSize = 16; // side length of each tile in pixels
const worldSize = 50; // worldSize^2 subTexture
const viewportX = 0;
const viewportY = 0;
const updateRadius = 10;

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
var rendered = [];

var playing = false;
var mainMenu = true;
var settingsMenu = false;
var selection = false;

var debug = true;
var fullsrn = false;
var entityShadow = true;

var first = true;

var subTexture = [];
var tileIds = [];
const tileNames = ['Grass', 'Orange thing', 'Person', 'Water', 'Rock', 'Blank'];

var i = 0;
var j = 0;
var worldGenerated = false;

function generate() {
  // let id;
  // randomSeed(800);
  // world = createGraphics(worldSize * subTextureSize, worldSize * subTextureSize);

  // for (let j = 0; j < worldSize; j++) {
  //   for (let i = 0; i < worldSize; i++) {
  //     id = 3;
  //     if (noise(i / 100, j / 100) > 0.5) {
  //       id = 0;
  //       if (noise(i / 100, j / 100) > 0.6) {
  //         id = 4;
  //       }
  //     }
  //     tileIds.push(id);

  //     world.image(subTexture[tileIds[i + j * worldSize]], i * subTextureSize, (worldSize - j - 1) * subTextureSize);
  //   }
  // }

  if (worldGenerated == false) {
    if (j == worldSize && i == 0) {
      worldGenerated = true;
      playing = true;
      console.log('world generated');
    } else {
      if (i == 0 && j == 0) {
        var id;
        randomSeed(800);
        world = createGraphics(worldSize * subTextureSize, worldSize * subTextureSize);
      }

      id = 3;
      if (noise(i / 100, j / 100) > 0.5) {
        id = 0;
        if (noise(i / 100, j / 100) > 0.6) {
          id = 4;
        }
      }
      tileIds.push(id);
      world.image(subTexture[tileIds[i + j * worldSize]], i * subTextureSize, (worldSize - j - 1) * subTextureSize);
      // console.log(i + ', ' + j + ', ' + tileIds.length + ', ' + 'world generated ' + ((tileIds.length * 100) / (worldSize * worldSize)) + '%');

      if (j < worldSize && i == worldSize - 1) {
        i = 0;
        j++;
      } else {
        i++;
      }
    }
  }
}

function worldUpdate() {
  viewport.translate(-cam.pos.x * subTextureSize, cam.pos.y * subTextureSize);

  if (worldGenerated == true) {
    if (keyIsDown(87) || keyIsDown(65) || keyIsDown(83) || keyIsDown(68) || first) {
      for (let j = floor(cam.pos.y) - updateRadius; j < floor(cam.pos.y) + updateRadius; j++) {
        for (let i = floor(cam.pos.x) - updateRadius; i < floor(cam.pos.x) + updateRadius; i++) {
          let pos = { pos: { x: i, y: j } };
          if (dist2D(cam, pos) < updateRadius && i + j * worldSize >= 0 && rendered[i + j * worldSize] != tileIds[i + j * worldSize]) {

            if (first == true) {
            world.image(subTexture[tileIds[i + j * worldSize]], i * subTextureSize, (worldSize - j - 1) * subTextureSize);
            } else {
            world.image(subTexture[1], i * subTextureSize, (worldSize - j - 1) * subTextureSize);
            }
            // console.log(first);
            rendered[i + j * worldSize] = tileIds[i + j * worldSize];
          }
        }
      }
      first = false;
    }

    entities.forEach(entity => {
      if (dist2D(entity, cam) <= updateRadius + 1) {
        for (let j = floor(entity.pos.y) - 1; j < floor(entity.pos.y) + 1 * 2; j++) {
          for (let i = floor(entity.pos.x) - 1; i < floor(entity.pos.x) + 1 * 2; i++) {
            let pos = { pos: { x: i, y: j } };
            if (dist2D(entity, pos) <= 2 && i + j * worldSize >= 0 && i + j * worldSize < tileIds.length) {
              world.image(subTexture[tileIds[i + j * worldSize]], i * subTextureSize, (worldSize - j - 1) * subTextureSize);
            }
          }
        }
      }
    });

    entities.sort((a, b) => { return - a.pos.y + b.pos.y });
    entities.forEach(entity => {
      entity.update();
    });


  } else {
    generate();
  }
  viewport.image(world, 0, -worldSize * subTextureSize);
}

function separateTextureAtlas(subTextureSize) {
  let textureAtlasSize = { x: texture.width / subTextureSize, y: texture.height / subTextureSize };
  let n = 0;
  for (let y = 0; y < textureAtlasSize.y; y++) {
    for (let x = 0; x < textureAtlasSize.x; x++) {
      subTexture[n] = createImage(subTextureSize, subTextureSize);
      subTexture[n].loadPixels();

      for (let j = y * subTextureSize; j < (1 + y) * subTextureSize; j++) {
        for (let i = x * subTextureSize; i < (1 + x) * subTextureSize; i++) {
          let c = texture.get(i, j);
          subTexture[n].set(i - x * subTextureSize, j - y * subTextureSize, c);
        }
      }

      subTexture[n].updatePixels();
      n++;
    }
  }
}

// function separateTextureAtlas(x, y) {
//   let textureAtlasSize = createVector(x, y);
//   let n = 0;
//   for (let y = 0; y < textureAtlasSize.y; y++) {
//     for (let x = 0; x < textureAtlasSize.x; x++) {
//       subTexture[n] = createGraphics(subTextureSize, subTextureSize);
//       subTexture[n].image(texture, 0, 0, subTextureSize, subTextureSize, x * subTextureSize, y * subTextureSize, subTextureSize, subTextureSize);
//       n++;
//     }
//   }
// }

function preload() {
  texture = loadImage('textures/texture4832.png');
  // backdrop = loadImage('subTexture/sky.jpeg')
  // texture = loadImage('subTexture/texture.png');
  // font = loadFont('fonts/Mulish-VariableFont_wght.ttf');

}

function setup() {
  createCanvas(windowWidth, windowHeight);
  viewport = createGraphics(windowWidth, windowHeight);
  pixelDensity(1);
  // viewport.textFont(font);
  separateTextureAtlas(subTextureSize);

  // change cursor, crosshair looks pretty good imo
  cursor('crosshair');

  // main menu
  // buttons
  buttons[0] = new Button('Play', viewport.width / 2, viewport.height * 0.60, true, 11, null, null, 100, 35, 10, 10, 10, 10);
  buttons[1] = new Button('Settings', viewport.width / 2, viewport.height * 0.60 + 40, true, 11, null, null, 100, 35, 10, 10, 10, 10);

  //settings
  // toggles
  toggles[0] = new Toggle('Fullscreen', fullsrn, 50, 100);
  toggles[1] = new Toggle('Debug', debug, 50, 100 + 30);
  toggles[2] = new Toggle('Entity shadow', entityShadow, 50, 100 + 60);
  // buttons
  buttons[6] = new Button('X', width - 20, 20, 40, 40);

  // selection menu
  // buttons
  // buttons[2] = new Button('', width * 0.25, 110, 150, 40);
  // buttons[3] = new Button('', width * 0.25, 160, 150, 40);
  // buttons[4] = new Button('', width * 0.25, 210, 150, 40);
  // buttons[5] = new Button('', width * 0.25, 260, 150, 40);
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight, false);
  viewport = null;
  viewport = createGraphics(windowWidth, windowHeight);

  // update positions for buttons
  buttons[0].pos = { x: viewport.width / 2, y: viewport.height * 0.60 }; // play button
  buttons[1].pos = { x: viewport.width / 2, y: viewport.height * 0.60 + 40 }; // settings button
  buttons[6].pos = { x: viewport.width - 40, y: 20 }; // x button on settings menu

  // if (selection) {
  //   buttons[2] = new Button('', width * 0.25, 110, 150, 40);
  //   buttons[3] = new Button('', width * 0.25, 160, 150, 40);
  //   buttons[4] = new Button('', width * 0.25, 210, 150, 40);
  //   buttons[5] = new Button('', width * 0.25, 260, 150, 40);
  // }
}

function draw() {
  if (keyIsDown(27)) { // esc back to main menu
    mainMenu = true;
    playing = false;
    settingsMenu = false;
    selection = false;

    player = null;
    cam = null;
    world = null;

    worldGenerated = false;

    tileIds = [];
    entities = [];
    rendered = [];
    i = 0;
    j = 0;
  }

  if (keyIsDown(82)) { // r clear all entities but not player
    entities = [];
    entities.push(player);
  }

  // interfaces
  if (mainMenu) {
    viewport.push();
    viewport.textAlign(CENTER, CENTER);

    // background
    viewport.background(59, 52, 59);

    // some texts
    viewport.fill(255);
    viewport.textSize(32);
    viewport.text('Game', viewport.width / 2, viewport.height / 4);

    viewport.textSize(11);
    viewport.text('Note: this is not a virus, just a game!', viewport.width - 100, viewport.height - 20)
    viewport.pop();

    for (let i = 0; i <= 1; i++) {
      buttons[i].show();
    }
  }

  if (settingsMenu) {
    viewport.push();
    viewport.textAlign(CENTER, CENTER);

    // background
    viewport.background(59, 52, 59)

    // title
    viewport.fill(255);
    viewport.textSize(32);
    viewport.text('Settings', 100, 30);
    viewport.pop();

    for (let i = 0; i <= 2; i++) {
      toggles[i].show();
    }
    buttons[6].show();
  }

  if (playing) {
    // background
    viewport.background('#93bdc2');

    viewport.push();
    cam.update();
    worldUpdate();
    viewport.pop();

    if (debug && worldGenerated) {
      viewport.push();
      viewport.noStroke();
      viewport.fill(0, 100);
      viewport.rect(0, 0, 400, (15 + 1) * 8 + 20);

      viewport.textAlign(LEFT, TOP);
      viewport.fill(255);
      viewport.textSize(15);

      viewport.text('debug' + '\n' + 'scale: ' + floor(cam.scl) + '\n' + 'player position: ' + floor(player.pos.x) + ', ' + floor(player.pos.y) + '\n' + 'mouse position: ' + floor(mousePos.x) + ', ' + floor(mousePos.y) + '\n' + 'camera position: ' + floor(cam.pos.x) + ', ' + floor(cam.pos.y) + '\n' + 'currently on: ' + tileNames[tileIds[floor(player.pos.x) + floor(player.pos.y) * worldSize]] + '\n' + 'entity count: ' + entities.length, 10, 5)
      viewport.pop();
    }
  }

  if (selection) {
    viewport.push();
    // background
    viewport.fill(59, 52, 59);
    viewport.noStroke();
    viewport.rect(0, 0, windowWidth, windowHeight);

    // title
    viewport.fill(255);
    viewport.textSize(32);
    viewport.text('Select', 100, 30);

    viewport.fill(49, 42, 49);
    viewport.noStroke();
    viewport.rect(width * 0.25 + 100, 90, width * 0.45, height * 0.7, 10, 10, 10, 10);

    for (let i = 2; i <= 5; i++) {
      buttons[i].show();
    }
    viewport.pop();
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

      first = true;

      cam = new Camera();
      player = new Entity(2, 0, 0, 1, 1, 0.1, 'player');

      // generate();
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
      toggles[0].state = fullsrn
    }

    if (toggles[1].hover()) { // debug
      debug = !debug;
      toggles[1].state = debug;
    }

    if (toggles[2].hover()) { // entity shadow
      entityShadow = !entityShadow;
      toggles[2].state = entityShadow;
    }

    if (buttons[6].hover()) {
      mainMenu = true;
      playing = false;
      settingsMenu = false;
      selection = false;
    }
  }

  if (selection) {
    // if (buttons[2].hover()) {
    //   image(subTexture[2], width * 0.6, 100, 100, 100);
    // }
  }

  if (playing && mousePos != null && worldGenerated) {
    new Entity(2, mousePos.x, mousePos.y, 1, 1, 0, 'npc');
  }
}

class Camera {
  constructor() {
    this.pos = { x: 0 * subTextureSize, y: 0 * subTextureSize };
    this.scl = 2.5;
  }

  update() {
    // follows player
    this.pos = player.pos;

    fps = 1 / (deltaTime / 1000);
    mousePos = { x: (mouseX - viewport.width / 2) / (subTextureSize * this.scl) + this.pos.x, y: -(mouseY - viewport.height / 2) / (subTextureSize * this.scl) + this.pos.y };

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
  constructor(name, x, y, hasHoverEffect, textSize, textColor, buttonColor, width, height, topLeft, topRight, bottomRight, bottomLeft) {
    this.name = name;
    this.pos = { x: x, y: y };
    this.size = { w: width, h: height, ts: textSize };
    this.cornerRadiuses = { tl: topLeft, tr: topRight, br: bottomRight, bl: bottomLeft };
    this.col = { tc: textColor, bc: buttonColor };
    this.bool = hasHoverEffect;

    if (name == null) {
      this.name = '';
    }
    if (hasHoverEffect == null) {
      this.bool = false;
    }
    if (textSize == null) {
      this.size.ts = 11;
    }
    if (textColor == null) {
      this.col.tc = 0;
    }
    if (buttonColor == null) {
      this.col.bc = 255;
    }
    if (width == null) {
      this.size.w = textWidth(this.name) + 10;
    }
    if (height == null) {
      this.size.h = 20;
    }
  }

  show() {
    viewport.push();
    viewport.textAlign(CENTER, CENTER);
    viewport.noStroke();
    viewport.fill(this.col.bc);
    viewport.rect(this.pos.x - this.size.w / 2, this.pos.y - this.size.h / 2, this.size.w, this.size.h, this.cornerRadiuses.tl, this.cornerRadiuses.tr, this.cornerRadiuses.br, this.cornerRadiuses.bl);
    viewport.fill(this.col.tc);
    viewport.textSize(this.size.ts);
    viewport.text(this.name, this.pos.x, this.pos.y);

    if (this.hover() && this.bool) {
      viewport.fill(this.col.bc);
      viewport.strokeWeight(10);
      viewport.textSize(20);
      viewport.text('>', this.pos.x - this.size.w / 2 - 15, this.pos.y - 4);
      viewport.text('<', this.pos.x + this.size.w / 2 + 15, this.pos.y - 4);
    }
    viewport.pop();
  }

  hover() {
    if (mouseX <= viewportX + this.pos.x + this.size.w / 2 && mouseX >= viewportX + this.pos.x - this.size.w / 2 && mouseY <= viewportY + this.pos.y + this.size.h / 2 && mouseY >= viewportY + this.pos.y - this.size.h / 2) {
      return true;
    }
    return false;
  }
}

class Toggle {
  constructor(name, state, x, y) {
    this.name = name;
    this.state = state;
    this.pos = { x: x, y: y };
  }

  show() {
    viewport.push();
    viewport.textAlign(LEFT, CENTER);
    viewport.textSize(20);
    viewport.fill(255);
    viewport.noStroke();
    viewport.text(this.name, this.pos.x, this.pos.y);
    viewport.text(this.state, viewport.width - 80, this.pos.y);

    viewport.stroke(255);
    viewport.strokeWeight(2.5);
    if (this.state) {
      viewport.fill('green');
    } else {
      viewport.fill(59, 52, 59);
    }
    viewport.rect(viewport.width - 120, this.pos.y - 5, 20, 10, 10, 10, 10, 10);
    viewport.pop();
  }

  hover() {
    if (mouseX <= viewportX + viewport.width - 120 + 20 + 2.5 && mouseX >= viewportX + viewport.width - 120 - 2.5 && mouseY <= viewportY + this.pos.y + 10 + 2.5 && mouseY >= viewportY + this.pos.y - 2.5) {
      return true;
    }
    return false;
  }
}

class Entity {
  constructor(tileId, x, y, width, height, speed, type) {
    this.id = tileId;
    this.pos = { x: x, y: y };
    this.size = { w: width, h: height };
    this.speed = speed;
    this.type = type;
    this.texture = subTexture[this.id];

    if (tileId > subTexture.length || width <= 0 || height <= 0 || speed < 0 || type == null) {
      this.id = 2;
      this.pos = cam.pos;
      this.size = { w: 1, h: 1 };
      this.speed = 1;
      this.type = 'npc';
    }
    entities.push(this);

    this.show();
  }

  update() {
    let speed = this.speed * subTextureSize * (1 / fps); // because of delta time this.speed needs to be in the update function

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

    if (this.pos.x < this.size.w / 2) {
      this.pos.x = this.size.w / 2;
    }
    if (this.pos.y < this.size.h / 2) {
      this.pos.y = this.size.h / 2;
    }
    if (this.pos.x > this.size.w * worldSize - this.size.w / 2) {
      this.pos.x = this.size.w * worldSize - this.size.w / 2;
    }
    if (this.pos.y > this.size.h * worldSize - this.size.h / 2) {
      this.pos.y = this.size.h * worldSize - this.size.h / 2;
    }

    if (dist2D(cam, this) < updateRadius && this.mesh != null) {
      world.push();
      world.translate(this.pos.x * subTextureSize, (-this.pos.y + worldSize) * subTextureSize);
      world.image(this.mesh, -this.size.w * subTextureSize / 2, - this.size.h * subTextureSize);
      world.pop();
    }
  }

  show() {
    this.shadowSize = { w: (this.size.w * subTextureSize / 2 + 5), h: this.size.h * subTextureSize / 4 }
    this.mesh = createGraphics(this.size.w * subTextureSize, this.size.h * subTextureSize + this.shadowSize.h / 2);

    if (entityShadow) {
      if (this.type == 'player' || this.type == 'npc') {
        // shadow
        this.mesh.noStroke();
        this.mesh.fill(0, 50);
        this.mesh.ellipse(this.size.w * subTextureSize / 2, this.size.h * subTextureSize, this.shadowSize.w, this.shadowSize.h);
      }
    }

    this.mesh.image(this.texture, 0, 0);
  }
}

function dist2D(a, b) {
  return ((a.pos.x - b.pos.x) ** 2 + (a.pos.y - b.pos.y) ** 2) ** 0.5;
}

class Slider {
  constructor(name, x, y, start, end) {
    this.name = name;
    this.pos = { x: x, y: y };
    this.s = start;
    this.e = end;

  }
}