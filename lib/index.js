var canvas = document.getElementById("main-canvas");
var context = canvas.getContext("2d");

function spaceShip(x, y) {
  this.orientation = 4.7123
  this.x = x
  this.y = y
  this.speed = 0
}

spaceShip.prototype.calculateSlope = function(){
  this.findRockets();
  this.slope = (this.y - this.rocketY) / (this.x - this.rocketX)
}

spaceShip.prototype.findRockets = function(){
  this.rocketX = (this.x + Math.cos(this.orientation) * 20);
  this.rocketY = (this.y - Math.sin(this.orientation) * 20);
}

spaceShip.prototype.decelerate = function(){
  if (ship.speed > 0) { ship.speed -= 0.03 }
  if (ship.speed < 0) { ship.speed = 0 }
}

spaceShip.prototype.draw = function() {
  context.beginPath();
  context.moveTo(this.x, this.y);
  context.lineTo((this.x + Math.cos(this.orientation + 0.3) * 20.6155), (this.y - Math.sin(this.orientation + 0.3) * 20))
  context.lineTo((this.x + Math.cos(this.orientation - 0.3) * 20.6155), (this.y - Math.sin(this.orientation - 0.3) * 20))
  context.closePath();
  context.strokeStyle="white";
  context.stroke();
  ship.calculateSlope();
  console.log(ship.slope)
  return this;
}

function convertToDegrees(radian) {
  return radian / Math.PI * 180
}

spaceShip.prototype.accelerate = function() {
  if (this.slope > 2) {this.slope = 2}
  if (this.slope < -2) {this.slope = -2}
  if (this.rocketX < this.x){
    this.y += (this.speed * this.slope)
    this.x += this.speed
  }
  else {
    this.y -= (this.speed * this.slope)
    this.x -= this.speed
  }
}

spaceShip.prototype.checkPosition = function() {
  if (this.y < -20) { this.y = 529 }
  if (this.y > 550) { this.y = 1 }
  if (this.x < -20) { this.x = 699 }
  if (this.x > 720) { this.x = 1 }
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
}
