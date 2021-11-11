const subTextureSize = 16; // side length of each tile in pixels
const worldSize = { w: 100, h: 100 };
const viewportX = 0;
const viewportY = 0;
const updateRadius = 5;

var player;
var cam;
var fps;
var mousePos;

var viewport;
var world;
var shadow;
var debugWindow;

var texture = [];
var buttons = [];
var toggles = [];
var entities = [];
var rendered = [];
var inventoryCells = [];
var inventoryItems = [];
var items = [];

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

var worldGenerated = false;
var hoverCellClick = false;
var mouseDown = false;


function generate() {

  if (first) {
    worldGenerated = false;
    noiseSeed();
    first = false;
    world = createGraphics(worldSize.w * subTextureSize, worldSize.h * subTextureSize);
  }

  if (worldGenerated == false) {
    for (let j = 0; j < worldSize.h; j++) {
      for (let i = 0; i < worldSize.w; i++) {
        id = 3;
        if (noise(i / 100, j / 100) > 0.5) {
          id = 0;
          if (noise(i / 100, j / 100) > 0.6) {
            id = 4;
          }
        }
        tileIds.push(id);
        // console.log('i: ' + i + ', ' + 'j: ' + j + ', ' + 'tileIds length: ' + tileIds.length + ', ' + 'world generated ' + ((tileIds.length * 100) / (worldSize.w * worldSize.h)) + '%');
      }
    }
    worldGenerated = true;
  }
}

function worldUpdate() {
  viewport.translate(-cam.pos.x * subTextureSize, cam.pos.y * subTextureSize);

  if (worldGenerated) {

    if (first) {
      for (let j = 0; j < worldSize.h; j++) {
        for (let i = 0; i < worldSize.w; i++) {
          if (i + j * worldSize.w >= 0 && rendered[i + j * worldSize.w] != tileIds[i + j * worldSize.w]) {
            world.image(subTexture[tileIds[i + j * worldSize.w]], i * subTextureSize, (worldSize.h - j - 1) * subTextureSize);
            rendered[i + j * worldSize.w] = tileIds[i + j * worldSize.w];
          }
        }
      }
      first = false;
    }

    viewport.image(world, 0, -worldSize.h * subTextureSize);

    entities.sort((a, b) => { return - a.pos.y + b.pos.y });

    entities.forEach(entity => {
      entity.update();
    });


    projectiles.forEach(projectile => {
      projectile.update();
    });

  } else {
    generate();
    first = true;
  }
}

function separateTextureAtlas(textureAtlas, subTextureSize) {
  let textureAtlasSize = { x: textureAtlas.width / subTextureSize, y: textureAtlas.height / subTextureSize };
  let n = 0;
  for (let y = 0; y < textureAtlasSize.y; y++) {
    for (let x = 0; x < textureAtlasSize.x; x++) {
      subTexture[n] = createGraphics(subTextureSize, subTextureSize);
      subTexture[n].loadPixels();

      for (let j = y * subTextureSize; j < (1 + y) * subTextureSize; j++) {
        for (let i = x * subTextureSize; i < (1 + x) * subTextureSize; i++) {
          let c = textureAtlas.get(i, j);
          subTexture[n].set(i - x * subTextureSize, j - y * subTextureSize, c);
        }
      }

      subTexture[n].updatePixels();
      n++;
    }
  }
}

function makeShadow(size, brightness) {
  shadow = createImage(size, size);
  fog = createImage(size, size);

  let n = 0;
  brightness = map(brightness, 0, 255, 255, 0);
  shadow.loadPixels();
  fog.loadPixels();
  for (let j = -size / 2; j < size / 2; j++) {
    for (let i = -size / 2; i < size / 2; i++) {
      dist = dist2D({ x: i, y: j }, { x: 0, y: 0 });

      r = 0;
      g = 0;
      b = 0;
      a = 0;

      if (dist <= size / 2) {
        a = brightness * 1.7;
      }

      shadow.pixels[n] = r;
      shadow.pixels[n + 1] = g;
      shadow.pixels[n + 2] = b;
      shadow.pixels[n + 3] = a;

      // rgb 58, 74, 76 looks creepy with dist * 1
      r = 0; // 147
      g = 0; // 189
      b = 0; // 194
      a = dist * 0.5;

      if (dist <= size / 2) {
        // a = 0;
      }

      fog.pixels[n] = r;
      fog.pixels[n + 1] = g;
      fog.pixels[n + 2] = b;
      fog.pixels[n + 3] = a;

      n += 4;
    }
  }
  fog.updatePixels();
  shadow.updatePixels();
}

