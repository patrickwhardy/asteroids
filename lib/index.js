var canvas = document.getElementById("main-canvas");
var context = canvas.getContext("2d");
const SpaceShip = require("./spaceship")
const Asteroid = require("./asteroid")
var ship = new SpaceShip(350, 300, context, new Keyboard);
var asteroid1 = new Asteroid({x: 100, y: 100}, context);
var asteroid2 = new Asteroid({x: 500, y: 500}, context);
var asteroids = [asteroid1, asteroid2]

requestAnimationFrame(function gameLoop() {
  context.clearRect(0, 0, canvas.width, canvas.height)
  asteroids.forEach(function(asteroid){
    asteroid.draw();
  })
  ship.draw().accelerate();
  ship.checkPosition();
  checkShipCollision();
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
    [ship.point, ship.starboard, ship.starboard].forEach(function(coordinate){
      if ((coordinate.x > asteroid.center.x - asteroid.radius) &&
      (coordinate.x < asteroid.center.x + asteroid.radius) &&
      (coordinate.y > asteroid.center.y - asteroid.radius) &&
      (coordinate.y < asteroid.center.y + asteroid.radius)) {
        console.log("you hit it");
      }
    })
  })

}
