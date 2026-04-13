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
var lastFrameTimeMs = 0; //time since last frame run by browser
var objectsOnScreen = []; //objects to be drawn on screen , draw index decided by position
var lastCall = 0; //for throttle function
//----Character vars-----------------------------------\/
var charColor = new Color(20, 20, 20);
var shadowColor = new Color(0, 0, 0, 0.05);
var jumping = false;
var crtlJumping = false;
var jumpCounter = 0;
var jumpIncreaseZ = Math.PI / 100;
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
//----Character vars-----------------------------------/\
//-----------------------------------------------------
//-------------------------------GAME AREA---------------------------------------------\/
//Init Game
function startGame() {
    window.addEventListener('keyup', handleKeyUp);
    window.addEventListener('keydown', throttle(handleKeyDown, 100));
    CANVASWRAPPER.addEventListener('click', handleWorldClick);
    CANVASWRAPPER.addEventListener('contextmenu', handleWorldRightClick);
    objectsOnScreen.push(makeClickCells(32, 32, 0, clickField));


    makeGrid(21, 21, 0, new Color(111, 111, 111, 1), background);
    requestAnimationFrame(gameLoop);
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
function update(delta) {


    if (charLastX !== charCurrentX) {
        if (charLastX < charCurrentX) {
            if ((charLastX + speed * delta) < charCurrentX) {
                charX += speed * delta;
                charLastX = charX;
            } else {
                charX = charCurrentX;
                charLastX = charCurrentX;
                drawBackground();
            }
        }
        if (charLastX > charCurrentX) {
            if ((charLastX - speed * delta) > charCurrentX) {
                charX -= speed * delta;
                charLastX = charX;
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
                charY += speed * delta;
                charLastY = charY;
            } else {
                charY = charCurrentY;
                charLastY = charCurrentY;
                drawBackground();
            }
        }
        if (charLastY > charCurrentY) {
            if ((charLastY - speed * delta) > charCurrentY) {
                charY -= speed * delta;
                charLastY = charY;
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
    makeGrid(40, 40, 0, new Color(111, 111, 111, 1), background);
    background.add(Shape.Prism(new Point(0, 0, charZ), 1, 1, 0), shadowColor, false);

}
function drawForeground() {

    //shadow



}
function clearEffects() {
    effects.canvas.clear();
}
//-------------------------------GAME AREA---------------------------------------------/\

//--Event Handlers ---------------------------------------------------------\/
function handleWorldRightClick(event) {
    let xx = event.clientX - clickFieldCanvasRect.left;
    let yy = event.clientY - clickFieldCanvasRect.top;
    let pixelData = clickFieldCTX.getImageData(xx * 2, yy * 2, 1, 1).data;
    var hex = sampleBackground(pixelData);
    event.preventDefault();
    effects.add(Path());

    effectsCTX.beginPath();
    //------------------1080,1440
    effectsCTX.moveTo(1080, 700);
    effectsCTX.lineTo(xx * 2, yy * 2);
    effectsCTX.lineWidth = 10;
    effectsCTX.stroke();

    return false; //keeps context menu from popping up
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

//--Event Handlers ---------------------------------------------------------/\

//--Helper Functions ---------------------------------------------------------\/
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
    for (y = -10; y < ySize + 1; y++) {
        for (x = -10; x < xSize + 1; x++) {
            let color = randomColor();
            isoCanvas.add(Shape.Prism(new Point(x, y, zHeight), 1, 1, 0), color, false);
            //console.log(color.toHex());
            cells[color.toHex()] = { x: x, y: y };
        }
    }
    //console.log(JSON.stringify(cells));
}
function makeCell(xSize, ySize, zHeight, color, isoCanvas) {
    let counter = 0;
    isoCanvas.add(Shape.Prism(new Point(charX, charY, charZ), xSize, ySize, zHeight), color, false);
    /* for (y = 0; y < ySize + 1; y++) {
       for (x = 0; x < xSize + 1; x++) {
         
         isoCanvas.add(Shape.Prism(new Point(x + charX, y + charY, zHeight + charZ), 1, 1, 0), color, false);
         //console.log(color.toHex());
         cells[color.toHex()] = { x: x, y: y };
         counter++;
       }
     }//console.log(JSON.stringify(cells));*/
}
function makeGrid(xSize, ySize, zHeight, gridColor, isoCanvas) {
    for (x = 0; x < xSize + 2; x++) {
        isoCanvas.add(new Path([
            new Point(x + charX, 0 + charY, zHeight + charZ),
            new Point(x + charX, xSize + 1 + charY, zHeight + charZ),
            new Point(x + charX, 0 + charY, zHeight + charZ)
        ]), gridColor, false);
    }
    for (y = 0; y < ySize + 2; y++) {
        isoCanvas.add(new Path([
            new Point(0 + charX, y + charY, zHeight + charZ),
            new Point(ySize + 1 + charX, y + charY, zHeight + charZ),
            new Point(0 + charX, y + charY, zHeight + charZ)
        ]), gridColor, false);
    }

    /* for (x = -8; x < xSize + 1; x++) {
      isoCanvas.add(new Path([
        new Point(x, 0, zHeight),
        new Point(x, xSize, zHeight),
        new Point(x, 0, zHeight)
      ]), gridColor, false);
    }
    for (y = -8; y < ySize + 1; y++) {
      isoCanvas.add(new Path([
        new Point(0, y, zHeight),
        new Point(ySize, y, zHeight),
        new Point(0, y, zHeight)
      ]), gridColor, false);
    }*/
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
    this.x = x;
    this.y = y;
    this.targetX = null;
    this.targetY = null;
    this.destinationX = null;
    this.destinationY = null;
    this.update = function () {
        if (type == "image") {
            ctx.drawImage(this.image,
                this.x,
                this.y,
                this.width, this.height);
        } else {
            ctx = world.context;
            ctx.clearRect(this.width / -2, this.height / -2, this.width, this.height);
            ctx.save();
            ctx.translate(this.x, this.y);
            ctx.rotate(this.angle);
            ctx.fillStyle = color;
            ctx.fillRect(this.width / -2, this.height / -2, this.width, this.height);
            ctx.restore();
        }
    }
    this.move = function () {
        this.x += this.speed;
        this.y -= this.speed;
    }
    this.attack = function () {
        ctx = world.context;
        ctx.save();
        ctx.beginPath();
        ctx.moveTo(this.x, this.y);
        ctx.lineTo(this.targetX, this.targetY);
        ctx.stroke();
        ctx.restore();
    }
    this.setTarget = function (xx, yy) {
        this.targetX = xx;
        this.targetY = yy;
        console.log(`target is at x:${x}  y:${y}`);
    }
    this.clearTarget = function () {
        this.targetX = null;
        this.targety = null;
    }
}