function preload() {
  texture = [
    loadImage('textures/texture4832.png'),
    loadImage('textures/gun.png', img => { img.width *= 0.01; img.height *= 0.01 })
  ]
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  viewport = createGraphics(windowWidth, windowHeight);
  debugWindow = createGraphics(210, 180);

  // it looks amazing with the drawing context but too laggy
  // viewport.drawingContext.shadowOffsetX = 5;
  // viewport.drawingContext.shadowOffsetY = -5;
  // viewport.drawingContext.shadowBlur = 10;
  // viewport.drawingContext.shadowColor = 'black';

  pixelDensity(1);
  textWrap(WORD);

  separateTextureAtlas(texture[0], subTextureSize);
  makeShadow(500, 200);

  // change cursor, crosshair looks pretty good imo
  cursor('crosshair');

  defineItems();
}

function defineItems() {
  // items
  items = [
    new Item(texture[5], 'Undefined', 'this is nothing', 'undefined'),
    new Item(texture[1], 'Gun', 'It\'s a gun', 'weapon'),
    new Item(subTexture[2], 'Person', 'This is a person\n *Press r to remove all', 'entity')
  ]

  // inventory cells
  for (let i = 0; i < 4; i++) {

    inventoryCells[i] = new InventoryCell({ x: 10 + 55 * i, y: viewport.height - 60 }, items[0], { w: 50, h: 50 }, i);

  }

  // buttons
  buttons = [
    new Button('Play', viewport.width / 2, viewport.height * 0.60, true, 11, undefined, undefined, 100, 35, 10, 10, 10, 10),
    new Button('Settings', viewport.width / 2, viewport.height * 0.60 + 40, true, 11, undefined, undefined, 100, 35, 10, 10, 10, 10),
    new Button('X', width - 40, 20, true, 12)
  ]

  // toggles
  toggles = [
    new Toggle('Fullscreen', fullsrn, 50, 100),
    new Toggle('Debug', debug, 50, 100 + 30),
    new Toggle('Entity shadow', entityShadow, 50, 100 + 60)
  ]

  // selection menu
  // buttons
  // buttons[2] = new Button('', width * 0.25, 110, 150, 40);
  // buttons[3] = new Button('', width * 0.25, 160, 150, 40);
  // buttons[4] = new Button('', width * 0.25, 210, 150, 40);
  // buttons[5] = new Button('', width * 0.25, 260, 150, 40);

}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight, true);

  viewport.remove();
  viewport = createGraphics(windowWidth, windowHeight);

  // update positions for buttons
  buttons[0].pos = { x: viewport.width / 2, y: viewport.height * 0.60 }; // play button
  buttons[1].pos = { x: viewport.width / 2, y: viewport.height * 0.60 + 40 }; // settings button
  buttons[2].pos = { x: viewport.width - 40, y: 20 }; // x button on settings menu

  // if (selection) {
  //   buttons[2] = new Button('', width * 0.25, 110, 150, 40);
  //   buttons[3] = new Button('', width * 0.25, 160, 150, 40);
  //   buttons[4] = new Button('', width * 0.25, 210, 150, 40);
  //   buttons[5] = new Button('', width * 0.25, 260, 150, 40);
  // }

  // reposition inventory cells

  for (let i = 0; i < 4; i++) {

    inventoryCells[i].pos = { x: 10 + 55 * i, y: viewport.height - 60 };

  }

}

