import Asteroid from "./asteroid";
import SpaceShip from "./spaceship";
import AlienShip from "./alien-ship";
import Buff from "./buff";

function Game(context, keyboard) {
  this.context = context;
  this.level = 1;
  this.asteroids = [];
  this.keyboard = keyboard;
  this.started = false;
  this.introTime = 0;
  this.lives = 3;
  this.lifeChars = ["", "A", "A A", "A A A", "A A A A", "A A A A A", "A A A A A A"];
  this.dead = false;
  this.deadTime = 0;
  this.spawnTime = 0;
  this.asteroidsToRemove = [];
  this.aliensToRemove = [];
  this.asteroidsDestroyed = 0;
  this.aliensDestroyed = 0;
  this.gameOver = false;
  this.alienShips = [];
  this.alienBullets = [];
  this.particles = [];
  this.ship = this.createShip();
  this.buff = new Buff(this.context);
  this.collision = new Audio("collision.wav");
}

Game.prototype.createShip = function () {
  return new SpaceShip(-1000, -1000, this.context, this.keyboard);
};

Game.prototype.consumeBuff = function() {
  this.buff.consumed = true;
  var buff = Math.random();
  if (buff > 0.7) {
    if (this.lives < 6) {
      this.lives += 1;
    }
  } else if (buff > 0.3) {
    this.ship.weapon = "rearWeapon";
  } else {
    this.ship.weapon = "scatterShot";
  }
};

Game.prototype.setBuff = function() {
  if (this.level % 2 === 0) {
    if (this.buff.consumed === true) {
      this.buff = new Buff(this.context);
    }
    if (this.time % 5 === 0) {
      this.buff.draw().moveBuff(this.time);
    }
  }
};


Game.prototype.createAlienShips = function() {
  if (this.level > 1 && this.time < 300) {
    while (this.alienShips.length < this.level / 3) {
      this.alienShips.push(new AlienShip(this.context, this.ship.point));
    }
  }
};

Game.prototype.clearBullets = function() {
  if (this.alienBullets.length > 50) {
    this.alienBullets.splice(0, 30);
  }
  if (this.ship.bullets.length > 50) {
    this.ship.bullets.splice(0, 30);
  }
};

Game.prototype.createAsteroid = function(level, asteroid, asteroidCount) {
  if (asteroidCount) {
    var i = 0;
    while (i < asteroidCount) {
      this.asteroids.push(new Asteroid(this.context,
        {x: (asteroid.center.x + i), y: (asteroid.center.y + i)},
        (asteroid.radius / 3)));
      i++;
    }
  }
  if (this.asteroids.length < level + 6) {
    this.asteroids.push(new Asteroid(this.context));
  }
};

Game.prototype.startGame = function() {
  this.started = true;
  this.ship.unHide();
  this.dead = false;
  this.gameOver = false;
  this.lives = 3;
  this.asteroidsDestroyed = 0;
  this.level = 1;
  this.score = 0;
  this.ship.speed = 0;
  this.time = 0;
};

Game.prototype.removeAsteroids = function() {
  var thisGame = this;
  this.asteroidsToRemove.forEach(function(asteroidIndex) {
    thisGame.asteroids.splice(asteroidIndex, 1);
  });
};

Game.prototype.renderExplosion = function() {
  this.particles.forEach(function(particle) {
    particle.draw().move();
  });

  this.asteroidsToRemove = [];
  if (this.particles.length > 100) {
    this.particles.splice(0, 50);
  }
};

Game.prototype.drawShip = function() {
  if (this.ship.invincible) {
    this.flashTime();
  } else {
    this.ship.draw().accelerate();
  }
};

Game.prototype.flashTime = function() {
  this.spawnTime += 1;
  if (this.spawnTime < 10) {
    this.ship.draw().accelerate();
  } else if (this.spawnTime > 20) {
    this.spawnTime = 0;
  }
};

Game.prototype.updateBullets = function() {
  this.clearBullets();
  var thisGame = this;
  if (this.time % 100 === 0) {
    this.alienShips.forEach(function(alien){
      thisGame.alienBullets.push(alien.fireWeapon({x: thisGame.ship.point.x, y: thisGame.ship.point.y}));
    });
  }
};

Game.prototype.renderBullets = function(bullets) {
  if (bullets.length > 0) {
    bullets.forEach(function(bullet){
      bullet.draw().accelerate();
    });
  }
};

