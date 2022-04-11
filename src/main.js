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
var UI;

var texture = [];
var buttons = [];
var toggles = [];
var entities = [];
var inventoryCells = [];
var inventoryItems = [];
var items = [];
var infoBoxes = [];

var playing = false;
var mainMenu = true;
var settingsMenu = false;

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

// var save;
// const delimiter = ';';
// const writer = createWriter("");
function generate() {
  if (first) {
    worldGenerated = false;
    noiseSeed();
    first = false;
    world = createGraphics(worldSize.w * subTextureSize, worldSize.h * subTextureSize);
    entities.push(player);
  }

  if (worldGenerated == false) {
    // let previousId = 0;
    // let count = 0;
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
        // if (previousId != id)
        // {
        //   save.concat(id);
        //   previousId = id;
        //   if (count != 0)
        //   {
        //     save.concat(count);
        //     count = 0;
        //   }
        // } else {
        //   count++;
        // }
      }
    }
    worldGenerated = true;
    for (let j = 0; j < worldSize.h; j++) {
      for (let i = 0; i < worldSize.w; i++) {
        if (i + j * worldSize.w >= 0) {
          world.image(subTexture[tileIds[i + j * worldSize.w]], i * subTextureSize, (worldSize.h - j - 1) * subTextureSize);
        }
      }
    }
  }
}

function worldUpdate() {
  if (worldGenerated) {
    viewport.push();
    viewport.translate(0, - worldSize.h * subTextureSize);

    viewport.image(world, 0, 0);
    viewport.pop();

    entities.sort((a, b) => { return - a.pos.y + b.pos.y });

    entities.forEach(entity => {
      entity.update();
    });

    projectiles.forEach(projectile => {
      projectile.update();
    });

  } else {
    generate();
  }
}

