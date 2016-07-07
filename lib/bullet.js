function Bullet(center, context) {
  this.size = {x: 10, y: 10 };
  this.center = center;
  this.context = context
  this.speed = 6
}

Bullet.prototype.draw = function() {
  this.context.fillStyle="white"
  this.context.fillRect(this.center.x - this.size.x / 2,
  this.center.y - this.size.y / 2,
  this.size.x, this.size.y);
  return this;
}

Bullet.prototype.update = function() {
  this.center.x += this.velocity.x;
  this.center.y += this.velocity.y;
}

Bullet.prototype.accelerate = function() {
  // this.center.x += this.speed
  // this.center.y += this.speed * this.center.slope
  if (this.center.slope > 2) {this.center.slope = 2}
  if (this.center.slope < -2) {this.center.slope = -2}
  // if (this.rocketX < this.x){
  //   this.y += (this.speed * this.center.slope)
  //   this.x += this.speed
  // }
  // else {
    this.center.y -= (this.speed * this.center.slope)
    this.center.x -= this.speed
    console.log(this.center.x)
  // }
}

module.exports = Bullet
