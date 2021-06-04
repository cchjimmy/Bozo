var tileSize = 60;
const r = 30;
var player;
var tile;
var world
var cam
var buttons = [];
var playerFacingVec;
var centerVec;

var playing;
var mainMenu;
var settingsMenu;
var debug;

function setup() {
  frameRate(30);
  createCanvas(windowWidth, windowHeight);

  colorMode(RGB);
  textAlign(CENTER, CENTER);
  // angleMode(DEGREES);

  playing = false;
  mainMenu = true;
  settingsMenu = false;
  debug = false;
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}

function draw() {
  tile = new Tile(tileSize);
  centerVec = createVector(width / 2, height / 2 - tileSize);

  if (mainMenu == true) {
    push();
    // background
    fill(10);
    rect(0, 0, windowWidth, windowHeight);

    // title
    fill(255);
    textSize(32);
    text('The Adventures of ', width / 2, height / 4);

    // buttons
    buttons[0] = new Button('Play', width / 2, height * 0.60, 100, 35);
    buttons[1] = new Button('Settings', width / 2, height * 0.60 + 40, 100, 35);

    for (var i = 0; i <= 1; i++) {
      buttons[i].show();
    }
    pop();
  }

  if (settingsMenu == true) {

  }

  if (playing == true) {
    cam.update();

    world.update();

    player.update();
    player.show();

    // debug keycode f3 = 114
    if (keyIsDown(114)) {
      if (debug == true) {
        debug = false;
      } else {
        debug = true;
      }
    }

    if (debug == true) {
      push();
      fill(0);
      textSize(11);
      line(0, 0, centerVec.x, centerVec.y);
      translate(width / 2, height / 2);
      text('velocity: ' + player.vel.mag().toFixed(2), 0, 30);
      text('position: ' + player.pos.x.toFixed(2) + ', ' + player.pos.y.toFixed(2), 0, 40);
      text('facing/ rad: ' + playerFacingVec.heading().toFixed(2), 0, 50)
      line(0, 0, r * cos(playerFacingVec.heading()), r * sin(playerFacingVec.heading()));
      noFill();
      arc(0, 0, r, r, 0, playerFacingVec.heading());
      pop();
    }

    // keycode esc = 27
    if (keyIsDown(27)) {
      mainMenu = true;
      playing = false;
      debug = false;
      settingsMenu = false;
    }
  }
}

function mousePressed() {
  // check for any button clicks
  for (var i = 0; i < buttons.length; i++) {
    buttons[i].clicked();

    // start
    if (mainMenu == true) {
      if (buttons[0].clicked() == true) {
        console.log('play');
        world = new Map;
        player = new Player;
        cam = new Camera;
        playing = true;
        settingsMenu = false;
        mainMenu = false;
        debug = false;
      }

      // settings
      if (buttons[1].clicked() == true) {
        console.log('settings');
        playing = false;
        settingsMenu = true;
        mainMenu = false;
        debug = false;
      }
    }
  }
}

class Tile {
  constructor(size) {
    this.size = size;
  }
  spawn(x, y, color) {
    this.f = color
    // translated
    this.x = (x - cam.pos.x) * this.size + width / 2;
    this.y = (-y - cam.pos.y) * this.size + height / 2 - tileSize;

    push();
    if (debug == true) {
      stroke(0);
    } else {
      noStroke();
    }
    fill(this.f);
    square(Math.round(this.x), Math.round(this.y), this.size);
    pop();
  }
}

class Player {
  constructor() {
    this.pos = createVector(0, 0);
    // this.pos = p5.Vector.random2D().mult(random(10));
    this.vel = createVector(0, 0);
    this.speed = 1.4;
  }

  show() {
    push();
    rectMode(CENTER);
    noStroke();
    fill(200, 0, 0);
    translate(width / 2, height / 2);
    rotate(playerFacingVec.heading());
    square(0, 0, tileSize * 4 / 5);
    // triangle(-(tileSize / 3), tileSize / 2, -(tileSize / 3), - tileSize / 2, tileSize - (tileSize / 3), 0);
    pop();
  }

  update() {
    playerFacingVec = createVector(mouseX - width / 2, mouseY - height / 2);
    // movement
    // key code for w is 87, a is 65, s = 83, d is 68
    if (keyIsDown(87)) {
      // console.log('w');
      this.vel.y = -1 * this.speed;
      this.vel.x = 0;
    }

    if (keyIsDown(65)) {
      // console.log('a');
      this.vel.y = 0;
      this.vel.x = -1 * this.speed;
    }

    if (keyIsDown(83)) {
      // console.log('s');
      this.vel.y = 1 * this.speed;
      this.vel.x = 0;
    }

    if (keyIsDown(68)) {
      // console.log('d');
      this.vel.y = 0;
      this.vel.x = 1 * this.speed;
    }

    if (!keyIsDown(87) || !keyIsDown(65) || !keyIsDown(83) || !keyIsDown(68)) {
      // velocity decay
      this.vel.x = 0;
      this.vel.y = 0;
    }
    this.pos.add(this.vel);
  }
}

class Map {
  update() {
    // clear screen
    background(255, 100, 255);

    // draw
    for (let y = -5; y < 5; y++) {
      for (let x = -5; x < 5; x++) {
        tile.spawn(x, y, 100);
        // tile.spawn(x, y, map(noise(x / tileSize * 0.1 + player.pos.x, y / tileSize * 0.1 + player.pos.y), 0, 1, 0, 255));
      }
    }
  }
}

class Button {
  constructor(name, x, y, w, h) {
    this.n = name;
    this.x = x;
    this.y = y;
    this.w = w;
    this.h = h;
  }

  show() {
    push();
    rectMode(CENTER);
    fill(255);
    rect(this.x, this.y, this.w, this.h, 10, 10, 10, 10);
    fill(0);
    textSize(11);
    text(this.n, this.x, this.y, this.w, this.h);
    pop();
  }

  clicked() {
    if ((mouseX <= (this.x + (this.w / 2))) && (mouseX >= (this.x - (this.w / 2))) && (mouseY <= (this.y + (this.h / 2))) && (mouseY >= (this.y - (this.h / 2)))) {
      // console.log('clicked');
      return true;
    }
    return false;
  }
}

class Camera {
  constructor() {
  }

  update() {
    this.pos = player.pos.copy();
    
    // zoom
    // arrow up
    if (keyIsDown(38)) {
      tileSize += 10;
      if (tileSize >= 300) {
        tileSize = 300;
      }
    }
    // arrow down
    if (keyIsDown(40)) {
      tileSize -= 10;
      if (tileSize <= 10) {
        tileSize = 10;
      }
    }
  }
}