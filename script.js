const GAMEHEIGHT = 600;
const GAMEWIDTH = 800;

let canvas = document.getElementById("gameScreen");
let ctx = canvas.getContext("2d");
var inputHandler;

//Class for the platform objects
class Platform 
{
   constructor()
   {
       this.height = 10;
       this.width = 100;
       this.position = 
       {
           x: 500,
           y: 500
       };
   }
   draw(ctx)
   {
        ctx.fillRect(this.position.x, this.position.y, this.width, this.height);
   }
}

//Class for the player object
class Player
{
    constructor()
    {
        this.height = 30;
        this.width = 30;
        this.limit = GAMEWIDTH - this.width;
        this.jumping = false;
        this.velocity = 
        {
            x: 0,
            y: 0
        };
        this.position = 
        {
            x: 300,
            y: GAMEHEIGHT - this.height
        };
    }
    draw(ctx)
    {
        ctx.fillRect(this.position.x, this.position.y, this.width, this.height);
    }
}

//Object for the input handler/controller
inputHandler = 
{
    jump: false,
    left: false,
    right: false,
    keyListener: function(event)
    {
        var input = (event.type == "keydown")?true:false;

        switch(event.keyCode)
        {
            case 32: //SPACE
                inputHandler.jump = input;
                break;
            
            case 65: //A
                inputHandler.left = input;
                break;
            
            case 68: //D
                inputHandler.right = input;
                break;
        }
    }
};

let platform = new Platform();
let player = new Player();
let fpsDisplay = document.getElementById("fpsDisplay");
const GRAVITY = 27;

//Main draw function
function draw()
{
    player.draw(ctx);
    platform.draw(ctx);
    fpsDisplay.textContent = fps + ' FPS';
}

//Main update function
function update(deltaTime)
{
    console.log("Player position y: " + player.position.y);
    if(inputHandler.jump && player.jumping == false) //If inputting Jump
    {
        player.velocity.y -= 1000;
        player.jumping = true;
    }

    if(inputHandler.left) //If inputting Left
    {
        player.velocity.x -= 75;
    }

    if(inputHandler.right) //If inputting Right
    {
        player.velocity.x += 75; 
    }

    player.position.y += player.velocity.y * deltaTime; //Vertical velocity
    player.position.x += player.velocity.x * deltaTime; //Horizontal velocity
    player.velocity.x *= 0.9; //Friction
    player.velocity.y += GRAVITY; //Gravity

    if(player.position.x <= 0) //If player is offscreen to left
    {
        player.position.x = 0;
    }

    if(player.position.x >= GAMEWIDTH - player.width) //If player is offscreen to right
    {
        player.position.x = GAMEWIDTH - player.width;
    }

    if(player.position.y >= GAMEHEIGHT - player.height) //If player is on ground
    {
        player.position.y = GAMEHEIGHT - player.height;
        player.velocity.y = 0;
        player.jumping = false;
    }
}

let lastFrameTime = 0;
let fps = 0;

function gameLoop(timeStamp) 
{
    ctx.clearRect(0, 0, GAMEWIDTH, GAMEHEIGHT); //Clear screen

    let deltaTime = (timeStamp - lastFrameTime) / 1000;
    lastFrameTime = timeStamp;

    fps = Math.round(1 / deltaTime); //FPS counter

    update(deltaTime);
    draw();
    requestAnimationFrame(gameLoop);
}

window.addEventListener("keyup", inputHandler.keyListener)
window.addEventListener("keydown", inputHandler.keyListener);
requestAnimationFrame(gameLoop);