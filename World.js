//Vars to Expose----------------------------------------
var Point = Isomer.Point;
var Path = Isomer.Path;
var Shape = Isomer.Shape;
var Color = Isomer.Color;
var Vector = Isomer.Vector;
class World {
    constructor(width, height, x, y, z, map, player, ) {
        this.width = width;
        this.height = height;
        this.x = x;
        this.y = y;
        this.z = z;
        this.player = player;
        this.clickCells = {};
        this.createCanvas();
        this.isoWorld = new Isomer(this.worldCanvas);
        this.isoClickField = new Isomer(this.clickCanvas);

        this.createClickField(this.isoClickField);


    }
    createCanvas() {
        //create the game wrapper
        this.wrapper = document.createElement('div');
        this.wrapper.id = `wrapper`;
        document.body.appendChild(this.wrapper);
        //create the world canvas
        this.worldCanvas = document.createElement(`canvas`);
        this.worldCanvas.id = `world`;
        this.worldCanvas.width = this.width * 2;
        this.worldCanvas.height = this.height * 2;
        this.worldCanvas.setAttribute(`style`, `width:${this.width}px; height:${this.height}px; z-index:1;`);
        this.wrapper.appendChild(this.worldCanvas);
        //create the clickfield canvas
        this.clickCanvas = document.createElement(`canvas`);
        this.clickCanvas.id = `clickField`;
        this.clickCanvas.width = this.width * 2;
        this.clickCanvas.height = this.height * 2;
        this.clickCanvas.setAttribute(`style`, `width:${this.width}px; height:${this.height}px; z-index:0;`);
        this.wrapper.appendChild(this.clickCanvas);
        //clickField Context
        this.clickFieldCTX = this.clickCanvas.getContext('2d', { alpha: false });
    }
    createClickField(canvasId) {

        for (var y = -20; y < 32; y++) {
            for (var x = -20; x < 32; x++) {
                let color = this.randomColor();
                canvasId.add(Shape.Prism(new Point(x, y, 0), 1, 1, 0), color, false);
                //console.log(color.toHex());
                this.clickCells[color.toHex()] = { x: this.x, y: this.y };
            }
        }

    }
    randomColor() {
        let color = new Color(
            parseInt(Math.random() * 256),
            parseInt(Math.random() * 256),
            parseInt(Math.random() * 256), 1);
        if (this.clickCells[color.toHex()]) {
            console.log('color used');
            color = this.randomColor();
        }
        return color;
    }



    update() {
        if(this.playerMoved()){
            this.drawBackground();
        }

        return;
    }
    drawBackground() {
        for (let [key, value] of Object.entries(backgroundObjects)) { value(); }
    }
    drawEffects() {
        for (let [key, value] of Object.entries(effectsObjects)) { value(); }
    }
    drawForeground() {
        for (let [key, value] of Object.entries(foreGroundObjects)) { value(); }
    }

    move() {

        return;
    }

    loadView() {

        return;
    }

    playerMoved() {
        var oldPosition = new Point(this.player.lastX, this.player.lastY,this.player.lastZ);
        var currentPosition = new Point(this.player.x,this.player.y,this.player.z);

        if (JSON.stringify(oldPosition) !== JSON.stringify(currentPosition)) {
            console.log('render a frame');
            return true;
        }
        return false;
    }
}