//Vars to Expose----------------------------------------
var Point = Isomer.Point;
var Path = Isomer.Path;
var Shape = Isomer.Shape;
var Color = Isomer.Color;
var Vector = Isomer.Vector;
//Init Consts-------------------------------------------
const CANVASWRAPPER = document.getElementById('worldWrapper');
const CLICKFIELD = document.getElementById('clickField');
const BACKGROUND = document.getElementById('background');
const MIDDLEGROUND = document.getElementById('effects');
const FOREGROUND = document.getElementById('world');
const WORLDWIDTH = 1080;
const WORLDHEIGHT = 720;
const PLAYERWIDTH = 30;
const PLAYERHEIGHT = 30;
const DEFAULTSPEED = 0.01;
const BOUNDWIDTH = PLAYERWIDTH / 2;
const BOUNDHEIGHT = PLAYERHEIGHT / 2;
const VALIDWIDTH = WORLDWIDTH - BOUNDWIDTH;
const VALIDHEIGHT = WORLDHEIGHT - BOUNDHEIGHT;
//init Lets---------------------------------------------
let fps = 0;
let speed = DEFAULTSPEED;
let diagonalSpeed = DEFAULTSPEED / 2;
let rotate = 0;
let keysPressed = {};
//Init varsS--------------------------------------------
//----canvas'-----------------------------------------\/
var clickField = new Isomer(CLICKFIELD);
var clickFieldCTX = CLICKFIELD.getContext('2d', { alpha: false });
var clickFieldCanvasRect = CLICKFIELD.getBoundingClientRect();
//--------
var background = new Isomer(BACKGROUND);
var backgroundCTX = BACKGROUND.getContext('2d', { alpha: false });
//---------
var effects = new Isomer(MIDDLEGROUND);
var effectsCTX = MIDDLEGROUND.getContext('2d');
//---------
var iso = new Isomer(FOREGROUND);
var isoCTX = FOREGROUND.getContext('2d', { alpha: false });
//----canvas'-----------------------------------------/\
//var charX, charY, charZ, charLastX, charLastY, charLastZ, charCurrentX, charCurrentY, charCurrentZ, lastCall = 0;
var cells = {}; //holds a list of the x, y and color value of each cell to detect clicks
var lastFrameTimeMs = 0; //time since last frame run by browser/
var backgroundObjects = {}; //objects to be drawn on screen , draw index decided by position
var effectsObjects = {};
var foreGroundObjects = {};
var effectsObjects = {};
var lastCall = 0; //for throttle function
//----Character vars-----------------------------------\/
var wallColor = new Color(117, 20, 0);
var charColor = new Color(20, 20, 20);
var shadowColor = new Color(0, 0, 0, 0.05);
var jumping = false;
var crtlJumping = false;
var jumpCounter = 0;
var jumpIncreaseZ = Math.PI / 100;
var offset = -10;
var charX = 0;
var charY = 0;
var charZ = 0;
var charLastX = 0;
var charLastY = 0;
var charLastZ = 0;
var charCurrentX = 0;
var charCurrentY = 0;
var charCurrentZ = 0;
var lastClickX = 1080;
var lastClickY = 1440;
var badCoords = {}
//----Character vars-----------------------------------/\
//-----------------------------------------------------
//-------------------------------GAME AREA---------------------------------------------\/
//Init Game
function startGame() {
  //----add listeners----------------------------------------------
  window.addEventListener('keyup', handleKeyUp);
  window.addEventListener('keydown', throttle(handleKeyDown, 100));
  CANVASWRAPPER.addEventListener('click', handleWorldClick);
  CANVASWRAPPER.addEventListener('contextmenu', handleWorldRightClick);
  //---------------------------------------------------------------
  //------Add objects that will be put on screen-------------------
  backgroundObjects['background'] = function () {
    makeCell(40, 40, 1, new Color(150, 150, 150), background, true, offset);
    makeGrid(40, 40, 0, new Color(111, 111, 111, 1), background, offset);
    //makeCell(20.5, 20.5, 0.5, new Color(160, 160, 160), background, true, -5.5);
   // makeCell(19, 19, 0.5, new Color(160, 160, 160), background, true, -4.5);
    background.add(Shape.Prism(new Point (-0.5 + charX,-0.5 + charY, charZ -6.75),20,20,0.25),new Color(160, 160, 160));
    makeGrid(20, 20, 0, new Color(111, 111, 111, 1), background, -4);
    background.add(Shape.Prism(new Point (charX, charY, charZ -6.25),18,18,0.25),new Color(170, 170, 170));
    makeGrid(18.25, 18.25, 0, new Color(111, 111, 111, 1), background, -3.5);
    makeCell(4, 4, 1, new Color(40, 90, 150), background, true, -10);
    background.add(Shape.Prism(new Point(0, 0, charZ), 1, 1, 0), shadowColor, false);
  }
  backgroundObjects['walls'] = function () {
    background.add(Shape.Prism(new Point(40 + charX, charY + 1, charZ + offset - 10), 1, 40, 4), wallColor, true);
    background.add(Shape.Prism(new Point(charX + 1, 40 + charY, charZ + offset - 10), 39, 1, 4), wallColor, true);
  }
  //------Make a field of unique colors correspondinng to each x and y coordinate on screen and store result in object
  makeClickCells(32, 32, 0, clickField);
  //---Add objects to scene
  for (let [key, value] of Object.entries(backgroundObjects)) {
    value();
  }
  //----add the character to screen 
  //iso.add(Shape.Prism(new Point(0, 0, 0), 1, 1, 2), charColor, true);
  iso.add(Shape.Prism(new Point(0.5, 0.8, 0), 0.2, 0.2, 0.7), charColor, true);
  iso.add(Shape.Prism(new Point(0.5, 0, 0), 0.2, 0.2, 0.7), charColor, true);
  iso.add(Shape.Prism(new Point(0.5, 0, 0.7), 0.2, 1, 1), charColor);
  iso.add(Shape.Prism(new Point(0.5, 0.4, 1.7), 0.2, .2, 0.2), charColor);
  iso.add(Shape.Prism(new Point(0.5, 0.2, 1.9), 0.2, .6, 0.3), charColor);
  requestAnimationFrame(gameLoop);
  window.setInterval(clearEffects, 3000);
}
function gameLoop(timestamp) {
  /* FPS LiMITER for testing
  if (timestamp < lastFrameTimeMs + (1000 / FPS)) {
    requestAnimationFrame(gameLoop);
    return;
  }*/
  delta = timestamp - lastFrameTimeMs;
  lastFrameTimeMs = timestamp;
  update(delta);
  if (changeInForeGround()) {
    drawForeground();
  }
  if (changeInBackground()) {
    drawBackground();
  }
  fps = 1000 / delta;
  requestAnimationFrame(gameLoop);
}
function update(delta) {
  if (jumping) {
    jumpCounter += jumpIncreaseZ;
    if (charCurrentZ === charLastZ && charCurrentX === charLastX && charCurrentY === charLastY) {
      jumping = false;
    }
  } else if (crtlJumping) {
    //var distance = Math.sqrt(Math.pow(charCurrentX-charLastX) + Math.pow(charCurrentY-charLastY));
    jumpCounter += jumpIncreaseZ;//distance  + 0.5; //*distance
    if (charCurrentZ === charLastZ && charCurrentX === charLastX && charCurrentY === charLastY) {
      crtlJumping = false;
    }
  }

  if (charLastX !== charCurrentX) {
    if (charLastX < charCurrentX) {
      if ((charLastX + speed * delta) < charCurrentX ) {
        if(isValidXMove(charX + speed * delta)){
          charX += speed * delta;
        charLastX = charX;
        }
        
      } else {
        charX = charCurrentX;
        charLastX = charCurrentX;
        drawBackground();
      }
    }
    if (charLastX > charCurrentX) {
      if ((charLastX - speed * delta) > charCurrentX) {
        if(isValidXMove(charX - speed * delta)){
           charX -= speed * delta;
          charLastX = charX;
        }
       
      } else {
        charX = charCurrentX;
        charLastX = charCurrentX;
        drawBackground();
      }
    }

  }
  if (charLastY !== charCurrentY) {
    if (charLastY < charCurrentY) {
      if ((charLastY + speed * delta) < charCurrentY) {
       
        if(isValidYMove(charY + speed * delta)){
           charY += speed * delta;
        charLastY = charY;
        }
      } else {
        charY = charCurrentY;
        charLastY = charCurrentY;
        drawBackground();
      }
    }
    if (charLastY > charCurrentY) {
      if ((charLastY - speed * delta) > charCurrentY) {
        if(isValidYMove(charY - speed * delta)){
          charY -= speed * delta;
        charLastY = charY;
        }
        
      } else {
        charY = charCurrentY;
        charLastY = charCurrentY;
        drawBackground();
      }
    }
  }
  if (charLastZ !== charCurrentZ) {
    if (charLastZ < charCurrentZ) {
      if ((charLastZ + speed * delta) < charCurrentZ) {
        charZ += speed * delta;
        charLastZ = charZ;
      } else {
        charZ = charCurrentZ;
        charLastZ = charCurrentZ;
        drawBackground();
      }
    }
    if (charLastZ > charCurrentZ) {
      if ((charLastZ - speed * delta) > charCurrentZ) {
        charZ -= speed * delta;
        charLastZ = charZ;
      } else {
        charZ = charCurrentZ;
        charLastZ = charCurrentZ;
        drawBackground();
      }
    }
  }
}
function drawBackground() {
  background.canvas.clear();
  for (let [key, value] of Object.entries(backgroundObjects)) {
    value();
  }
}
function drawForeground() {
  iso.canvas.clear();
  for (let [key, value] of Object.entries(foreGroundObjects)) {
    value();
  }
}
function drawEffects() {
  for (let [key, value] of Object.entries(effectsObjects)) {
    value();
  }
}
function clearEffects() {
  effects.canvas.clear();
  effectsObjects = {};
}
//-------------------------------GAME AREA---------------------------------------------/\

