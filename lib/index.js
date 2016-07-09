var canvas = document.getElementById("main-canvas");
var context = canvas.getContext("2d");
const Game = require("./game")

var game = new Game(context);

requestAnimationFrame(function gameLoop() {
  context.clearRect(0, 0, canvas.width, canvas.height)
  game.gameText();
  game.asteroids.forEach(function(asteroid){
    asteroid.draw().moveAsteroid();
  })
  game.createAsteroid(game.asteroids.length, game.level)
  game.checkShipCollision();
  game.checkBulletCollision();
  game.ship.draw().accelerate();
  game.ship.decelerate();
  if (game.ship.bullets.length > 0) {
    game.ship.bullets.forEach(function(bullet){
      bullet.draw().accelerate();
    });
  }
  game.update()
  requestAnimationFrame(gameLoop)
})
