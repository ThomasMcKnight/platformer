const GAMEHEIGHT = 600;
const GAMEWIDTH = 800;

let canvas = document.getElementById("gameScreen");
let ctx = canvas.getContext("2d");
let GAMESTATE = 0;

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
        ctx.fillStyle = "black";
   }
}

//Class for the player object
class Player
{
    constructor()
    {
        this.height = 30;
        this.width = 30;
        this.isJumping = false;
        this.isFalling = false;
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
        ctx.fillStyle = "red";
    }
}

//Class for projectiles
class Projectile
{
    constructor(position)
    {
        this.height = 20
        this.width = 20;
        this.xPosition = position;
        this.yPosition = 0;
        this.velocity = 
        {
            x: 0,
            y: 300
        };

    }
    draw(ctx)
    {

        ctx.beginPath();
        ctx.arc(this.xPosition, this.yPosition, 10, 0, 2 * Math.PI);
        ctx.stroke();
        ctx.fillStyle = "black";
    }
}

var inputHandler;

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
            
            case 82: //R
                inputHandler.reset = input;
        }
    }
};

let platforms = [];
let numberOfPlatforms = 5;
let player = new Player();

for (let i = 0; i < numberOfPlatforms; i++)
{
    platforms[i] = new Platform();
}

platforms[1].position.x = 200;
platforms[2].position.x = 250;
platforms[2].position.y = 350;
platforms[3].position.x = 450;
platforms[3].position.y = 380;

let projectiles = [];
let numberOfProjectiles = 0;

function spawnProjectile(position) //Function that spawns projectile at the top of screen
{
    let projectile = new Projectile(position);
    numberOfProjectiles = projectiles.push(projectile);
}

//Function that controls movement based on input
function controller()
{
    if(inputHandler.jump && player.isJumping == false) //If inputting Jump
    {
        player.velocity.y -= 1000;
        player.isJumping = true;
    }

    if(inputHandler.reset && GAMESTATE == 1) //Restarting game after game over
    {
        console.log("reset");
        projectiles.length = 0;
        numberOfProjectiles = 0;
        GAMESTATE = 0;
    }

    if(player.isJumping == true && player.velocity.y > 0) //Check if player is descending
    {
        player.isFalling = true;
    }

    if(inputHandler.left) //If inputting Left
    {
        player.velocity.x -= 75;
    }

    if(inputHandler.right) //If inputting Right
    {
        player.velocity.x += 75; 
    }
}

//Function that checks collision and handles jumping through platforms
function checkCollision()
{
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
        player.isJumping = false;
        player.isFalling = false;
    }

    if(player.velocity.y > 0 && !player.isJumping) //Checking if player is jumping
    {
        player.isJumping = true;
    }

    for(let i = 0; i < numberOfPlatforms; i++) //Checking platform collision
    {
        if(player.position.y >= platforms[i].position.y - player.height && //If player is on platform 
            platforms[i].position.y >= player.position.y + 20 && //Second bound
            platforms[i].position.x <= player.position.x + ((2/3) * player.width) && //Left edge
            platforms[i].position.x + platforms[i].width >= player.position.x + ((2/3) * player.width) && //Right Edge
            player.isFalling)
        {
            player.position.y = platforms[i].position.y - player.height;
            player.velocity.y = 0;
            player.isJumping = false;
            player.isFalling = false;
        }
        if(player.velocity.y == 0 && player.position.y + player.height < GAMEHEIGHT)
        {
            player.position.y = platforms[i].position.y - player.height;
            player.velocity.y = 0;
            player.isJumping = false;
            break;
        }
    }

    for(let i =0; i < numberOfProjectiles; i++) //Checking projectile collision
    {
        if(player.position.y <= projectiles[i].yPosition + projectiles[i].height &&
            player.position.y + player.height >= projectiles[i].yPosition &&
            player.position.x <= projectiles[i].xPosition + projectiles[i].width &&
            player.position.x + player.width >= projectiles[i].xPosition)
        {
            console.log("hit");
            GAMESTATE = 1;
        }
    }
}

let fpsDisplay = document.getElementById("fpsDisplay");

//Main draw function
function draw()
{
    player.draw(ctx);

    for(let i = 0; i < numberOfPlatforms; i++)
    {
        platforms[i].draw(ctx);
    }

    for(let i = 0; i < numberOfProjectiles; i++)
    {
        projectiles[i].draw(ctx);
    }

    if (GAMESTATE == 1) {
        ctx.rect(0, 0, GAMEWIDTH, GAMEHEIGHT);
        ctx.fillStyle = "rgba(0,0,0,1)";
        ctx.fill();
        ctx.font = "30px Arial";
        ctx.fillStyle = "white";
        ctx.textAlign = "center";
        ctx.fillText("Loser! Press R to restart", GAMEWIDTH / 2, GAMEHEIGHT / 2);
    }

    fpsDisplay.textContent = fps + ' FPS';
}

const GRAVITY = 27;
let projectileFrameCount = 0;
let totalTime = 0;

//Main update function
function update(deltaTime)
{
    player.position.y += player.velocity.y * deltaTime; //Vertical velocity
    player.position.x += player.velocity.x * deltaTime; //Horizontal velocity
    player.velocity.x *= 0.9; //Friction
    player.velocity.y += GRAVITY; //Gravity


    for(let i = 0; i < numberOfProjectiles; i++)
    {
        projectiles[i].yPosition += projectiles[i].velocity.y * deltaTime; //Vertical velocity
    }

    //Spawning projectiles every second
    totalTime += deltaTime;
    if(totalTime > 1)
    {
        spawnProjectile(Math.floor((Math.random() * 720) + 1));
        totalTime = 0;
    }


    checkCollision();
    controller();
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