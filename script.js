const GAMEHEIGHT = 480;
const GAMEWIDTH = 720;

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
           y: 300
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

player.draw(ctx);
