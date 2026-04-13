class CharacterComponent extends Component{
    constructor(width, height, depth, x, y, z, color, type, canvasId, shapes) {
        super(width, height, depth, x, y, z, color, type, canvasId, shapes);
        this.type = type;
        if (type == "image") {
          this.image = new Image();
          this.image.src = color;
        }
        this.canvasId = canvasId;
        this.shapes = shapes;
        this.width = width;
        this.height = height;
        this.depth = depth;
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
      }
     update(){
         return;
     }
     move(){
         return;
     }
     clear(){
         return;
     }
}