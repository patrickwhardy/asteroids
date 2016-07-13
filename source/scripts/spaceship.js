const Bullet = require("./bullet");
const Particle = require("./particle");

function SpaceShip(x, y, context, keyboard) {
  this.orientation = 4.7123;
  this.momentum = this.orientation;
  this.point = { x, y};
  this.findSides();
  this.speed = 0;
  this.context = context;
  this.keyboard = keyboard;
  this.bullets = [];
  this.coolDown = 0;
  this.hidden = true;
  this.invincible = false;
  this.radius = 8;
  this.center = {x: 350, y: 313};
}

SpaceShip.prototype.explode = function() {
  var i = 0
  var particles = []
  var thisShip = this;
  while (20 > i) {
    particles.push(new Particle({x: thisShip.center.x, y: thisShip.center.y},
      {x: thisShip.center.x + i, y: thisShip.center.y +i},
      thisShip.context))
    i++
  }
  return particles
}

SpaceShip.prototype.calculateSlope = function(){
  this.findCenter();
  this.slope = {x: this.point.x - this.center.x, y: this.point.y - this.center.y};
};

SpaceShip.prototype.findCenter = function(){
  this.center.x = (this.point.x + Math.cos(this.orientation) * 12);
  this.center.y = (this.point.y - Math.sin(this.orientation) * 12);
};

SpaceShip.prototype.decelerate = function(){
  // this.speed = this.speed > 0 ? (this.speed -= 0.015) : 0;

  if (this.speed > 0) { this.speed -= 0.015; }
  if (this.speed < 0) { this.speed = 0; }
};

SpaceShip.prototype.draw = function() {
  this.checkPosition();
  this.findSides();

  this.context.beginPath();
  this.context.moveTo(this.point.x, this.point.y);
  this.context.lineTo(this.rightSide.x, this.rightSide.y);
  this.context.lineTo(this.leftSide.x, this.leftSide.y);
  this.context.closePath();
  this.context.strokeStyle="white";
  this.context.stroke();

  this.context.beginPath();
  this.context.moveTo(this.rightSide.x, this.rightSide.y);
  this.context.lineTo(this.rightSide.x + Math.cos(this.orientation + 0.3) * 7, this.rightSide.y - Math.sin(this.orientation + 0.3) * 7);
  this.context.stroke();

  this.context.beginPath();
  this.context.moveTo(this.leftSide.x, this.leftSide.y);
  this.context.lineTo(this.leftSide.x + Math.cos(this.orientation - 0.3) * 7, this.leftSide.y - Math.sin(this.orientation - 0.3) * 7);
  this.context.stroke();
  this.calculateSlope();
  return this;
};

SpaceShip.prototype.inertia = function() {
  var inertiaX = (this.point.x + Math.cos(this.momentum) * 20);
  var inertiaY = (this.point.y - Math.sin(this.momentum) * 20);
  this.inertiaSlope = {x: this.point.x - inertiaX, y: this.point.y - inertiaY};
};

SpaceShip.prototype.accelerate = function() {
  this.inertia();
  this.point.x += (this.speed * this.inertiaSlope.x / 10);
  this.point.y += (this.speed * this.inertiaSlope.y / 10);
};

SpaceShip.prototype.findSides = function() {
  // have math module so you don't have to look at the math in here
  this.rightSide = {x: (this.point.x + Math.cos(this.orientation + 0.3) * 20.6155), y: (this.point.y - Math.sin(this.orientation + 0.3) * 20.6155) };
  this.leftSide = {x: (this.point.x + Math.cos(this.orientation - 0.3) * 20.6155), y: (this.point.y - Math.sin(this.orientation - 0.3) * 20.6155) };
};

SpaceShip.prototype.fireBullet = function() {
  this.coolDown = 7;
  return new Bullet({ x: this.point.x, y: this.point.y, slope: this.slope}, this.context);
};

SpaceShip.prototype.checkPosition = function() {
  if (this.hidden === false) {
    if (this.point.y < -20) { this.point.y = 529 };
    if (this.point.y > 550) { this.point.y = 1 };
    if (this.point.x < -20) { this.point.x = 699 };
    if (this.point.x > 720) { this.point.x = 1 };
  }
};

SpaceShip.prototype.clearBullets = function() {
  if (this.bullets.length > 100) {
    this.bullets.splice(49, 50);
  }
};

SpaceShip.prototype.thrusters = function() {
  var rightThruster = {x: (this.point.x + Math.cos(this.orientation + 0.2) * 20.6155), y: (this.point.y - Math.sin(this.orientation + 0.3) * 20.6155) };
  var leftThruster = {x: (this.point.x + Math.cos(this.orientation - 0.2) * 20.6155), y: (this.point.y - Math.sin(this.orientation - 0.3) * 20.6155) };

  // move to draw() function or some sort of helper
  // drawThruster(args);
  this.context.beginPath();
  this.context.moveTo(this.point.x + Math.cos(this.orientation) * 30, this.point.y - Math.sin(this.orientation) * 30);
  this.context.lineTo(rightThruster.x + Math.cos(this.orientation), rightThruster.y - Math.sin(this.orientation));
  this.context.lineTo(leftThruster.x + Math.cos(this.orientation), leftThruster.y - Math.sin(this.orientation));
  this.context.closePath();
  this.context.fillStyle="white";
  this.context.fill();
};

SpaceShip.prototype.hide = function() {
  this.hidden = true;
  this.point = {x: -1000, y: -1000};
};

SpaceShip.prototype.unHide = function() {
  this.hidden = false;
  this.point = {x: 350, y: 300};
};


SpaceShip.prototype.update = function(time) {
  this.clearBullets();
  if (this.keyboard.isDown(this.keyboard.KEYS.LEFT)) {
    this.orientation += 0.1;
  } else if (this.keyboard.isDown(this.keyboard.KEYS.RIGHT)) {
    this.orientation -= 0.1;
  }
  if (this.keyboard.isDown(this.keyboard.KEYS.UP)) {
    var thrusterAudio = new Audio("thrusters.wav");
    thrusterAudio.play();
    if (time % 4 === 0) {
      this.thrusters();
    }
    if (this.speed < 4) {
      // use let instead of var ---> const for things that aren't reassigned
      var difference = Math.abs(this.momentum - this.orientation);
      if (difference > 0.3) {
        this.speed = (1.75 / (difference + 1));
      }
      this.speed += 0.05;
      this.momentum = this.orientation;
    }
  }

  if (this.keyboard.isDown(this.keyboard.KEYS.SPACE)) {
    if (this.coolDown === 0) {
      this.bullets.push(this.fireBullet());
      var laser = new Audio("pulse-gun.wav");
      laser.play();
    }
    else {
      this.coolDown -= 1;
    }
  }
};

// const drawThruster = () => {
//
// }

module.exports = SpaceShip;
