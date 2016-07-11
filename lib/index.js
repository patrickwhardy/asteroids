var canvas = document.getElementById("main-canvas");
var context = canvas.getContext("2d");
const Game = require("./game")

var game = new Game(context);

requestAnimationFrame(function gameLoop() {
  context.clearRect(0, 0, canvas.width, canvas.height)
  game.gameText();
  game.createAsteroid(game.level)
  game.checkShipCollision();
  game.checkBulletCollision();
  game.drawShip()
  game.ship.decelerate();
  if (game.ship.bullets.length > 0) {
    game.ship.bullets.forEach(function(bullet){
      bullet.draw().accelerate();
    });
  }
  game.update()
  requestAnimationFrame(gameLoop)
})
