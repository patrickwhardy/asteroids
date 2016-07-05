var canvas = document.getElementById("main-canvas");
var context = canvas.getContext("2d");

function spaceShip(x, y, directionX, directionY) {
  this.directionX = directionX
  this.directionY = directionY
  this.x = x
  this.y = y
}

spaceShip.prototype.draw = function() {
  context.beginPath();
  context.moveTo(this.x, this.y);
  context.lineTo(this.x - 5, this.y + 20);
  context.lineTo(this.x + 5, this.y + 20);
  context.closePath();
  context.strokeStyle="white";
  context.stroke();
  return this;
}

spaceShip.prototype.accelerate = function() {
  this.y--
  return this;
}

var ship = new spaceShip(350, 300);

ship.draw();


  requestAnimationFrame(function gameLoop() {
    console.log("yo")
    ship.draw().accelerate()
    requestAnimationFrame(gameLoop)
  })

// canvas.addEventListener("click", function(event) {
//   ship.accelerate();
// })