//--Event Handlers ---------------------------------------------------------\/
function handleWorldRightClick(event) {
  let xx = event.clientX - clickFieldCanvasRect.left;
  let yy = event.clientY - clickFieldCanvasRect.top;
  let pixelData = clickFieldCTX.getImageData(xx * 2, yy * 2, 1, 1).data;
  var hex = sampleBackground(pixelData);
  event.preventDefault();
  var color = new Color(0, 0, 0);
  var coords = Object.entries(cells[hex]);
  var xCoord = coords[0][1];
  var yCoord = coords[1][1];
  effectsObjects['fastblade'] = function () {
    effects.add(new Path([
      new Point(charX, charY, charZ - 0.5),
      new Point(xCoord, yCoord, 0),
      0
    ]), color, false);
  }


  return false; //keeps context menu from popping up
}
function isValidXMove(x) {
  if ((x < 20 && x > 15) || ( y < 20 && y > 15) ){
    return false;
  }
  return true;
}
function isValidYMove(y){
  if(( y < 20 && y > 15) || (x < 20 && x > 15) ){
    return false;
  }
  return true;
}

function handleWorldClick(event) {
  let xx = event.clientX - clickFieldCanvasRect.left;
  let yy = event.clientY - clickFieldCanvasRect.top;
  lastClickX = xx * 2;
  lastClickY = yy * 2;
  let pixelData = clickFieldCTX.getImageData(xx * 2, yy * 2, 1, 1).data;
  let hex = sampleBackground(pixelData);
  if (keysPressed['control'] && crtlJumping === false) {
    if (hex.toString() in cells) {
      var coords = Object.entries(cells[hex]);
      var xCoord = coords[0][1];
      var yCoord = coords[1][1];
      //charCurrentX = (coords[0][1]) * -1;
      //charCurrentY = (coords[1][1]) * -1;
      if (xCoord !== 0) {
        if (Math.sign(xCoord) === -1) {
          charCurrentX += Math.abs(xCoord);
        } else {
          charCurrentX -= Math.abs(xCoord);
        }
      }
      if (yCoord !== 0) {
        if (Math.sign(yCoord) === -1) {
          charCurrentY += Math.abs(yCoord);
        } else {
          charCurrentY -= Math.abs(yCoord);
        }
      }
      handleCrtlJump();



      //var oldPoint = new Point(charLastX,charLastY,0);
      //var newPoint = new Point(charCurrentX,charCurrentY,0);
      //var distance  = new Point().distance(oldPoint,newPoint);
      //console.log(distance);
      //find distance between two points and make the Z increase a multiple of the distance
      //  instead  of from last x to current x, use last clickX to currentcllickX;
      //
      //
      //
      ///this right HERE

    }
  } else if (!jumping && !crtlJumping) {
    if (hex.toString() in cells) {
      var coords = Object.entries(cells[hex]);
      var xCoord = coords[0][1];
      var yCoord = coords[1][1];
      if (xCoord !== 0) {
        if (Math.sign(xCoord) === -1) {
          charCurrentX += Math.abs(xCoord);
        } else {
          charCurrentX -= Math.abs(xCoord);
        }
      }
      if (yCoord !== 0) {
        if (Math.sign(yCoord) === -1) {
          charCurrentY += Math.abs(yCoord);
        } else {
          charCurrentY -= Math.abs(yCoord);
        }
      }


    }
  }
  console.log(`you moved to x:${charCurrentX} y:${charCurrentY} z:${charCurrentZ} `);
}
function handleKeyDown(event) {
  //  console.log(`you pressed the "${event.key}" key`);
  // add key to the array of pressed keys
  event.preventDefault();
  keysPressed[event.key.toLowerCase()] = true;
  // console.log(keysPressed);
  if (event.key.match(/[wasdWASD]/)) {
    //console.log(`you pressed w a s or d!`);
    handleMovement(event);
  } else if (event.key.match(' ')) {
    handleJump();
  } else {
    handleOtherKeys(event);
  }
}
function handleKeyUp(event) {
  delete keysPressed[event.key.toLowerCase()];
  //handleMovement(event);
}
function handleOtherKeys(key) {
  console.log(`you didnt press an "action" key`);
}
function handleCrtlJump() {
  crtlJumping = true;
  charCurrentZ -= 3;
  window.setTimeout(unCrtlJump, 500);
}
function unCrtlJump() {
  charCurrentZ += 3;
  jumping = false;
}
function handleJump() {
  jumping = true;
  charCurrentZ--;
  window.setTimeout(unJump, 500);
}
function unJump() {
  console.log("unjumped");
  charCurrentZ++;
  //jumping = false;
}
//--Event Handlers ---------------------------------------------------------/\

