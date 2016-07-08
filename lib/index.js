var canvas = document.getElementById("main-canvas");
var context = canvas.getContext("2d");
const SpaceShip = require("./spaceship")
const Asteroid = require("./asteroid")
var ship = new SpaceShip(350, 300, context, new Keyboard);
var asteroid1 = new Asteroid(context);
var asteroid2 = new Asteroid(context);
var asteroid3 = new Asteroid(context);
var asteroid4 = new Asteroid(context);
var asteroid5 = new Asteroid(context);
var asteroids = [asteroid1, asteroid2, asteroid3, asteroid4, asteroid5]

requestAnimationFrame(function gameLoop() {
  context.clearRect(0, 0, canvas.width, canvas.height)
  asteroids.forEach(function(asteroid){
    asteroid.draw().moveAsteroid();
  })

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

function Game() {
}

Game.prototype.createAsteroid = function(interval) {
  interval -= 1
  if (interval === 0) {
    return new Asteroid()
  }
}
