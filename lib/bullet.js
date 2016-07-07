function Bullet(center, context) {
  this.size = {x: 10, y: 10 };
  this.center = center;
  this.context = context
  // this.draw()
}

Bullet.prototype.draw = function() {
  this.context.fillStyle="white"
  this.context.fillRect(this.center.x - this.size.x / 2,
  this.center.y - this.size.y / 2,
  this.size.x, this.size.y);
}

Bullet.prototype.update = function() {
  this.center.x += this.velocity.x;
  this.center.y += this.velocity.y;
}

module.exports = Bullet
