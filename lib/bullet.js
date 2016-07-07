function Bullet(center, context) {
  this.size = {x: 10, y: 10 };
  this.center = center;
  this.context = context
  this.speed = 1
}

Bullet.prototype.draw = function() {
  this.context.fillStyle="white"
  this.context.fillRect(this.center.x - this.size.x / 2,
  this.center.y - this.size.y / 2,
  this.size.x, this.size.y);
  return this;
}

Bullet.prototype.accelerate = function() {
  this.center.x += (this.speed * this.center.slope.x)
  this.center.y += (this.speed * this.center.slope.y)
}

module.exports = Bullet