function draw() {

  if (keyIsDown(27)) { // esc back to main menu
    mainMenu = true;
    playing = false;
    settingsMenu = false;
    selection = false;

    reset();
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
    buttons[2].show();
  }

  if (playing) {
    // background
    viewport.background(147, 189, 194);

    viewport.push();
    cam.update();
    worldUpdate();
    viewport.pop();

    if (worldGenerated) {
      viewport.image(fog, 0, 0, viewport.width, viewport.height);
      if (debug) {
        debugWindow.clear();

        debugWindow.background(0, 0, 0, 100);

        debugWindow.textAlign(LEFT, TOP);
        debugWindow.fill(255);
        debugWindow.textSize(15);

        debugWindow.text('debug' + '\n' +
          'scale: ' + floor(cam.scl) + '\n' +
          'player position: ' + floor(player.pos.x) + ', ' + floor(player.pos.y) + '\n' +
          'mouse position: ' + floor(mousePos.x) + ', ' + floor(mousePos.y) + '\n' +
          'camera position: ' + floor(cam.pos.x) + ', ' + floor(cam.pos.y) + '\n' +
          'currently on: ' + tileNames[player.currentlyOnTile] + '\n' +
          'entity count: ' + entities.length + '\n' +
          'current item: ' + player.item.name + '\n' +
          'selected inventory cell id: ' + player.selectedInventoryCellId, 10, 10);

        viewport.image(debugWindow, 0, 0);
      }

      inventoryCells.forEach(inventoryCell => {
        inventoryCell.update();
      });
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
  // image(shadow, 0, 0);
  // image(fog, 0, 0);
  // image(gun, 0, 0);
}

function mousePressed() {
  mouseDown = true;

  // buttons, toggles functionality definition
  if (mainMenu) {
    if (buttons[0].hover()) { // play
      playing = true;
      settingsMenu = false;
      mainMenu = false;
      selection = false;

      reset();

      cam = new Camera();
      player = new Entity(subTexture[2], 1, 1, 3, 3, 0.1, 'player');
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

    if (buttons[2].hover()) {
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

  if (playing && mousePos != undefined && worldGenerated) {
    hoverCellClick = false;

    inventoryCells.forEach(cell => {
      if (cell.hover()) {
        hoverCellClick = true;
        player.item = cell.item;
        player.selectedInventoryCellId = cell.id;
      }
    });
    // console.log(hoverCellClick);
  }

}

function mouseReleased() {
  mouseDown = false;
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
    mousePos = { x: (mouseX - viewport.width / 2 - viewportX) / (subTextureSize * this.scl) + this.pos.x, y: -(mouseY - viewport.height / 2 - viewportY) / (subTextureSize * this.scl) + this.pos.y };

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

    if (this.name == undefined) {
      this.name = '';
    }
    if (this.bool == undefined) {
      this.bool = false;
    }
    if (this.size.ts == undefined) {
      this.size.ts = 11;
    }
    if (this.col.tc == undefined) {
      this.col.tc = 0;
    }
    if (this.col.bc == undefined) {
      this.col.bc = 255;
    }
    if (this.size.w == undefined) {
      this.size.w = textWidth(this.name) + 10;
    }
    if (this.size.h == undefined) {
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
  constructor(texture, x, y, width, height, speed, type) {
    this.pos = { x: x, y: y };
    this.size = { w: width, h: height };
    this.speed = speed;
    this.type = type;
    this.texture = texture;

    // optional attributes
    this.shadowWOff = this.texture.width / 3
    this.shadowSize = { w: (this.texture.width - this.shadowWOff), h: this.texture.height / 4 };
    this.selectedInventoryCellId = -1;
    this.item = items[0];
    this.currentlyOnTile;
    this.angle = 0;
    this.health = 5;

    if (typeof this.texture == 'number' || typeof this.texture == 'string' || typeof this.texture == 'boolean' || typeof this.texture == undefined) {
      this.texture = subTexture[2];
    }
    if (this.size.w <= 0) {
      this.size.w = 1;
    }
    if (this.size.h <= 0) {
      this.size.h = 1;
    }
    if (this.speed < 0) {
      this.speed = abs(this.speed);
    }
    if (typeof this.type == undefined) {
      this.type = 'npc';
    }
    if (typeof this.pos.x == undefined) {
      this.pos.x = cam.pos.x;
    }
    if (typeof this.pos.y == undefined) {
      this.pos.y = cam.pos.y;
    }
    entities.push(this);
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

      if (keyIsDown(49)) { // 1
        this.item = inventoryCells[0].item;
        this.selectedInventoryCellId = 0;
      }
      if (keyIsDown(50)) { // 2
        this.item = inventoryCells[1].item;
        this.selectedInventoryCellId = 1;
      }
      if (keyIsDown(51)) { // 3
        this.item = inventoryCells[2].item;
        this.selectedInventoryCellId = 2;
      }
      if (keyIsDown(52)) { // 4
        this.item = inventoryCells[3].item;
        this.selectedInventoryCellId = 3;
      }
    }

    if (this.pos.x < this.size.w / 2) {
      this.pos.x = this.size.w / 2;
    }
    if (this.pos.y < this.size.h / 2) {
      this.pos.y = this.size.h / 2;
    }
    if (this.pos.x > this.size.w * worldSize.w - this.size.w / 2) {
      this.pos.x = this.size.w * worldSize.w - this.size.w / 2;
    }
    if (this.pos.y > this.size.h * worldSize.h - this.size.h / 2) {
      this.pos.y = this.size.h * worldSize.h - this.size.h / 2;
    }

    this.distFromCam = dist2D(cam.pos, this.pos);

    if (this.distFromCam <= updateRadius) {

      this.show();

    }

    // interactions with environment
    if (this.currentlyOnTile == 3) {
      this.inWater = true;
    } else {
      this.inWater = false;
    }

    // interactions with items
    if (this.item == items[2] && hoverCellClick == false && this.inWater == false && mouseDown) {
      new Entity(subTexture[2], mousePos.x, mousePos.y, 1, 1, 0, 'npc');
      mouseDown = false;
      // console.log('clicked');
    }

    if (this.item == items[1] && hoverCellClick == false && this.inWater == false && mouseDown) {
      // console.log('bam');
      // viewport.push();

      // viewport.translate(this.pos.x * subTextureSize, (-this.pos.y - this.size.h / 2 ) * subTextureSize);
      // viewport.rotate(-this.angle);
      // viewport.translate(this.item.texture.width, -this.item.bullet.texture.height / 2);

      // viewport.image(this.item.bullet.texture, 0, 0);

      projectiles.push(new Particle(this.pos.x, -this.pos.y, this.item.bullet.texture, this.item.bullet.speed, -this.angle, this.item.bullet.range, this));
      // console.log(projectiles);
      // viewport.pop();
    }
  }

  show() {
    viewport.push();
    viewport.translate(this.pos.x * subTextureSize, (-this.pos.y) * subTextureSize);

    this.currentlyOnTile = tileIds[floor(this.pos.x) + floor(this.pos.y) * worldSize.w];

    if (entityShadow) {
      if (this.type == 'player' || this.type == 'npc') {
        viewport.push();
        viewport.scale(this.size.w, this.size.h);
        viewport.image(shadow, (- this.texture.width + this.shadowWOff) / 2, - this.shadowSize.h / 2, this.shadowSize.w, this.shadowSize.h);
        viewport.pop();
      }
    }

    if (this.type == 'player') {
      this.angle = atan2(mousePos.y - this.pos.y - this.size.h / 2, mousePos.x - this.pos.x);
    }

    if (this.inWater) {
      this.texture.height = 0.5 * subTextureSize;
      viewport.push();
      viewport.scale(this.size.w, this.size.h);
      viewport.translate(0, this.texture.height);
      viewport.pop();
    } else {
      this.texture.height = subTextureSize;
    }

    viewport.push();
    if (this.angle > 90 * PI / 180 || this.angle < -90 * PI / 180) {
      viewport.scale(-1, 1);
    }
    viewport.scale(this.size.w, this.size.h);
    viewport.image(this.texture, -this.texture.width / 2, - this.texture.height);
    viewport.pop();

    if (this.item != items[0]) {

      viewport.scale(this.size.w, this.size.h);
      viewport.translate(0, -this.texture.height / 2)
      viewport.rotate(-this.angle);
      // viewport.fill('red');
      viewport.translate(this.texture.width / 4, - this.item.texture.height / 2);
      // viewport.rect(0, 0, this.item.width, this.item.height);
      if (this.angle > 90 * PI / 180 || this.angle < -90 * PI / 180) {
        viewport.translate(0, this.item.texture.height);
        viewport.scale(1, -1);
      }

      if (this.inWater == false) {
        
        viewport.image(this.item.texture, 0, 0);
      }
    }

    viewport.pop();

  }
}

function dist2D(a, b) {
  return ((a.x - b.x) ** 2 + (a.y - b.y) ** 2) ** 0.5;
}

// class Slider {
// constructor(name, x, y, start, end) {
// this.name = name;
// this.pos = { x: x, y: y };
// this.s = start;
// this.e = end;

// }
// }

function reset() {

  worldGenerated = false;

  player = undefined;
  cam = undefined;
  tileIds = [];
  entities = [];
  rendered = [];
  projectiles = [];
  inventoryItems = [items[1], items[2]];

  for (let i = 0; i < inventoryCells.length; i++) {

    if (inventoryItems[i] != undefined) {
      inventoryCells[i].item = inventoryItems[i];
    } else {
      inventoryCells[i].item = items[0];
    }

  }

  first = true;
}

class InventoryCell {
  constructor(pos, item, cellSize, id) {
    this.pos = { x: pos.x, y: pos.y };
    this.item = item;
    this.cellSize = { w: cellSize.w, h: cellSize.h };
    this.id = id;
  }

  update() {
    viewport.push();

    if (this.hover()) {

      if (this.item != items[0]) {
        viewport.image(this.item.infoBox, this.pos.x, this.pos.y - this.item.infoBox.height - 5);
      }

      viewport.fill(0, 0, 0, 100);
    } else {
      viewport.fill(0, 0, 0, 200);
    }

    viewport.rect(this.pos.x, this.pos.y, this.cellSize.w, this.cellSize.h);

    if (player.item == this.item && player.selectedInventoryCellId == this.id) {
      viewport.noFill();
      viewport.strokeWeight(5);
      viewport.stroke('red');
      viewport.rect(this.pos.x, this.pos.y, this.cellSize.w, this.cellSize.h);
    }

    if (this.item != items[0]) {
      viewport.image(this.item.texture, this.pos.x, this.pos.y);
    }

    viewport.pop();
  }

  hover() {
    if (mouseX <= this.pos.x + this.cellSize.w + viewportX && mouseX >= this.pos.x + viewportX && mouseY <= this.pos.y + viewportY + this.cellSize.h && mouseY >= this.pos.y + viewportY) {
      return true;
    }
    return false;
  }
}

class Item {
  constructor(texture, name, description, type) {
    this.texture = texture;
    this.name = name;
    this.description = description;
    this.type = type;
    if (this.type == 'weapon' && this.name == 'Gun') {
      this.ammoCount = Infinity;

      this.bullet =
      {
        texture: subTexture[1],
        damage: 5,
        speed: 0.1,
        range: updateRadius
      };
    }
    this.infoBox = createGraphics(120, 50);
    this.infoBox.fill(0, 100);
    this.infoBox.stroke(0);
    this.infoBox.rect(0, 0, this.infoBox.width, this.infoBox.height);
    this.infoBox.fill(255);
    this.infoBox.textSize(11);
    this.infoBox.text(this.name + ' -' + '\n' + this.description, 5, 5, this.infoBox.width, this.infoBox.height);
  }
}

function isMoving() {
  if (keyIsDown(87) ||
    keyIsDown(65) ||
    keyIsDown(83) ||
    keyIsDown(68)) {
    return true;
  }
  return false;
}

var projectiles = [];

class Particle {
  constructor(x, y, texture, speed, angle, range, emitter) {
    this.texture = texture;
    this.pos = { x: x, y: y };
    this.startPos = { x: x, y: y };
    this.speed = speed;
    this.angle = angle;
    this.range = range;
    this.emitter = emitter;
    projectiles.push(this);
  }

  update() {
    let speed = this.speed * subTextureSize * 1 / fps;
    let emitterSize = {w: this.emitter.texture.width * this.emitter.size.w,h: this.emitter.texture.height * this.emitter.size.h}

    viewport.push();

    viewport.translate(this.pos.x * subTextureSize, (this.pos.y) * subTextureSize - emitterSize.h / 2);
    viewport.rotate(this.angle);
    viewport.translate(emitterSize.w, 0);

    this.pos.x += speed * cos(this.angle);
    this.pos.y += speed * sin(this.angle);
    
    // viewport.translate(this.pos.x, this.pos.y);
    if (dist2D(this.pos, this.startPos) <= this.range) {
      viewport.image(this.texture, 0, 0);
    } else {
      projectiles.splice(this, 1);
    }
    viewport.pop();
  }
}