//--Helper Functions ---------------------------------------------------------\/
function changeInForeGround() {

  return false;
}
function changeInBackground() {
  var oldPosition = new Point(charLastX, charLastY, charLastZ);
  var currentPosition = new Point(charCurrentX, charCurrentY, charCurrentZ);
  if (JSON.stringify(oldPosition) !== JSON.stringify(currentPosition)) {
    console.log('render a frame');
    return true;
  }
  return false;
}
function randomColor() {
  let color = new Color(
    parseInt(Math.random() * 256),
    parseInt(Math.random() * 256),
    parseInt(Math.random() * 256), 1);
  if (cells[color.toHex]) {
    console.log('color used');
    color = randomColor();
  }
  return color;
}
function verticalBars() {
  for (x = 0; x < 2160 + 1; x += 59) {
    ctx.moveTo(x, 0);
    ctx.lineTo(x, 1440);
    ctx.stroke();
  }
}
function HSVtoRGB(h, s, v) {
  var r, g, b, i, f, p, q, t;
  if (arguments.length === 1) {
    s = h.s, v = h.v, h = h.h;
  }
  i = Math.floor(h * 6);
  f = h * 6 - i;
  p = v * (1 - s);
  q = v * (1 - f * s);
  t = v * (1 - (1 - f) * s);
  switch (i % 6) {
    case 0: r = v, g = t, b = p; break;
    case 1: r = q, g = v, b = p; break;
    case 2: r = p, g = v, b = t; break;
    case 3: r = p, g = q, b = v; break;
    case 4: r = t, g = p, b = v; break;
    case 5: r = v, g = p, b = q; break;
  }
  return {
    r: Math.round(r * 255),
    g: Math.round(g * 255),
    b: Math.round(b * 255)
  };
}
function makeClickCells(xSize, ySize, zHeight, isoCanvas) {
  for (y = -20; y < ySize + 1; y++) {
    for (x = -20; x < xSize + 1; x++) {
      let color = randomColor();
      isoCanvas.add(Shape.Prism(new Point(x, y, zHeight), 1, 1, 0), color, false);
      //console.log(color.toHex());
      cells[color.toHex()] = { x: x, y: y };
    }
  }
  //console.log(JSON.stringify(cells));
}
function makeCell(xSize, ySize, zHeight, color, isoCanvas, shade, offset = 0) {

  isoCanvas.add(Shape.Prism(new Point(charX + offset, charY + offset, charZ + offset), xSize, ySize, zHeight), color, shade);
  /* for (y = 0; y < ySize + 1; y++) {
     for (x = 0; x < xSize + 1; x++) {
       
       isoCanvas.add(Shape.Prism(new Point(x + charX, y + charY, zHeight + charZ), 1, 1, 0), color, false);
       //console.log(color.toHex());
       cells[color.toHex()] = { x: x, y: y };
       counter++;
     }
   }//console.log(JSON.stringify(cells));*/
}
function makeGrid(xSize, ySize, zHeight, gridColor, isoCanvas, offset = 0) {
  for (x = 0; x < xSize + 1; x++) {
    isoCanvas.add(new Path([
      new Point(x + charX + offset, 0 + charY + offset, zHeight + charZ + 1 + offset),
      new Point(x + charX + offset, xSize + charY + offset, zHeight + charZ + 1 + offset),
      new Point(x + charX + offset, 0 + charY + offset, zHeight + charZ + 1 + offset)
    ]), gridColor, false);
  }
  for (y = 0; y < ySize + 1; y++) {
    isoCanvas.add(new Path([
      new Point(0 + charX + offset, y + charY + offset, zHeight + charZ + 1 + offset),
      new Point(ySize + charX + offset, y + charY + offset, zHeight + charZ + 1 + offset),
      new Point(0 + charX + offset, y + charY + offset, zHeight + charZ + 1 + offset)
    ]), gridColor, false);
  }
}
function discoBomb(xSize, ySize, zHeight, isoCanvas) {
  for (y = -8; y < ySize + 1; y++) {
    for (x = -8; x < xSize + 1; x++) {

      isoCanvas.add(Shape.Prism(new Point(x, y, zHeight), 1, 1, 0), randomColor, false);

    }
  }
}
function castRay(x, y) {
  effects.add(new Path([
    new Point(x, 0, zHeight),
    new Point(x, xSize, zHeight),
    new Point(x, 0, zHeight)
  ]), rayColor, false);
}
function rgbToHex(r, g, b) {
  if (r > 255 || g > 255 || b > 255)
    throw "Invalid color component";
  return ((r << 16) | (g << 8) | b).toString(16);
}
function throttle(func, interval) {
  return function () {
    var now = Date.now();
    if (lastCall + interval < now) {
      lastCall = now;
      return func.apply(this, arguments);
    }
  };
}
function sampleBackground(imgData) {
  return hex = "#" + ("000000" + rgbToHex(imgData[0], imgData[1], imgData[2])).slice(-6);

}
//--Helper Functions ---------------------------------------------------------/\


