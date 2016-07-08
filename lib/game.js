const Asteroid = require("./asteroid");
const Keyboard = require("./keyboard");
const SpaceShip = require("./spaceship");

function Game(context) {
  this.context = context;
  this.level = 1;
  this.asteroids = []
  this.keyboard = new Keyboard
  this.createShip();
  this.started = false
  this.time = 0
}

Game.prototype.createShip = function() {
  this.ship = new SpaceShip(-1000, -1000, this.context, this.keyboard);
}

Game.prototype.createAsteroid = function(asteroidCount, level) {
  if (asteroidCount < level + 7) {
    this.asteroids.push(new Asteroid(this.context));
  }
}

Game.prototype.startGame = function() {
  this.started = true;
  this.ship.hidden = false
  this.ship.point = {x: 350, y: 300}
}

Game.prototype.update = function() {
  this.checkTime();
  this.ship.update()
  if (this.keyboard.isDown(this.keyboard.KEYS.ENTER)) {
    console.log("enter");
    this.startGame()
  }
}

Game.prototype.checkTime = function(){
  if (this.started === true) { this.time += 1 }
  if (this.time > 1000){
    this.time = 0
    this.level += 1
  }
}

Game.prototype.checkShipCollision = function(){
  var shipCoordinates = [this.ship.point, this.ship.rightSide, this.ship.leftSide]
  this.asteroids.forEach(function(asteroid){
    shipCoordinates.forEach(function(coordinate){
      if ((coordinate.x > asteroid.center.x - asteroid.radius) &&
      (coordinate.x < asteroid.center.x + asteroid.radius) &&
      (coordinate.y > asteroid.center.y - asteroid.radius) &&
      (coordinate.y < asteroid.center.y + asteroid.radius)) {
        console.log("you hit it");
      }
    })
  })
}

Game.prototype.gameText = function() {
  if (this.started === false) {
    this.intro();
  }
  this.context.font="15px Verdana"
  this.context.fillText("Level: " + this.level, 10, 25)
}

Game.prototype.intro = function() {
  this.context.font="45px Impact"
  this.context.fillText("ASTEROIDS", 265, 200)
  this.context.font="20px Verdana"
  this.context.fillText("Hit Enter to Start!", 270, 250)
}

module.exports = Game;
