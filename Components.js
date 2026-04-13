class MovingComponent {
    constructor(width, height, depth, x, y, z, color, type, canvasId, shapes) {
        this.type = type;
        if (type == "image") {
            this.image = new Image();
            this.image.src = color;
        }
        this.shapes = shapes;
        this.width = width;
        this.height = height;
        this.color = color;
        this.speed = 0;
        this.angle = 0;
        this.lastX = 0;
        this.lastY = 0;
        this.lastZ = 0;
        this.spriteX = x;
        this.spriteY = x;
        this.spriteZ = z;
        this.x = x;
        this.y = y;
        this.z = z;
    }

    moved() {
        if (this.lastX !== this.x) {
            return true;
        }
        if (this.lastY !== this.y) {
            return true;
        }
        if (this.lastZ !== this.z) {
            return true;
        }
        return false;
    }

    update(delta) {
        if (this.moved()) {
            var vector = this.speed * delta;
            //x-----------
            if ((this.lastX + vector) < this.x) {
                if (isValidMove(this.spriteX + vector)) {
                    this.spriteX += vector;
                    this.lastX = this.spriteX;
                }
            } else {
                this.spriteX = this.x;
                this.lastX = this.x;

            }
            if ((this.lastX - vector) > this.x) {
                if (isValidMove(this.spriteX - vector)) {
                    this.spriteX -= vector;
                    this.lastX = this.spriteX;
                }
            } else {
                this.spriteX = this.x;
                this.lastX = this.x;
            }
            //y-----------
            if ((this.lastY + vector) < this.y) {

                if (isValidMove(this.spriteY + vector)) {
                    this.spriteY += vector;
                    this.lastY = this.spriteY;
                }
            } else {
                this.spriteY = this.y;
                this.lastY = this.y;
            }
            if ((this.lastY - vector) > this.y) {
                if (isValidMove(this.spriteY - vector)) {
                    this.spriteY -= vector;
                    this.lastY = this.spriteY;
                }

            } else {
                this.spriteY = this.y;
                this.lastY = this.y;
            }
            //z-----------
            if ((this.lastZ + vector) < this.z) {
                this.spriteZ += vector;
                this.lastZ = charZ;
            } else {
                charZ = this.z;
                this.lastZ = this.z;
            }
            if ((this.lastZ - vector) > this.z) {
                charZ -= vector;
                this.lastZ = charZ;
            } else {
                charZ = this.z;
                this.lastZ = this.z;
            }
        }
    }//end update

    isValidMove() {
        return true;
    }

    clear() {
        return;
    }
}
//---------------------------------------------------------------------------------------/\
//-----------------------------------------------------------------------------------------
//---------Charcter class----------------------------------------------------------------\/
class CharacterComponent extends MovingComponent {
    constructor(width, height, depth, x, y, z, color, type, canvasId, shapes) {
        super(width, height, depth, x, y, z, color, type, canvasId, shapes);
        this.type = type;
        if (type == "image") {
            this.image = new Image();
            this.image.src = color;
        }
        this.shapes = shapes;
        this.width = width;
        this.height = height;
        this.color = color;
        this.speed = 0;
        this.angle = 0;
        this.lastX = 0;
        this.lastY = 0;
        this.lastZ = 0;
        this.spriteX = x;
        this.spriteY = x;
        this.spriteZ = z;
        this.x = x;
        this.y = y;
        this.z = z;
        this.health = 100;
    }
    update(delta) {
        return;
    }
    move() {
        return;
    }
    clear() {
        return;
    }
}