function separateTextureAtlas(textureAtlas, subTextureSize, arrayName) {
  let textureAtlasSize = { x: textureAtlas.width / subTextureSize, y: textureAtlas.height / subTextureSize };
  let n = 0;
  for (let y = 0; y < textureAtlasSize.y; y++) {
    for (let x = 0; x < textureAtlasSize.x; x++) {
      arrayName[n] = createImage(subTextureSize, subTextureSize);
      arrayName[n].loadPixels();
      for (let j = y * subTextureSize; j < (1 + y) * subTextureSize; j++) {
        for (let i = x * subTextureSize; i < (1 + x) * subTextureSize; i++) {
          let c = textureAtlas.get(i, j);
          arrayName[n].set(i - x * subTextureSize, j - y * subTextureSize, c);
        }
      }
      arrayName[n].updatePixels();
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

  fog.resize(subTextureSize, 0);
  shadow.resize(subTextureSize, 0);
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
  debugWindow = createGraphics(210, 200);
  UI = createGraphics(viewport.width, viewport.height);

  // it looks amazing with the drawing context but too laggy
  // viewport.drawingContext.shadowOffsetX = 5;
  // viewport.drawingContext.shadowOffsetY = -5;
  // viewport.drawingContext.shadowBlur = 10;
  // viewport.drawingContext.shadowColor = 'black';

  pixelDensity(1);
  textWrap(WORD);

  separateTextureAtlas(texture[0], subTextureSize, subTexture);
  makeShadow(500, 200);

  // change cursor, crosshair looks pretty good imo
  cursor('crosshair');

  defineItems();
}

function defineItems() {
  infoBoxes = [
    new InfoBox('Empty', 'There is nothing'),
    new InfoBox('Gun', 'It\'s a gun'),
    new InfoBox('NPC', 'This is an NPC\n *Press r to remove all'),
    new InfoBox('Player', 'This is you')
  ]

  items = [
    new Entity(subTexture[5], 0, 0, 1, 1, 0, 'typeEmpty', infoBoxes[0]),
    new Entity(texture[1], 0, 0, 1, 1, 0, 'weapon', infoBoxes[1]),
    new Entity(subTexture[2], 0, 0, 1, 1, 0, 'entity', infoBoxes[2])
  ]

  // inventory cells
  for (let i = 0; i < 4; i++) {
    inventoryCells[i] = new InventoryCell({ x: 10 + 55 * i, y: viewport.height - 60 }, items[0], { w: 50, h: 50 }, i);
  }

  buttons = [
    new Button('Play', viewport.width / 2, viewport.height * 0.60, true, 11, undefined, undefined, 100, 35, 10, 10, 10, 10),
    new Button('Settings', viewport.width / 2, viewport.height * 0.60 + 40, true, 11, undefined, undefined, 100, 35, 10, 10, 10, 10),
    new Button('X', width - 40, 20, true, 12)
  ]

  toggles = [
    new Toggle('Fullscreen', fullsrn, 50, 100),
    new Toggle('Debug', debug, 50, 100 + 30),
    new Toggle('Entity shadow', entityShadow, 50, 100 + 60)
  ]

  cam = new Camera();
  player = new Entity(subTexture[2], 0, 0, 1, 1, 2, 'player', infoBoxes[3], 0);
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight, true);

  viewport.remove();
  viewport = createGraphics(windowWidth, windowHeight);

  UI.remove();
  UI = createGraphics(viewport.width, viewport.height);

  // update positions for buttons
  buttons[0].pos = { x: viewport.width / 2, y: viewport.height * 0.60 }; // play button
  buttons[1].pos = { x: viewport.width / 2, y: viewport.height * 0.60 + 40 }; // settings button
  buttons[2].pos = { x: viewport.width - 40, y: 20 }; // x button on settings menu

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
    debugWindow.clear();
    UI.clear();
    viewport.background(147, 189, 194);

    viewport.push();
    cam.update();
    worldUpdate();
    viewport.pop();

    if (worldGenerated) {
      viewport.image(fog, 0, 0, viewport.width, viewport.height);
      if (debug) {
        debugWindow.background(0, 0, 0, 100);

        debugWindow.textAlign(LEFT, TOP);
        debugWindow.fill(255);
        debugWindow.textSize(15);

        debugWindow.text('- debug -' + '\n' +
          'scale: ' + floor(cam.scl) + '\n' +
          'player position: ' + floor(player.pos.x) + ', ' + floor(player.pos.y) + '\n' +
          'mouse position: ' + floor(mousePos.x) + ', ' + floor(mousePos.y) + '\n' +
          'camera position: ' + floor(cam.pos.x) + ', ' + floor(cam.pos.y) + '\n' +
          'currently on: ' + tileNames[player.currentlyOnTile] + '\n' +
          'entity count: ' + entities.length + '\n' +
          'current item: ' + player.item.infoBox.name + '\n' +
          'selected inventory cell id: ' + player.selectedInventoryCellId + '\n' +
          'fps: ' + fps.toFixed(0), 10, 10);

        UI.image(debugWindow, 0, 0);
      }

      inventoryCells.forEach(inventoryCell => {
        inventoryCell.update();
      });
      viewport.image(UI, 0, 0);
    }
  }
  image(viewport, viewportX, viewportY);
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

  if (playing && mousePos != undefined && worldGenerated) {
    hoverCellClick = false;
    inventoryCells.forEach(cell => {
      if (cell.hover()) {
        hoverCellClick = true;
        player.item = cell.item;
        player.selectedInventoryCellId = cell.id;
      }
    });
  }
}

function mouseReleased() {
  mouseDown = false;
}

