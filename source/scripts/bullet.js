function Bullet(center, context) {
  this.size = {x: 4, y: 4};
  this.center = center;
  this.context = context;
  this.speed = 1;
}

Bullet.prototype.draw = function() {
  this.context.fillStyle="white";
  this.context.fillRect(this.center.x - this.size.x / 2,
    this.center.y - this.size.y / 2,
    this.size.x, this.size.y);
    return this;
};

Bullet.prototype.accelerate = function() {
  if (this.withinBounds() === true) {
    this.center.x += (this.speed * this.center.slope.x / 1.5);
    this.center.y += (this.speed * this.center.slope.y / 1.5);
  } else {
    this.center.x = 900;
    this.center.y = 900;
    this.center.slope = {x: 0, y: 0};
  }
};

Bullet.prototype.withinBounds = function() {
  if (this.center.x > 0 &&
      this.center.x < 700 &&
      this.center.y > 0 &&
      this.center.y < 530) {
    return true;
  }
};

module.exports = Bullet;
