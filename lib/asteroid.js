function Asteroid(context, center = {x: -50, y: -50}, radius) {
  this.center = center
  if (radius) {
    this.radius = radius
  } else {
    this.setRadius();
  }
  this.context = context;
  this.slope = {x: (Math.random() * 2 - 1), y: (Math.random() * 2 - 1)}
}

Asteroid.prototype.setRadius = function(){
  this.radius = Math.random() * 80
  if (this.radius < 10) { this.radius = 20 }
}

Asteroid.prototype.draw = function() {
  this.checkPosition();
  this.context.fillStyle="white"
  this.context.beginPath();
  this.context.arc(this.center.x, this.center.y, this.radius, 0, 2*Math.PI);
  this.context.stroke();
  return this;
}

Asteroid.prototype.moveAsteroid = function() {
  this.center.x += this.slope.x
  this.center.y += this.slope.y
  return this;
}

Asteroid.prototype.checkPosition = function() {
  if (this.center.y < (this.radius * -2)) { this.center.y = (529 + this.radius) }
  if (this.center.y > (530 + this.radius)) { this.center.y = (1 - this.radius) }
  if (this.center.x < (this.radius * -2)) { this.center.x = (699 + this.radius) }
  if (this.center.x > (700 + this.radius)) { this.center.x = 1 - this.radius}
}

module.exports = Asteroid
