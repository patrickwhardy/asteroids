const Bullet = require("./bullet");
const Particle = require("./particle");

function AlienShip(context, opponent) {
  this.shipCenter = {x: -50, y: -50};
  this.speed = 1;
  this.context = context;
  this.slope = {x: (Math.random() * 2 - 1), y: (Math.random() * 2 - 1)};
  this.hits = 0;
  this.radius = this.setRadius();
}

AlienShip.prototype.update = function(time) {
  if (time % 100 === 0) {
    this.changeDirection();
  }
  this.drawAlien().moveAlienShip();
};

AlienShip.prototype.explode = function() {
  var i = 0;
  var particles = [];
  var thisAlien = this;
  while (this.radius / 2 > i) {
    particles.push(new Particle({x: thisAlien.shipCenter.x, y: thisAlien.shipCenter.y},
      {x: thisAlien.shipCenter.x + i, y: thisAlien.shipCenter.y +i},
      thisAlien.context));
    i++;
  }
  return particles;
};


AlienShip.prototype.fireWeapon = function(opponent) {
  return new Bullet({ x: this.shipCenter.x, y: this.shipCenter.y, slope: this.findOpponent(opponent)}, this.context);
};

AlienShip.prototype.findOpponent = function(opponent) {
  var y = (this.shipCenter.y - opponent.y) * -1;
  var x = (this.shipCenter.x - opponent.x);
  while (Math.abs(y) > 4 || Math.abs(x) > 4) {
    y *= 0.9;
    x *= 0.9;
  }
  return {x: x, y: y};
};

AlienShip.prototype.setRadius = function(){
  var radius = Math.random();
  // if (radius > 0.7) { radius = 25 }
  // else if (radius > 0.4) { radius = 20}
  // else { radius = 15}
  // return radius

  // there's probably a nicer way of doing this
  // return radius.withinBounds

  if (radius > 0.7) {
    radius = 25;
  } else if (radius > 0.4) {
    radius = 20;
  } else {
    radius = 15;
  }
  return radius;
};

AlienShip.prototype.changeDirection = function() {
  this.slope = {x: (Math.random() * 2 - 1), y: (Math.random() * 2 - 1)};
};

AlienShip.prototype.moveAlienShip = function() {
  this.shipCenter.x += (this.slope.x + this.speed);
  this.shipCenter.y += (this.slope.y + this.speed);
  return this;
};

AlienShip.prototype.drawAlien = function() {
  this.checkPosition();
  this.context.strokeStyle="white";
  this.context.beginPath();
  this.context.moveTo(this.shipCenter.x - this.radius, this.shipCenter.y);
  this.context.lineTo(this.shipCenter.x + this.radius, this.shipCenter.y);
  this.context.lineTo(this.shipCenter.x + this.radius - (this.radius * 0.5), this.shipCenter.y - (this.radius * 0.25));
  this.context.arc(this.shipCenter.x, this.shipCenter.y - (this.radius * 0.25), this.radius * 0.25, 3.1, 2*Math.PI);
  this.context.lineTo(this.shipCenter.x - (this.radius * 0.5), this.shipCenter.y - (this.radius * 0.25));
  this.context.lineTo(this.shipCenter.x - this.radius, this.shipCenter.y);
  this.context.lineTo(this.shipCenter.x - (this.radius * 0.625), this.shipCenter.y + (this.radius * 0.25));
  this.context.lineTo(this.shipCenter.x + this.radius - (this.radius * 0.375), this.shipCenter.y + (this.radius * 0.25));
  this.context.lineTo(this.shipCenter.x + this.radius, this.shipCenter.y);
  this.context.stroke();
  return this;
};

AlienShip.prototype.checkPosition = function() {
  if (this.shipCenter.x < -50) { this.shipCenter.x = 700; }
  if (this.shipCenter.x > 700) { this.shipCenter.x = -50; }
  if (this.shipCenter.y < -50) { this.shipCenter.y = 530; }
  if (this.shipCenter.y > 580) { this.shipCenter.y = -50; }
};

module.exports = AlienShip;
