var canvas = document.getElementById("main-canvas");
var context = canvas.getContext("2d");

function spaceShip(x, y) {
  // this.directionX = directionX
  // this.directionY = directionY
  this.orientation = 5.236
  this.x = x
  this.y = y
  this.speed = 0
}

spaceShip.prototype.decelerate = function(){
  if (ship.speed > 0) { ship.speed -= 0.03 }
  if (ship.speed < 0) { ship.speed = 0 }
}

spaceShip.prototype.draw = function() {
  context.beginPath();
  context.moveTo(this.x, this.y);
  // context.lineTo(this.x - 5, this.y + 20);
  // context.lineTo(this.x + 5, this.y + 20);
  // debugger;
  context.lineTo((this.x + Math.cos(this.orientation) * 20), (this.y - Math.sin(this.orientation) * 20))
  context.lineTo((this.x + Math.cos(this.orientation - 0.785) * 20), (this.y - Math.sin(this.orientation - 0.785) * 20))
  // console.log((this.x + Math.cos(this.orientation) * 10), (this.y + Math.sin(this.orientation) * 10));
  context.closePath();
  context.strokeStyle="white";
  context.stroke();
  return this;
}

spaceShip.prototype.accelerate = function() {
  this.y -= this.speed
  return this;
}

spaceShip.prototype.checkPosition = function() {
  console.log(this.y)
  if (this.y < -20){
    this.y = 599
  }
}

var ship = new spaceShip(350, 300);
ship.draw();

requestAnimationFrame(function gameLoop() {
  context.clearRect(0, 0, canvas.width, canvas.height)
  ship.draw().accelerate();
  ship.checkPosition();
  ship.decelerate();
  requestAnimationFrame(gameLoop)
})

window.onkeydown = function(event){
  if (event.keyCode === 38 && ship.speed < 4){
    console.log("event")
    ship.speed += 0.25
  }
}