function handleMovement(key) {
  var singleKey = (Object.keys(keysPressed).length === 1) ? true : false;
  switch (true) {
    case (keysPressed['a'] && keysPressed['d']):
      break;
    case (keysPressed['d'] && keysPressed['s']):
      charCurrentY++;
      charCurrentX++;
      break;
    case (keysPressed['a'] && keysPressed['s']):
      charCurrentX++;
      charCurrentY--;
      break;
    case (keysPressed['w'] && keysPressed['a']):
      charCurrentX--;
      charCurrentY--;
      break;
    case (keysPressed['w'] && keysPressed['d']):
      charCurrentX--;
      charCurrentY++;
      break;
    //------------------SINGLE KEYS-------------------------
    case (keysPressed['w'] && singleKey):
      charCurrentX--;
      break;
    case (keysPressed['a'] && singleKey):
      charCurrentY--;
      break;
    case (keysPressed['s'] && singleKey):

      charCurrentX++;
      break;
    case (keysPressed['d'] && singleKey):
      charCurrentY++;

      break;
    default:
      break;
  }
  charColor = randomColor();
  console.log(`you moved to x:${charCurrentX} y:${charCurrentY} z:${charCurrentZ} `);
}
function component(width, height, depth, x, y, z, color, type) {
  this.type = type;
  if (type == "image") {
    this.image = new Image();
    this.image.src = color;
  }
  this.width = width;
  this.height = height;
  this.color = color;
  this.speed = 0;
  this.angle = 0;
  this.moveAngle = 0;
  this.lastX = STARTX;
  this.lastY = STARTY;
  this.spriteX = x;
  this.spriteY = x;
  this.spriteZ = z;
  this.x = x;
  this.y = y;
  this.z = z;
  this.update = function () {
    if (type == "image") {
      ctx.drawImage(this.image,
        this.x,
        this.y,
        this.width, this.height);
    } else {

    }
  }
  this.move = function () {
    this.x += this.speed;
    this.y -= this.speed;
  }
  this.attack = function () {

  }  
  this.clearTarget = function () {
    this.targetX = null;
    this.targety = null;
  }
}