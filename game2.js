//-------------------------------------------------------Writen by Ryan A. Garst -----ryanagarst@gmail.com
//Vars to Expose----------------------------------------
var Point = Isomer.Point;
var Path = Isomer.Path;
var Shape = Isomer.Shape;
var Color = Isomer.Color;
var Vector = Isomer.Vector;
//Init Consts-------------------------------------------
const WORLDWIDTH = 1080;
const WORLDHEIGHT = 720;
const PLAYERWIDTH = 1;
const PLAYERHEIGHT = 2;
const PLAYERDEPTH = 1;
const DEFAULTCOLOR = new Color(20, 20, 20);
const DEFAULTX = 0;
const DEFAULTY = 0;
const DEFAULTZ = 0;
const DEFAULTSPEED = 0.01;
const BOUNDWIDTH = PLAYERWIDTH / 2;
const BOUNDHEIGHT = PLAYERHEIGHT / 2;
const VALIDWIDTH = WORLDWIDTH - BOUNDWIDTH;
const VALIDHEIGHT = WORLDHEIGHT - BOUNDHEIGHT;
//init Lets---------------------------------------------
var world;
var player;
let keysPressed = {};
let timestamp = 0;
var lastFrameTimeMs = 0; //time since last frame run by browser/

//---Start the game!
function startGame(){ 
  //create character
    player = new CharacterComponent(
      PLAYERWIDTH,PLAYERHEIGHT, 
      PLAYERDEPTH, DEFAULTX, 
      DEFAULTY, 
      DEFAULTZ,
      DEFAULTCOLOR,
      "trojan", 
      FOREGROUND, 
      characterShapes);
  //create world
    world = new World(1080,720,0,0,0, 0,player)
  //start the game loop
    requestAnimationFrame(gameLoop);
}
function gameLoop(timestamp) {
    /* FPS LiMITER for testing
    if (timestamp < lastFrameTimeMs + (1000 / FPS)) {
      requestAnimationFrame(gameLoop);
      return;
    }*/
    //
    delta = timestamp - lastFrameTimeMs; // change in time
    lastFrameTimeMs = timestamp;         //update lastFrameTimeMs
    world.update(delta);
    fps = 1000 / delta; // determing fps by dividing 1 second by the time since last frame
    requestAnimationFrame(gameLoop);
  }

