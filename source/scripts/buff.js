function Buff(context) {
  this.context = context;
  this.center = {x: 5, y: 5};
  this.slope = {x: Math.random() * 2 -1, y: Math.random() * 2 -1};
  this.consumed = false;
}

Buff.prototype.draw = function() {
  this.checkPosition();
  this.context.fillStyle="white";
  this.context.beginPath();
  this.context.arc(this.center.x, this.center.y, 10, 0, 2*Math.PI);
  this.context.fill();
  this.speed = Math.random();
  return this;
};

Buff.prototype.moveBuff = function() {
  var increment;
  if (this.speed < 0) {
    increment = 5;
  } else {
    increment = -5;
  }
  this.center.x += (this.slope.x * increment);
  this.center.y += (this.slope.y * increment);
};

Buff.prototype.checkPosition = function() {
  if (this.center.y < -10) { this.center.y = 535;}
  if (this.center.y > 540) { this.center.y = -5;}
  if (this.center.x < -10) { this.center.x = 705;}
  if (this.center.x > 710) { this.center.x = -5;}
};

module.exports = Buff;
