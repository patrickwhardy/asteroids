const Bullet = require("./bullet");

function SpaceShip(x, y, context) {
  this.orientation = 4.7123;
  this.x = x;
  this.y = y;
  this.speed = 0;
  this.context = context;
}

SpaceShip.prototype.calculateSlope = function(){
  this.findRockets();
  this.slope = (this.y - this.rocketY) / (this.x - this.rocketX);
}

SpaceShip.prototype.findRockets = function(){
  this.rocketX = (this.x + Math.cos(this.orientation) * 20);
  this.rocketY = (this.y - Math.sin(this.orientation) * 20);
}

SpaceShip.prototype.decelerate = function(){
  if (this.speed > 0) { this.speed -= 0.03 };
  if (this.speed < 0) { this.speed = 0 };
}

SpaceShip.prototype.draw = function() {
  this.context.beginPath();
  this.context.moveTo(this.x, this.y);
  this.context.lineTo((this.x + Math.cos(this.orientation + 0.3) * 20.6155), (this.y - Math.sin(this.orientation + 0.3) * 20))
  this.context.lineTo((this.x + Math.cos(this.orientation - 0.3) * 20.6155), (this.y - Math.sin(this.orientation - 0.3) * 20))
  this.context.closePath();
  this.context.strokeStyle="white";
  this.context.stroke();
  this.calculateSlope();
  console.log(this.slope)
  return this;
}

// function convertToDegrees(radian) {
//   return radian / Math.PI * 180
// }

SpaceShip.prototype.accelerate = function() {
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

SpaceShip.prototype.fireBullet = function() {
  return new Bullet({ x: this.x, y: this.y, slope: this.slope}, this.context)
}

// var bullet = new Bullet({ x: this.center.x, y: this.center.y - this.size.x },
//   { x: 0, y: -6});
//   this.game.addBody(bullet);
//   this.game.shootSound.load();
//   this.game.shootSound.play();



SpaceShip.prototype.checkPosition = function() {
  if (this.y < -20) { this.y = 529 }
  if (this.y > 550) { this.y = 1 }
  if (this.x < -20) { this.x = 699 }
  if (this.x > 720) { this.x = 1 }
}

module.exports = SpaceShip;
