var canvas = document.getElementById("main-canvas");
var context = canvas.getContext("2d");
const SpaceShip = require("./spaceship")
const Asteroid = require("./asteroid")
var ship = new SpaceShip(350, 300, context, new Keyboard);
var asteroids = []
var game = new Game(context);
game.level = 8

requestAnimationFrame(function gameLoop() {
  context.clearRect(0, 0, canvas.width, canvas.height)
  asteroids.forEach(function(asteroid){
    asteroid.draw().moveAsteroid();
  })
  game.createAsteroid(asteroids.length, game.level)
  checkShipCollision();
  ship.draw().accelerate();
  ship.decelerate();
  if (ship.bullets.length > 0) {
    ship.bullets.forEach(function(bullet){
      bullet.draw().accelerate();
    });
  }
  ship.update()
  requestAnimationFrame(gameLoop)
})

function Keyboard() {
  var keyState = {};

  window.onkeydown = function(event) {
    keyState[event.keyCode] = true;
  };

  window.onkeyup = function(e) {
    keyState[event.keyCode] = false;
  };

  this.isDown = function(keyCode) {
    return keyState[keyCode] === true;
  };

  this.KEYS = { LEFT: 37, RIGHT: 39, UP: 38, SPACE: 32 };
}

function checkShipCollision(){
  asteroids.forEach(function(asteroid){
    [ship.point, ship.rightSide, ship.leftSide].forEach(function(coordinate){
      if ((coordinate.x > asteroid.center.x - asteroid.radius) &&
      (coordinate.x < asteroid.center.x + asteroid.radius) &&
      (coordinate.y > asteroid.center.y - asteroid.radius) &&
      (coordinate.y < asteroid.center.y + asteroid.radius)) {
        console.log("you hit it");
      }
    })
  })
}

function Game(context) {
  this.context = context
  this.level = 1
}

Game.prototype.createAsteroid = function(asteroidCount, level) {
  if (asteroidCount < level) {
    asteroids.push(new Asteroid(context))
  }
}