Game.prototype.update = function() {
  this.updateLevel();
  this.createAsteroid(this.level);
  this.setBuff();
  this.createAlienShips();

  this.removeAsteroids();
  this.removeAliens();
  this.renderExplosion();

  this.updateBullets();

  this.checkCollisions();

  this.renderBullets(this.alienBullets);
  this.renderBullets(this.ship.bullets);

  var currentTime = this.time;

  this.ship.update(currentTime);
  this.drawShip();

  this.asteroids.forEach(function(asteroid){
    asteroid.draw().moveAsteroid();
  });

  this.alienShips.forEach(function(alienShip){
    alienShip.update(currentTime);
  });

  this.checkStatus();
};

Game.prototype.checkCollisions = function(){
  this.checkBulletToShipCollison();
  this.checkShipCollision();
  this.checkBulletCollision();
  this.checkAlienCollision();
  this.checkBulletToAlienCollision();
  this.checkBuffCollision();
};

Game.prototype.checkStatus = function() {
  if (this.keyboard.isDown(this.keyboard.KEYS.ENTER) && !this.started) {
    this.startGame();
  }
  if (this.keyboard.isDown(this.keyboard.KEYS.ENTER) && this.gameOver) {
    this.startGame();
  }
  if (this.dead && !this.gameOver) {
    this.respawnShip();
  }
};

Game.prototype.updateLevel = function(){
  if (this.started && !this.gameOver) {
    this.time += 1;
  }
  if (this.time > 1000){
    this.time = 0;
    this.level += 1;
  }
};


Game.prototype.checkCollision = function(penetrators, recievers){
  var thisGame = this;
  var hit = false;
  recievers.forEach(function(reciever){
    penetrators.forEach(function(penetrator){
      if ((penetrator.x > reciever.center.x - reciever.radius + 5) &&
         (penetrator.x < reciever.center.x + reciever.radius - 5) &&
         (penetrator.y > reciever.center.y - reciever.radius + 5) &&
         (penetrator.y < reciever.center.y + reciever.radius - 5)) {
          hit = true;
          thisGame.collision.play();
      }
    });
  });
  return hit;
};
Game.prototype.checkShipCollision = function(){
  if (this.checkCollision(this.ship.coordinates, this.asteroids) &&
  !this.ship.invincible) {
    this.killShip();
  }
};

Game.prototype.checkBuffCollision = function() {
  var shipCoordinates = [this.ship.point, this.ship.rightSide, this.ship.leftSide];
  var thisGame = this;
    shipCoordinates.forEach(function(coordinate){
      if ((coordinate.x > thisGame.buff.center.x - 5) &&
         (coordinate.x < thisGame.buff.center.x + 5) &&
         (coordinate.y > thisGame.buff.center.y - 5) &&
         (coordinate.y < thisGame.buff.center.y + 5)) {
          thisGame.consumeBuff();
    }
  });
};

Game.prototype.checkAlienCollision = function(){
  var shipCoordinates = [this.ship.point, this.ship.rightSide, this.ship.leftSide];
  var thisGame = this;
  this.alienShips.forEach(function(alien, index){
    shipCoordinates.forEach(function(coordinate){
      if (coordinate.x > alien.shipCenter.x - alien.radius + 2 &&
      coordinate.x < alien.shipCenter.x + alien.radius - 2 &&
      coordinate.y > alien.shipCenter.y - (alien.radius * 0.3) &&
      coordinate.y < alien.shipCenter.y + (alien.radius * 0.25) &&
      thisGame.ship.invincible === false ) {
        thisGame.killShip();
        thisGame.hitAlien(alien, index);
        thisGame.collision.play();
      }
    });
  });
};

Game.prototype.hitAsteroid = function(asteroid, index) {
  if (asteroid.hits === 3) {
    this.explodeAsteroid(asteroid);
    this.asteroidsToRemove.push(index);
    this.collision.play();
  } else {
    asteroid.hits += 1;
  }
};

Game.prototype.checkBulletCollision = function() {
  var thisGame = this;
  if (thisGame.ship.bullets.length > 0) {
    thisGame.ship.bullets.forEach(function(bullet, bulletIndex){
      thisGame.asteroids.forEach(function(asteroid, asteroidIndex){
        if ((bullet.center.x > asteroid.center.x - asteroid.radius + 5) &&
        (bullet.center.x < asteroid.center.x + asteroid.radius - 5) &&
        (bullet.center.y > asteroid.center.y - asteroid.radius + 5) &&
        (bullet.center.y < asteroid.center.y + asteroid.radius - 5)) {
          thisGame.ship.bullets.splice(bulletIndex, 1);
          thisGame.hitAsteroid(asteroid, asteroidIndex);
        }
      });
    });
  }
};

