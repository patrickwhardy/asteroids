function Particle(startingPoint, center, context) {
  this.size = {x: 2, y: 2};
  this.center = center;
  this.startPoint = startingPoint;
  this.context = context;
  this.speed = 0
  this.slope = {x: Math.random() * 2 - 1, y: Math.random() * 2 - 1}
}

Particle.prototype.move = function() {
  var xDifference = Math.abs(this.center.x) - Math.abs(this.startPoint.x)
  var yDifference = Math.abs(this.center.y) - Math.abs(this.startPoint.y)
  if (xDifference < 20 && yDifference < 20) {
    this.center.x += this.slope.x
    this.center.y += this.slope.y
  } else {
    this.center.x = 900
    this.center.y = 900
    this.slope = {x: 0, y: 0}
  }
}

Particle.prototype.draw = function() {
  this.context.fillStyle="white"
  this.context.fillRect(this.center.x - this.size.x / 2,
    this.center.y - this.size.y / 2,
    this.size.x, this.size.y);
    return this;
}

module.exports = Particle
