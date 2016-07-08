const Bullet = require("./bullet");

function SpaceShip(x, y, context, keyboard) {
  this.orientation = 4.7123;
  this.point = {x: x, y: y}
  this.findSides();
  this.speed = 0;
  this.context = context;
  this.keyboard = keyboard
  this.bullets = []
  this.coolDown = 0
}

SpaceShip.prototype.calculateSlope = function(){
  this.findRockets();
  this.slope = {x: this.point.x - this.rocketX, y: this.point.y - this.rocketY}
}

SpaceShip.prototype.findRockets = function(){
  this.rocketX = (this.point.x + Math.cos(this.orientation) * 20);
  this.rocketY = (this.point.y - Math.sin(this.orientation) * 20);
}

SpaceShip.prototype.decelerate = function(){
  if (this.speed > 0) { this.speed -= 0.03 };
  if (this.speed < 0) { this.speed = 0 };
}

SpaceShip.prototype.draw = function() {
  this.checkPosition()
  this.findSides();
  this.context.beginPath();
  this.context.moveTo(this.point.x, this.point.y);
  this.context.lineTo(this.rightSide.x, this.rightSide.y)
  this.context.lineTo(this.leftSide.x, this.leftSide.y)
  this.context.closePath();
  this.context.strokeStyle="white";
  this.context.stroke();
  this.calculateSlope();
  return this;
}

SpaceShip.prototype.accelerate = function() {
  this.point.x += (this.speed * this.slope.x / 10)
  this.point.y += (this.speed * this.slope.y / 10)
}

SpaceShip.prototype.findSides = function() {
  this.rightSide = {x: (this.point.x + Math.cos(this.orientation + 0.3) * 20.6155), y: (this.point.y - Math.sin(this.orientation + 0.3) * 20.6155) }
  this.leftSide = {x: (this.point.x + Math.cos(this.orientation - 0.3) * 20.6155), y: (this.point.y - Math.sin(this.orientation - 0.3) * 20.6155) }
}

SpaceShip.prototype.fireBullet = function() {
  this.coolDown = 10
  return new Bullet({ x: this.point.x, y: this.point.y, slope: this.slope}, this.context)
}

SpaceShip.prototype.checkPosition = function() {
  if (this.point.y < -20) { this.point.y = 529 }
  if (this.point.y > 550) { this.point.y = 1 }
  if (this.point.x < -20) { this.point.x = 699 }
  if (this.point.x > 720) { this.point.x = 1 }
}

SpaceShip.prototype.update = function() {
  if (this.keyboard.isDown(this.keyboard.KEYS.LEFT)) {
    this.orientation += 0.1;
  } else if (this.keyboard.isDown(this.keyboard.KEYS.RIGHT)) {
    this.orientation -= 0.1;
  }
  if (this.keyboard.isDown(this.keyboard.KEYS.UP) && this.speed < 4) {
    this.speed += 0.1;
  }
  if (this.keyboard.isDown(this.keyboard.KEYS.SPACE)) {
    if (this.coolDown === 0) {
      this.bullets.push(this.fireBullet());
    }
    else {
      this.coolDown -= 1
    }
  };
}

module.exports = SpaceShip;
