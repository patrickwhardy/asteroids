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
  this.y -= speed
  return this;
}

spaceShip.prototype.checkPosition = function() {
  console.log(this.y)
  if (this.y < -20){
    this.y = 599
  }
}

var ship = new spaceShip(350, 300);
var speed = 0
ship.draw();


requestAnimationFrame(function gameLoop() {
  context.clearRect(0, 0, canvas.width, canvas.height)
  ship.draw().accelerate();
  ship.checkPosition();
  requestAnimationFrame(gameLoop)
  if (speed > 0) {
    speed -= 0.03
  }
})

window.onkeydown = function(event){
  if (event.keyCode === 38 && speed < 4){
    console.log("event")
    speed += 0.25
  }
}
