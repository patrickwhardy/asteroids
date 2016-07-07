function Asteroid(context) {
  this.center = {x: 100, y: 100};
  this.size = {x: 50, y: 50};
  this.radius = 50;
  this.context = context;
}

Asteroid.prototype.draw = function() {
  this.context.fillStyle="white"
  this.context.beginPath();
  this.context.arc(this.center.x, this.center.x, this.radius, 0, 2*Math.PI);
  this.context.stroke();
}

module.exports = Asteroid