Game.prototype.checkBulletToAlienCollision = function() {
  var thisGame = this;
  if (thisGame.ship.bullets.length > 0) {
    thisGame.ship.bullets.forEach(function(bullet, bulletIndex){
      thisGame.alienShips.forEach(function(alien, alienIndex){
        if ((bullet.center.x > alien.shipCenter.x - alien.radius) &&
        (bullet.center.x < alien.shipCenter.x + alien.radius) &&
        (bullet.center.y > alien.shipCenter.y - (alien.radius * 0.3)) &&
        (bullet.center.y < alien.shipCenter.y + (alien.radius * 0.25))) {
          thisGame.ship.bullets.splice(bulletIndex, 1);
          thisGame.hitAlien(alien, alienIndex);
          thisGame.collision.play();
        }
      });
    });
  }
};

Game.prototype.checkBulletToShipCollison = function() {
  var ship = this.ship;
  var thisGame = this;
  this.alienBullets.forEach(function(bullet, bulletIndex){
    if ((bullet.center.x > ship.center.x - ship.radius) &&
    (bullet.center.x < ship.center.x + ship.radius) &&
    (bullet.center.y > ship.center.y - ship.radius) &&
    (bullet.center.y < ship.center.y + ship.radius)) {
      thisGame.alienBullets.splice(bulletIndex, 1);
      thisGame.killShip();
      thisGame.collision.play();
    }
  });
};

Game.prototype.hitAlien = function(alien, index) {
  if (alien.hits === 3) {
    this.aliensDestroyed += 1;
    this.calculateScore();
    this.aliensToRemove.push(index);
    this.particles = this.particles.concat(alien.explode());
    this.collision.play();
  } else {
    alien.hits += 1;
  }
};

Game.prototype.removeAliens = function() {
  var thisGame = this;
  this.aliensToRemove.forEach(function(alienIndex){
    thisGame.alienShips.splice(alienIndex, 1);
  });
  this.aliensToRemove = [];
};

Game.prototype.explodeAsteroid = function(asteroid) {
  this.asteroidsDestroyed += 1;
  this.calculateScore();
  if (asteroid.radius > 60) {
    this.createAsteroid(this.level, asteroid, 3);
  } else if (asteroid.radius > 30) {
    this.createAsteroid(this.level, asteroid, 2);
  }
  this.particles = this.particles.concat(asteroid.explode());
};

Game.prototype.killShip = function(){
  if (!this.dead) {
    this.particles = this.particles.concat(this.ship.explode());
    this.lives -= 1;
    this.dead = true;
    this.ship.hide();
    this.ship.orientation = 4.7123;
    this.ship.weapon = "normal";
    if (this.time > 759) {
      this.time = 750;
    }
    this.deadTime = this.time;
    if (this.lives === 0) {
      this.gameOver = true;
    }
  }
};

Game.prototype.respawnShip = function(){
  if (this.time < this.deadTime + 80) {
    this.ship.unHide();
  }

  this.ship.invincible = true;

  if (this.time > this.deadTime + 240) {
    this.dead = false;
    this.ship.invincible = false;
    this.deadTime = 0;
  }
};

Game.prototype.setHighScore = function(){
  this.highScore = localStorage.highScore || 0;
  if (this.score > this.highScore) { this.highScore = this.score; }
  localStorage.setItem("highScore", this.highScore);
};

Game.prototype.endGame = function() {
  this.setHighScore();
  this.context.font="55px Verdana";
  this.context.fillText("Game Over", 350, 140);
  this.context.font="20px Verdana";
  this.context.fillText("Asteroids Destroyed: " + this.asteroidsDestroyed, 350, 200);
  this.context.fillText("Alien Ships Destroyed: " + this.aliensDestroyed, 350, 235);
  this.context.fillText("Score: " + this.score, 350, 275);
  this.context.fillText("High Score: " + this.highScore, 350, 315 );
  this.context.fillText("Press Enter to Play Again", 350, 450);
  this.gameOver = true;
};

Game.prototype.gameText = function() {
  this.context.textAlign = "center";
  if (!this.started) {
    this.intro();
  }
  if (this.lives < 1){
    this.endGame();
  }
  this.calculateScore();
  this.context.font="15px Verdana";
  this.context.fillText("Level: " + this.level, 45, 25);
  this.context.fillText("Score: " + this.score, 635, 25);
  this.context.textAlign = "left";
  this.context.fillText(this.lifeChars[this.lives], 15, 45);
};

Game.prototype.calculateScore = function() {
  this.score = (this.level * this.asteroidsDestroyed * 10 + (this.aliensDestroyed * 30));
};

Game.prototype.intro = function() {
  this.context.font="45px Impact";
  this.context.fillText("ASTEROIDS", 350, 220);
  this.introTime += 1;
  if (this.introTime < 25 ){
    this.context.font="20px Verdana";
    this.context.fillText("Hit Enter to Start!", 350, 250);
  }
  else if (this.introTime > 50){
    this.introTime = 0;
  }
};

module.exports = Game;
