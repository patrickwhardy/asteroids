function Bullet(center, context) {
  this.size = {x: 4, y: 4};
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
  this.center.x += (this.speed * this.center.slope.x / 2)
  this.center.y += (this.speed * this.center.slope.y / 2)
}

module.exports = Bullet
