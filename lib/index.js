var canvas = document.getElementById("main-canvas");
var context = canvas.getContext("2d");

function spaceShip(x, y) {
  this.orientation = 4.7123
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
  context.lineTo((this.x + Math.cos(this.orientation + 0.3) * 20.6155), (this.y - Math.sin(this.orientation + 0.3) * 20))
  context.lineTo((this.x + Math.cos(this.orientation - 0.3) * 20.6155), (this.y - Math.sin(this.orientation - 0.3) * 20))
  var rocketLocation = ((this.x + Math.cos(this.orientation) * 20), (this.y - Math.sin(this.orientation) * 20))
  console.log("rockets" + rocketLocation)
  context.closePath();
  context.strokeStyle="white";
  context.stroke();
  return this;
}

function convertToDegrees(radian) {
  return radian / Math.PI * 180
}

spaceShip.prototype.accelerate = function() {
  // var angle = convertToDegrees(this.orientation)
  // if (angle < 90) {
  //   // var slope = angle / 360
  //   this.x -= angle / 100
  //   this.y += 360 / 100
  // }
  this.y -= this.speed
  return this;
}

spaceShip.prototype.checkPosition = function() {
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
