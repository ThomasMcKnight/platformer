const GAMEHEIGHT = 600;
const GAMEWIDTH = 800;

let canvas = document.getElementById("gameScreen");
let ctx = canvas.getContext("2d");

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

class Player
{
    constructor()
    {
        this.height = 30;
        this.width = 30;
        this.velocity = 50;
        this.limit = GAMEWIDTH - this.width;
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

let platform = new Platform();
let player = new Player();
let fpsDisplay = document.getElementById("fpsDisplay");


function draw()
{
    player.draw(ctx);
    platform.draw(ctx);
    fpsDisplay.textContent = fps + ' FPS';
}

function update(timePassed)
{
    player.position.x += player.velocity * timePassed;

    if(player.position.x <= 0 || player.position.x >= 720 - player.width)
    {
        player.velocity = -player.velocity;
    }

}

let lastFrameTime = 0;
let fps = 0;

function gameLoop(timeStamp) 
{
    ctx.clearRect(0, 0, GAMEWIDTH, GAMEHEIGHT);

    let timePassed = (timeStamp - lastFrameTime) / 1000;
    lastFrameTime = timeStamp;

    fps = Math.round(1 / timePassed);

    update(timePassed);
    draw();
    requestAnimationFrame(gameLoop);
}
requestAnimationFrame(gameLoop);