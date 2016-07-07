var canvas = document.getElementById("main-canvas");
var context = canvas.getContext("2d");
const SpaceShip = require("./spaceship")
var ship = new SpaceShip(350, 300, context);
var bullets = []

requestAnimationFrame(function gameLoop() {
  context.clearRect(0, 0, canvas.width, canvas.height)
  ship.draw().accelerate();
  ship.checkPosition();
  ship.decelerate();
  if (bullets.length > 0) {
    bullets.forEach(function(bullet){
      bullet.draw().accelerate();
    });
  }
  requestAnimationFrame(gameLoop)
})

window.onkeydown = function(event) {
  if (event.keyCode === 38 && ship.speed < 4){
    ship.speed += 0.25;
  }

  if (event.keyCode === 37) {
    ship.orientation += 0.1;
  }

  if (event.keyCode === 39) {
    ship.orientation -= 0.1;
  }

  if (event.keyCode === 32) {
    bullets.push(ship.fireBullet());
  }
}
