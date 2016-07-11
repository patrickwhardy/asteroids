const Asteroid = require("./asteroid");
const Keyboard = require("./keyboard");
const SpaceShip = require("./spaceship");
var io = require("socket.io");
var socket;

function Game(context, keyboard) {
  this.context = context;
  this.level = 1;
  this.asteroids = [];
  this.keyboard = keyboard
  this.createShip();
  this.started = false;
  this.introTime = 0;
  this.lives = 3;
  this.lifeChars = ["", "A", "A A", "A A A"];
  this.deadTime = 0
  this.spawnTime = 0
  this.asteroidsToRemove = []
  this.asteroidsDestroyed = 0
  this.gameOver = false
  socket = io.connect("http://localhost", {port: 8000, transports: ["websocket"]});
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
  }
  if (this.asteroids.length -1 < level + 7) {
    this.asteroids.push(new Asteroid(this.context));
  }
}

Game.prototype.startGame = function() {
  this.started = true;
  this.unHideShip()
  this.dead = false;

  this.gameOver = false
  this.lives = 3
  this.asteroidsDestroyed = 0
  this.level = 1
  this.ship.speed = 0
  this.time = 0
}

Game.prototype.removeAsteroids = function() {
  var thisGame = this
  this.asteroidsToRemove.forEach(function(asteroidIndex){
    thisGame.asteroids.splice(asteroidIndex, 1)
  })
  this.asteroidsToRemove = []
}

Game.prototype.drawShip = function() {
  if (this.ship.invincible === true) {
    this.flashTime()
  } else {
    this.ship.draw().accelerate();
  }
}

Game.prototype.flashTime = function() {
  this.spawnTime += 1
  if (this.spawnTime < 10) {
    this.ship.draw().accelerate();
  } else if (this.spawnTime > 20) {
    this.spawnTime = 0
  }
}

Game.prototype.update = function() {
  this.checkTime();
  this.removeAsteroids()
    this.ship.update(this.time)
  if (this.keyboard.isDown(this.keyboard.KEYS.ENTER) && this.started === false) {
    this.startGame()
  }
  if (this.keyboard.isDown(this.keyboard.KEYS.ENTER) && this.gameOver === true) {
    this.startGame();
  }
  if (this.dead === true && this.gameOver === false) {
    this.respawnShip();
  }
}

Game.prototype.checkTime = function(){
  if (this.started === true && this.gameOver === false) { this.time += 1 }
  if (this.time > 1000){
    this.time = 0
    this.level += 1
  }
}

Game.prototype.checkShipCollision = function(){
  var shipCoordinates = [this.ship.point, this.ship.rightSide, this.ship.leftSide]
  var thisGame = this
  var collision = new Audio("collision.wav");
  this.asteroids.forEach(function(asteroid){
    shipCoordinates.forEach(function(coordinate){
      if ((coordinate.x > asteroid.center.x - asteroid.radius + 5) &&
      (coordinate.x < asteroid.center.x + asteroid.radius - 5) &&
      (coordinate.y > asteroid.center.y - asteroid.radius + 5) &&
      (coordinate.y < asteroid.center.y + asteroid.radius - 5)) {
        if (thisGame.ship.invincible === false) {
          thisGame.killShip();
          collision.play()
        }
      }
    })
  })
}

Game.prototype.hitAsteroid = function(asteroid, index) {
  if (asteroid.hits === 3) {
    this.explodeAsteroid(asteroid)
    this.asteroidsToRemove.push(index)
    var collision = new Audio("collision.wav");
    collision.play();
  } else {
    asteroid.hits += 1
  }
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
          thisGame.hitAsteroid(asteroid, asteroidIndex)
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
  this.lives -= 1
  this.dead = true
  this.hideShip()
  this.ship.orientation = 4.7123;
  if (this.time > 759) {
    this.time = 750
  }
  this.deadTime = this.time
  if (this.lives === 0) {
    this.gameOver = true
  }
}

Game.prototype.hideShip = function() {
  this.ship.hidden = true
  this.ship.point = {x: -1000, y: -1000}
}

Game.prototype.unHideShip = function() {
  this.ship.hidden = false
  this.ship.point = {x: 350, y: 300}
}

Game.prototype.blinkShip = function() {
  this.ship.invincible = true
}

Game.prototype.respawnShip = function(){
  if (this.time > this.deadTime + 60) {
    if (this.time < this.deadTime + 80) {
      this.unHideShip()
    }
    this.blinkShip();
  }
  if (this.time > this.deadTime + 240) {
    this.dead = false
    this.ship.invincible = false
    this.deadTime = 0;
  }
}

Game.prototype.endGame = function() {
  this.context.font="55px Verdana"
  this.context.fillText("Game Over", 350, 215)
  this.context.font="20px Verdana"
  this.context.fillText("Press Enter to Play Again", 350, 450)
  this.context.fillText("Asteroids Destroyed: " + this.asteroidsDestroyed, 350, 275)
  this.context.fillText("Score: " + this.score, 350, 310)
  this.gameOver = true
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

function onSocketConnected() {
    console.log("Connected to socket server");
};

function onSocketDisconnect() {
    console.log("Disconnected from socket server");
};

function onNewPlayer(data) {
    console.log("New player connected: "+data.id);
};

function onMovePlayer(data) {

};

function onRemovePlayer(data) {

};

module.exports = Game;