class Camera {
  constructor() {
    this.pos = { x: 0 * subTextureSize, y: 0 * subTextureSize };
    this.scl = 1;
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
    viewport.translate(- this.pos.x * subTextureSize, this.pos.y * subTextureSize);
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
  constructor(texture, x, y, width, height, speed, type, infoBox, id) {
    this.pos = { x: x, y: y };
    this.size = { w: width, h: height };
    this.speed = speed;
    this.type = type;
    this.texture = texture;
    this.id = id;
    this.infoBox = infoBox;

    this.shadowSize = { w: 3 / 4, h: 1 / 4 };
    this.selectedInventoryCellId = -1;
    this.item = items[0];
    this.currentlyOnTile;
    this.angle = 0;

    if (this.type == 'entity') {
      this.health = 5;
    }
    if (this.type == 'player') {
      this.health = Infinity;
    }

    if (this.pos.x == undefined) {
      this.pos.x = 0;
    }
    if (this.pos.y == undefined) {
      this.pos.y = 0;
    }
    if (this.texture == undefined) {
      this.texture = subTexture[2];
    }
    if (this.size.w <= 0 || this.size.w == undefined) {
      this.size.w = 1;
    }
    if (this.size.h <= 0 || this.size.h == undefined) {
      this.size.h = 1;
    }
    if (this.speed < 0 || this.speed == undefined) {
      this.speed = abs(this.speed);
    }
    if (typeof this.type == undefined) {
      this.type = 'entity';
    }
    if (typeof this.pos.x == undefined) {
      this.pos.x = cam.pos.x;
    }
    if (typeof this.pos.y == undefined) {
      this.pos.y = cam.pos.y;
    }

    if (this.type == 'weapon' && this.infoBox.name == 'Gun') {
      this.ammoCount = Infinity;

      this.bullet =
      {
        texture: subTexture[2],
        damage: 5,
        speed: 2,
        range: 6
      };
    }
  }

  update() {
    let speed;

    // checks what the entity is standing on
    if (tileIds[floor(this.pos.x) + floor(this.pos.y) * worldSize.w] != undefined) {
      this.currentlyOnTile = tileIds[floor(this.pos.x) + floor(this.pos.y) * worldSize.w];
    } else {
      this.currentlyOnTile = 5;
    }

    // only show entity if it is within a certain distance
    // if (dist2D(cam.pos, this.pos) <= updateRadius) {
      this.show();
    // }

    // interactions with environment
    if (this.currentlyOnTile == 3) { // 3 is water
      speed = this.speed * (1 / fps) * 0.8; // because of delta time this.speed needs to be in the update function
      this.inWater = true;
    } else {
      speed = this.speed * (1 / fps);
      this.inWater = false;
    }

    // interactions with items
    if (this.item == items[2] && hoverCellClick == false && this.inWater == false && mouseDown) {
      entities.push(new Entity(subTexture[2], mousePos.x, mousePos.y, 1, 1, 0, 'entity', infoBoxes[2]));
      mouseDown = false;
    }

    if (this.item == items[1] && hoverCellClick == false && this.inWater == false && mouseDown) {
      projectiles.push(new Particle(this.pos.x, -this.pos.y, this.item.bullet.texture, this.item.bullet.speed, -this.angle, this.item.bullet.range, this));
    }

    if (this.type == 'player') {
      this.angle = atan2(mousePos.y - this.pos.y - this.size.h / 2, mousePos.x - this.pos.x);

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

      // inventory cells selection
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

    // limits movement within world
    // if (this.pos.x < this.size.w / 2) {
    //   this.pos.x = this.size.w / 2;
    // }
    // if (this.pos.y < this.size.h / 2) {
    //   this.pos.y = this.size.h / 2;
    // }
    // if (this.pos.x > this.size.w * worldSize.w - this.size.w / 2) {
    //   this.pos.x = this.size.w * worldSize.w - this.size.w / 2;
    // }
    // if (this.pos.y > this.size.h * worldSize.h - this.size.h / 2) {
    //   this.pos.y = this.size.h * worldSize.h - this.size.h / 2;
    // }
  }

  show() {
    viewport.push();
    viewport.translate(this.pos.x * subTextureSize - this.texture.width * this.size.w / 2, -this.pos.y * subTextureSize - this.texture.height * this.size.h);
    viewport.scale(this.size.w, this.size.h);

    if (entityShadow) {
      viewport.push();
      viewport.translate(this.texture.width / 2 - this.shadowSize.w * subTextureSize / 2, this.texture.height - this.shadowSize.h * subTextureSize / 2);
      viewport.scale(this.shadowSize.w, this.shadowSize.h);
      viewport.image(shadow, 0, 0);
      viewport.pop();
    }

    viewport.push();
    if (this.inWater) {
      this.texture.height = 0.5 * subTextureSize;
    } else {
      this.texture.height = subTextureSize;
    }
    if (this.angle > 90 * PI / 180 || this.angle < -90 * PI / 180) {
      viewport.translate(this.texture.width, 0);
      viewport.scale(-1, 1);
    }
    viewport.image(this.texture, 0, 0);
    viewport.pop();

    if (this.item != items[0]) {
      viewport.push();
      viewport.translate(this.texture.width / 2, this.texture.height / 2)
      viewport.rotate(-this.angle);
      viewport.translate(this.texture.width / 4, - this.item.texture.height / 2);
      if (this.angle > 90 * PI / 180 || this.angle < -90 * PI / 180) {
        viewport.translate(0, this.item.texture.height);
        viewport.scale(1, -1);
      }
      if (!this.inWater) {
        viewport.image(this.item.texture, 0, 0);
      }
      viewport.pop();
    }

    if (this.hover()) {
      UI.push();
      UI.translate(mouseX, mouseY - this.infoBox.infoBox.height);
      UI.image(this.infoBox.infoBox, 0, 0);
      UI.pop();
    }

    viewport.pop();
  }

  hover() {
    if (mousePos.x >= this.pos.x - viewportX - this.size.w / 2 && mousePos.y >= (this.pos.y) - viewportY && mousePos.x <= (this.pos.x) - viewportX + (this.size.w / 2) && mousePos.y <= (this.pos.y) - viewportY + (this.size.h)) {
      return true;
    }
    return false;
  }
}

function dist2D(a, b) {
  return ((a.x - b.x) ** 2 + (a.y - b.y) ** 2) ** 0.5;
}

function reset() {
  worldGenerated = false;

  player.pos = { x: 0, y: 0 };

  tileIds = [];
  entities = [];
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
    UI.push();
    if (this.hover()) {
      UI.image(this.item.infoBox.infoBox, this.pos.x, this.pos.y - this.item.infoBox.infoBox.height - 5);
      UI.fill(0, 100);
    } else {
      UI.fill(0, 200);
    }
    UI.rect(this.pos.x, this.pos.y, this.cellSize.w, this.cellSize.h);

    if (player.item == this.item && player.selectedInventoryCellId == this.id) {
      UI.noFill();
      UI.strokeWeight(5);
      UI.stroke('red');
      UI.rect(this.pos.x, this.pos.y, this.cellSize.w, this.cellSize.h);
    }

    if (this.item != items[0]) {
      UI.image(this.item.texture, this.pos.x, this.pos.y);
    }

    UI.pop();
  }

  hover() {
    if (mouseX <= this.pos.x + this.cellSize.w + viewportX && mouseX >= this.pos.x + viewportX && mouseY <= this.pos.y + viewportY + this.cellSize.h && mouseY >= this.pos.y + viewportY) {
      return true;
    }
    return false;
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
    let emitterSize = { w: this.emitter.texture.width * this.emitter.size.w, h: this.emitter.texture.height * this.emitter.size.h }

    viewport.push();
    viewport.translate(this.pos.x * subTextureSize, (this.pos.y) * subTextureSize - emitterSize.h / 2);
    viewport.rotate(this.angle);
    viewport.translate(emitterSize.w * 2 - this.texture.width / 2, - this.texture.height / 2)

    this.pos.x += speed * cos(this.angle);
    this.pos.y += speed * sin(this.angle);

    if (dist2D(this.pos, this.startPos) <= this.range) {
      viewport.image(this.texture, 0, 0);
    } else {
      entities.push(new Entity(this.texture, this.pos.x, -this.pos.y, 1, 1, 0, 'entity', infoBoxes[2]));
      projectiles.splice(this, 1);
    }
    viewport.pop();
  }
}

class InfoBox {
  constructor(name, description) {
    this.name = name;
    this.description = description;
    this.infoBox = createGraphics(120, 50);
    this.infoBox.fill(0, 100);
    this.infoBox.stroke(0);
    this.infoBox.rect(0, 0, this.infoBox.width, this.infoBox.height);
    this.infoBox.fill(255);
    this.infoBox.textSize(11);
    this.infoBox.text(this.name + ' -\n' + this.description, 5, 5, this.infoBox.width, this.infoBox.height);
  }
}