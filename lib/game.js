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
  this.lives = 3
  this.lifeChars = ["", "A", "A A", "A A A"]
  this.dead = false
  this.deadTime = 0
  this.spawnTime = 0
  this.asteroidsToRemove = []
  this.asteroidsDestroyed = 0
}

Game.prototype.createShip = function() {
  this.ship = new SpaceShip(-1000, -1000, this.context, this.keyboard);
}

Game.prototype.createAsteroid = function(level, asteroid, asteroidCount) {
  if (asteroidCount) {
    var i = 0
    while (i < asteroidCount) {
      this.asteroids.push(new Asteroid(this.context, {x: (asteroid.center.x + i), y: (asteroid.center.y + i)}, (asteroid.radius / 3)))
      i++
    }
    var length = this.asteroids.length - 1
  }
  if (this.asteroids.length < level + 7) {
    this.asteroids.push(new Asteroid(this.context));
  }
}

Game.prototype.startGame = function() {
  this.started = true;
  this.ship.hidden = false
  this.ship.point = {x: 350, y: 300}
}

Game.prototype.removeAsteroids = function() {
  var thisGame = this
  this.asteroidsToRemove.forEach(function(asteroidIndex){
    thisGame.asteroids.splice(asteroidIndex, 1)
  })
  this.asteroidsToRemove = []
}

Game.prototype.update = function() {
  this.checkTime();
  this.ship.update()
  this.removeAsteroids()
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

Game.prototype.checkBulletCollision = function() {
  var bulletCoordinates = []
  this.ship.bullets.forEach(function(bullet) {
    bulletCoordinates.push(bullet.center);
  })
  var thisGame = this
  if (thisGame.ship.bullets.length > 0) {
    thisGame.asteroids.forEach(function(asteroid, asteroidIndex){
      thisGame.ship.bullets.forEach(function(bullet, bulletIndex){
        if ((bullet.center.x > asteroid.center.x - asteroid.radius + 5) &&
        (bullet.center.x < asteroid.center.x + asteroid.radius - 5) &&
        (bullet.center.y > asteroid.center.y - asteroid.radius + 5) &&
        (bullet.center.y < asteroid.center.y + asteroid.radius - 5)) {
          thisGame.ship.bullets.splice(bulletIndex, 1)
          thisGame.explodeAsteroid(asteroid)
          thisGame.asteroidsToRemove.push(asteroidIndex)
        }
      })
    })
  }
}

Game.prototype.explodeAsteroid = function(asteroid) {
  this.asteroidsDestroyed += 1
  this.calculateScore();
  if (asteroid.radius > 60) {
    this.createAsteroid(this.level, asteroid, 3)
  } else if (asteroid.radius > 30) {
    this.createAsteroid(this.level, asteroid, 2)
  }
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
  if (this.lives < 1) {
    this.ship.hidden = true
    this.ship.center = {x: -1000, y: -1000}
  }
  else if (this.time > this.deadTime + 60) {
    this.ship.hidden = false
    this.ship.point = {x: 350, y: 300}
    this.blinkShip();
  }
  else if (this.time > this.deadTime + 300) {
    this.dead = false
    this.ship.hidden = false
    this.deadTime = 0
  }
}

Game.prototype.endGame = function() {
  this.context.font="55px Verdana"
  this.context.fillText("Game Over", 350, 215)
  this.context.font="20px Verdana"
  this.context.fillText("Asteroids Destroyed: " + this.asteroidsDestroyed, 350, 265)
  this.context.fillText("Score: " + this.score, 350, 295)
}

Game.prototype.gameText = function() {
  this.context.textAlign = "center";
  if (this.started === false) {
    this.intro()
  }
  if (this.lives < 1){
    this.endGame();
  }
  this.calculateScore();
  this.context.font="15px Verdana"
  this.context.fillText("Level: " + this.level, 45, 25)
  this.context.fillText("Score: " + this.score, 635, 25)
  this.context.textAlign = "left";
  this.context.fillText(this.lifeChars[this.lives], 15, 45)
}

Game.prototype.calculateScore = function() {
  this.score = (this.level * this.asteroidsDestroyed * 10)
}

Game.prototype.intro = function() {
  this.context.font="45px Impact"
  this.context.fillText("ASTEROIDS", 350, 220)  
  this.introTime += 1
  if (this.introTime < 25 ){
    this.context.font="20px Verdana"
    this.context.fillText("Hit Enter to Start!", 350, 250)
  }
  else if (this.introTime > 50){
    this.introTime = 0
  }
}

module.exports = Game;
