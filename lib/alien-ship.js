const Bullet = require("./bullet");

function AlienShip(context) {
  this.shipCenter = {x: 150, y: 150}
  this.speed = 1;
  this.context = context;
  this.bullets = []
  this.slope = {x: (Math.random() * 2 - 1), y: (Math.random() * 2 - 1)}
  this.hits = 0;
  this.radius = this.setRadius()
}

AlienShip.prototype.update = function(time) {
  if (time % 100 === 0) {
    this.changeDirection()
  }
  this.drawAlien().moveAlienShip()
}

AlienShip.prototype.setRadius = function(){
  var radius = Math.random() * 100
  if (radius > 40) { radius = 20 }
  return radius
}

AlienShip.prototype.changeDirection = function() {
  this.slope = {x: (Math.random() * 2 - 1), y: (Math.random() * 2 - 1)}
}

AlienShip.prototype.moveAlienShip = function() {
  this.shipCenter.x += (this.slope.x + this.speed)
  this.shipCenter.y += (this.slope.y + this.speed)
  return this;
}

AlienShip.prototype.drawAlien = function() {
  this.checkPosition();
  this.context.strokeStyle="white";
  this.context.beginPath();
  this.context.moveTo(this.shipCenter.x - this.radius, this.shipCenter.y);
  this.context.lineTo(this.shipCenter.x + this.radius, this.shipCenter.y)
  this.context.lineTo(this.shipCenter.x + this.radius - (this.radius * 0.5), this.shipCenter.y - (this.radius * .25))
  this.context.arc(this.shipCenter.x, this.shipCenter.y - (this.radius * 0.25), this.radius * .25, 3.1, 2*Math.PI);
  this.context.lineTo(this.shipCenter.x - (this.radius * 0.5), this.shipCenter.y - (this.radius * .25))
  this.context.lineTo(this.shipCenter.x - this.radius, this.shipCenter.y)
  this.context.lineTo(this.shipCenter.x - (this.radius * 0.625), this.shipCenter.y + (this.radius * 0.25))
  this.context.lineTo(this.shipCenter.x + this.radius - (this.radius * 0.375), this.shipCenter.y + (this.radius * 0.25))
  this.context.lineTo(this.shipCenter.x + this.radius, this.shipCenter.y)
  this.context.stroke();
  return this;
}

AlienShip.prototype.checkPosition = function() {
  if (this.shipCenter.x < -50) { this.shipCenter.x = 700}
  if (this.shipCenter.x > 700) { this.shipCenter.x = -50 }
  if (this.shipCenter.y < -50) { this.shipCenter.y = 530 }
  if (this.shipCenter.y > 580) { this.shipCenter.y = -50}
}

// AlienShip.prototype.fireBullet = function() {
//   return new Bullet({ x: this.point.x, y: this.point.y, slope: this.slope}, this.context)
// }

// AlienShip.prototype.clearBullets = function() {
//   if (this.bullets.length > 100) {
//     this.bullets.splice(49, 50)
//   }
// }

module.exports = AlienShip
