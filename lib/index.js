var canvas = document.getElementById("main-canvas");
var context = canvas.getContext("2d");
const SpaceShip = require("./spaceship")
var ship = new SpaceShip(350, 300, context, new Keyboard);

requestAnimationFrame(function gameLoop() {
  context.clearRect(0, 0, canvas.width, canvas.height)
  ship.draw().accelerate();
  ship.checkPosition();
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
