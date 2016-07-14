const Particle = require("./particle");
// import Particle, { calcRadius } from './particle';
// import Ship from './particle';

// class Asteroid {
//   constructor(context, center = {x: -50, y: -50}, radius) {
//     this.center = center
//     if (radius) {
//       this.radius = radius
//     } else {
//       this.setRadius();
//     }
//     this.context = context;
//     this.slope = {x: (Math.random() * 2 - 1), y: (Math.random() * 2 - 1)}
//     this.hits = 0
//   }
//
//   setRadius() {
//     ////
//   }
//
//   setRadius() {
//     ////
//   }
// }

// export default Asteroid = (context, center = {x: -50, y: -50}, radius) => {
//   this.center = center
//   if (radius) {
//     this.radius = radius
//   } else {
//     this.setRadius();
//   }
//   this.context = context;
//   this.slope = {x: (Math.random() * 2 - 1), y: (Math.random() * 2 - 1)}
//   this.hits = 0
// }
// ----------------> no module.exports = Asteroid in this scenario


function Asteroid(context, center = {x: -50, y: -50}, radius) {
  this.center = center
  if (radius) {
    this.radius = radius
  } else {
    this.setRadius();
  }
  this.context = context;
  this.slope = {x: (Math.random() * 2 - 1), y: (Math.random() * 2 - 1)}
  this.hits = 0
}

Asteroid.prototype.setRadius = function(){
  this.radius = Math.random() * 80
  if (this.radius < 10) { this.radius = 20 }
}

Asteroid.prototype.explode = function() {
  var i = 0
  var particles = []
  var thisAsteroid = this;
  while (this.radius / 2 > i) {
    particles.push(new Particle({x: thisAsteroid.center.x, y: thisAsteroid.center.y},
      {x: thisAsteroid.center.x + i, y: thisAsteroid.center.y +i},
      thisAsteroid.context))
    i++
  }
  return particles
}

Asteroid.prototype.draw = function() {
  this.checkPosition();
  this.context.fillStyle="white"
  this.context.beginPath();
  this.context.moveTo(this.center.x + this.radius, this.center.y)
  this.context.lineTo(this.center.x + (this.radius * 0.8), this.center.y + this.radius * 0.6)
  this.context.lineTo(this.center.x + (this.radius * 0.5), this.center.y + this.radius * 0.85)
  this.context.lineTo(this.center.x + (this.radius * 0.3), this.center.y + this.radius * 0.95)
  this.context.lineTo(this.center.x + (this.radius * 0.12), this.center.y + this.radius)
  this.context.lineTo(this.center.x - (this.radius * 0.2), this.center.y + this.radius)
  this.context.lineTo(this.center.x - (this.radius * 0.5), this.center.y + this.radius * 0.8)
  this.context.lineTo(this.center.x - (this.radius * 0.8), this.center.y + this.radius * 0.6)
  this.context.lineTo(this.center.x - this.radius, this.center.y + this.radius * 0.4)
  this.context.lineTo(this.center.x - this.radius, this.center.y)
  this.context.lineTo(this.center.x - (this.radius * 0.7), this.center.y - (this.radius * 0.7))
  this.context.lineTo(this.center.x - (this.radius * 0.4), this.center.y - (this.radius * 0.85))
  this.context.lineTo(this.center.x - (this.radius * 0.15), this.center.y - this.radius)
  this.context.lineTo(this.center.x + (this.radius * 0.3), this.center.y - this.radius)
  this.context.lineTo(this.center.x + (this.radius * 0.7), this.center.y - (this.radius * 0.7))
  this.context.closePath()

  this.context.stroke();
  return this;
}

Asteroid.prototype.moveAsteroid = function() {
  this.center.x += this.slope.x
  this.center.y += this.slope.y
  return this;
}
// math module? 
Asteroid.prototype.checkPosition = function() {
  if (this.center.y < (this.radius * -2)) { this.center.y = (529 + this.radius) }
  if (this.center.y > (530 + this.radius)) { this.center.y = (1 - this.radius) }
  if (this.center.x < (this.radius * -2)) { this.center.x = (699 + this.radius) }
  if (this.center.x > (700 + this.radius)) { this.center.x = 1 - this.radius}
}

module.exports = Asteroid;
