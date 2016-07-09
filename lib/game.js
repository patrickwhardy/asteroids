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
  this.introTime = 0
  this.lives = 2
  this.lifeChars = ["A", "A A", "A A A"]
  this.dead = false
  this.deadTime = 0
  this.spawnTime = 0
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
  if (this.keyboard.isDown(this.keyboard.KEYS.ENTER) && this.started === false) {
    this.startGame()
  }
  if (this.dead === true) {
    this.respawnShip();
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
  var thisGame = this
  this.asteroids.forEach(function(asteroid){
    shipCoordinates.forEach(function(coordinate){
      if ((coordinate.x > asteroid.center.x - asteroid.radius + 5) &&
      (coordinate.x < asteroid.center.x + asteroid.radius - 5) &&
      (coordinate.y > asteroid.center.y - asteroid.radius + 5) &&
      (coordinate.y < asteroid.center.y + asteroid.radius - 5)) {
        if (thisGame.dead === false) {
          thisGame.killShip();
          console.log(thisGame.dead)
          console.log("hit")
        }
      }
    })
  })
}

Game.prototype.killShip = function(){
  this.lives -=1
  this.dead = true
  this.ship.hidden = true
  this.ship.point = {x: -1000, y: -1000}
  this.ship.orientation = 4.7123;
  this.deadTime = this.time
}

Game.prototype.blinkShip = function() {
  this.spawnTime += 1
  if (this.spawnTime < 10 ){
    this.ship.hidden = true
    this.ship.point = {x: -1000, y: -1000}
  }
  else if (this.spawnTime > 20){
    this.spawnTime = 0
    this.ship.point = {x: 350, y: 300}
  }
}

Game.prototype.respawnShip = function(){
  if (this.time > this.deadTime + 60) {

    this.ship.hidden = false
    this.ship.point = {x: 350, y: 300}
    this.blinkShip();
  }
  if (this.time > this.deadTime + 300) {
    this.dead = false
    this.ship.hidden = false
    this.deadTime = 0
  }
}

Game.prototype.gameText = function() {
  if (this.started === false) {
    this.intro()
  }
  this.context.font="15px Verdana"
  this.context.fillText("Level: " + this.level, 10, 25)
  this.context.fillText(this.lifeChars[this.lives], 10, 45)

  this.context.fillText("Score: " + this.level, 600, 25)
}

Game.prototype.intro = function() {
  this.context.font="45px Impact"
  this.context.fillText("ASTEROIDS", 265, 220)
  this.introTime += 1
  if (this.introTime < 25 ){
    this.context.font="20px Verdana"
    this.context.fillText("Hit Enter to Start!", 270, 250)
  }
  else if (this.introTime > 50){
    this.introTime = 0
  }
}

module.exports = Game;
