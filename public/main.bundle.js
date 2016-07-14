/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";

	var canvas = document.getElementById("main-canvas");
	var context = canvas.getContext("2d");
	var Game = __webpack_require__(1);
	var Keyboard = __webpack_require__(7);

	var game = new Game(context, new Keyboard());

	requestAnimationFrame(function gameLoop() {
	  context.clearRect(0, 0, canvas.width, canvas.height);
	  game.gameText();
	  game.update();
	  requestAnimationFrame(gameLoop);
	});

/***/ },
/* 1 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";

	var Asteroid = __webpack_require__(2);
	var SpaceShip = __webpack_require__(4);
	var AlienShip = __webpack_require__(6);

	function Game(context, keyboard) {
	  this.context = context;
	  this.level = 1;
	  this.asteroids = [];
	  this.keyboard = keyboard;
	  this.started = false;
	  this.introTime = 0;
	  this.lives = 3;
	  this.lifeChars = ["", "A", "A A", "A A A"];
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
	}

	Game.prototype.createShip = function () {
	  return new SpaceShip(-1000, -1000, this.context, this.keyboard);
	};

	Game.prototype.createAlienShips = function () {
	  if (this.level > 1 && this.time < 300) {
	    while (this.alienShips.length < this.level / 3) {
	      this.alienShips.push(new AlienShip(this.context, this.ship.point));
	    }
	  }
	};

	Game.prototype.clearBullets = function () {
	  if (this.alienBullets.length > 50) {
	    this.alienBullets.splice(0, 30);
	  }
	  if (this.ship.bullets.length > 50) {
	    this.ship.bullets.splice(0, 30);
	  }
	};

	Game.prototype.createAsteroid = function (level, asteroid, asteroidCount) {
	  console.log(this.asteroids.length);
	  if (asteroidCount) {
	    var i = 0;
	    while (i < asteroidCount) {
	      this.asteroids.push(new Asteroid(this.context, { x: asteroid.center.x + i, y: asteroid.center.y + i }, asteroid.radius / 3));
	      i++;
	    }
	  }
	  if (this.asteroids.length < level + 6) {
	    this.asteroids.push(new Asteroid(this.context));
	  }
	};

	Game.prototype.startGame = function () {
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

	Game.prototype.removeAsteroids = function () {
	  var thisGame = this;
	  this.asteroidsToRemove.forEach(function (asteroidIndex) {
	    thisGame.asteroids.splice(asteroidIndex, 1);
	  });
	};

	Game.prototype.renderExplosion = function () {
	  this.particles.forEach(function (particle) {
	    particle.draw().move();
	  });

	  this.asteroidsToRemove = [];
	  if (this.particles.length > 100) {
	    this.particles.splice(0, 50);
	  }
	};

	Game.prototype.drawShip = function () {
	  if (this.ship.invincible) {
	    this.flashTime();
	  } else {
	    this.ship.draw().accelerate();
	  }
	};

	Game.prototype.flashTime = function () {
	  this.spawnTime += 1;
	  if (this.spawnTime < 10) {
	    this.ship.draw().accelerate();
	  } else if (this.spawnTime > 20) {
	    this.spawnTime = 0;
	  }
	};

	Game.prototype.updateBullets = function () {
	  this.clearBullets();
	  var thisGame = this;
	  if (this.time % 100 === 0) {
	    this.alienShips.forEach(function (alien) {
	      thisGame.alienBullets.push(alien.fireWeapon({ x: thisGame.ship.point.x, y: thisGame.ship.point.y }));
	    });
	  }
	};

	Game.prototype.renderBullets = function (bullets) {
	  if (bullets.length > 0) {
	    bullets.forEach(function (bullet) {
	      bullet.draw().accelerate();
	    });
	  }
	};

	Game.prototype.update = function () {
	  this.updateTime();
	  this.createAsteroid(this.level);
	  this.createAlienShips();

	  this.removeAsteroids();
	  this.removeAliens();
	  this.renderExplosion();

	  this.updateBullets();

	  this.checkBulletToShipCollison();
	  this.checkShipCollision();
	  this.checkBulletCollision();
	  this.checkAlienCollision();
	  this.checkBulletToAlienCollision();

	  this.renderBullets(this.alienBullets);
	  this.renderBullets(this.ship.bullets);

	  var currentTime = this.time;

	  this.ship.update(currentTime);
	  this.drawShip();
	  this.ship.decelerate();

	  this.asteroids.forEach(function (asteroid) {
	    asteroid.draw().moveAsteroid();
	  });

	  this.alienShips.forEach(function (alienShip) {
	    alienShip.update(currentTime);
	  });

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

	// const conditions = {
	//   gameIsRunning: () => this.started && !this.gameOver
	// }

	Game.prototype.updateTime = function () {
	  // this.started && !this.gameOver -----> this is duplicated some places I think
	  // conditions.gameIsRunning
	  if (this.started && !this.gameOver) {
	    this.time += 1;
	  }
	  if (this.time > 1000) {
	    this.time = 0;
	    this.level += 1;
	  }
	};

	Game.prototype.checkShipCollision = function () {
	  var shipCoordinates = [this.ship.point, this.ship.rightSide, this.ship.leftSide];
	  // arrow functions
	  var thisGame = this;
	  var collision = new Audio("collision.wav");
	  this.asteroids.forEach(function (asteroid) {
	    shipCoordinates.forEach(function (coordinate) {
	      if (coordinate.x > asteroid.center.x - asteroid.radius + 5 && coordinate.x < asteroid.center.x + asteroid.radius - 5 && coordinate.y > asteroid.center.y - asteroid.radius + 5 && coordinate.y < asteroid.center.y + asteroid.radius - 5 && !thisGame.ship.invincible) {
	        thisGame.killShip();
	        collision.play();
	      }
	    });
	  });
	};

	Game.prototype.checkAlienCollision = function () {
	  // have shipCoords as an attribute on the prototype
	  var shipCoordinates = [this.ship.point, this.ship.rightSide, this.ship.leftSide];
	  var thisGame = this;
	  this.alienShips.forEach(function (alien, index) {
	    shipCoordinates.forEach(function (coordinate) {
	      if (coordinate.x > alien.shipCenter.x - alien.radius + 2 && coordinate.x < alien.shipCenter.x + alien.radius - 2 && coordinate.y > alien.shipCenter.y - alien.radius * 0.3 && coordinate.y < alien.shipCenter.y + alien.radius * 0.25 && thisGame.ship.invincible === false) {
	        thisGame.killShip();
	        thisGame.hitAlien(alien, index);
	      }
	    });
	  });
	};

	Game.prototype.hitAsteroid = function (asteroid, index) {
	  if (asteroid.hits === 3) {
	    this.explodeAsteroid(asteroid);
	    this.asteroidsToRemove.push(index);
	    var collision = new Audio("collision.wav");
	    collision.play();
	  } else {
	    asteroid.hits += 1;
	  }
	};

	Game.prototype.checkBulletCollision = function () {
	  var thisGame = this;
	  if (thisGame.ship.bullets.length > 0) {
	    thisGame.ship.bullets.forEach(function (bullet, bulletIndex) {
	      thisGame.asteroids.forEach(function (asteroid, asteroidIndex) {
	        if (bullet.center.x > asteroid.center.x - asteroid.radius + 5 && bullet.center.x < asteroid.center.x + asteroid.radius - 5 && bullet.center.y > asteroid.center.y - asteroid.radius + 5 && bullet.center.y < asteroid.center.y + asteroid.radius - 5) {
	          thisGame.ship.bullets.splice(bulletIndex, 1);
	          thisGame.hitAsteroid(asteroid, asteroidIndex);
	        }
	      });
	    });
	  }
	};

	Game.prototype.checkBulletToAlienCollision = function () {
	  var thisGame = this;
	  if (thisGame.ship.bullets.length > 0) {
	    thisGame.ship.bullets.forEach(function (bullet, bulletIndex) {
	      thisGame.alienShips.forEach(function (alien, alienIndex) {
	        if (bullet.center.x > alien.shipCenter.x - alien.radius && bullet.center.x < alien.shipCenter.x + alien.radius && bullet.center.y > alien.shipCenter.y - alien.radius * 0.3 && bullet.center.y < alien.shipCenter.y + alien.radius * 0.25) {
	          thisGame.ship.bullets.splice(bulletIndex, 1);
	          thisGame.hitAlien(alien, alienIndex);
	        }
	      });
	    });
	  }
	};
	// seems to be some duplication
	Game.prototype.checkBulletToShipCollison = function () {
	  var ship = this.ship;
	  var thisGame = this;
	  this.alienBullets.forEach(function (bullet, bulletIndex) {
	    if (bullet.center.x > ship.center.x - ship.radius && bullet.center.x < ship.center.x + ship.radius && bullet.center.y > ship.center.y - ship.radius && bullet.center.y < ship.center.y + ship.radius) {
	      thisGame.alienBullets.splice(bulletIndex, 1);
	      thisGame.killShip();
	    }
	  });
	};

	Game.prototype.hitAlien = function (alien, index) {
	  if (alien.hits === 3) {
	    this.aliensDestroyed += 1;
	    this.calculateScore();
	    this.aliensToRemove.push(index);
	    this.particles = this.particles.concat(alien.explode());
	    var collision = new Audio("collision.wav");
	    collision.play();
	  } else {
	    alien.hits += 1;
	  }
	};

	Game.prototype.removeAliens = function () {
	  var thisGame = this;
	  this.aliensToRemove.forEach(function (alienIndex) {
	    thisGame.alienShips.splice(alienIndex, 1);
	  });
	  this.aliensToRemove = [];
	};

	Game.prototype.explodeAsteroid = function (asteroid) {
	  this.asteroidsDestroyed += 1;
	  this.calculateScore();
	  if (asteroid.radius > 60) {
	    this.createAsteroid(this.level, asteroid, 3);
	  } else if (asteroid.radius > 30) {
	    this.createAsteroid(this.level, asteroid, 2);
	  }
	  this.particles = this.particles.concat(asteroid.explode());
	};

	Game.prototype.killShip = function () {
	  if (!this.dead) {
	    var collision = new Audio("collision.wav");
	    this.particles = this.particles.concat(this.ship.explode());
	    collision.play();
	    this.lives -= 1;
	    this.dead = true;
	    this.ship.hide();
	    this.ship.orientation = 4.7123;
	    if (this.time > 759) {
	      this.time = 750;
	    }
	    this.deadTime = this.time;
	    if (this.lives === 0) {
	      this.gameOver = true;
	    }
	  }
	};

	Game.prototype.respawnShip = function () {
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

	Game.prototype.setHighScore = function () {
	  this.highScore = localStorage.highScore || 0;
	  if (this.score > this.highScore) {
	    this.highScore = this.score;
	  }
	  localStorage.setItem("highScore", this.highScore);
	};

	Game.prototype.endGame = function () {
	  this.setHighScore();
	  this.context.font = "55px Verdana";
	  this.context.fillText("Game Over", 350, 140);
	  this.context.font = "20px Verdana";
	  this.context.fillText("Asteroids Destroyed: " + this.asteroidsDestroyed, 350, 200);
	  this.context.fillText("Alien Ships Destroyed: " + this.aliensDestroyed, 350, 235);
	  this.context.fillText("Score: " + this.score, 350, 275);
	  this.context.fillText("High Score: " + this.highScore, 350, 315);
	  this.context.fillText("Press Enter to Play Again", 350, 450);
	  this.gameOver = true;
	};

	Game.prototype.gameText = function () {
	  this.context.textAlign = "center";
	  if (!this.started) {
	    this.intro();
	  }
	  if (this.lives < 1) {
	    this.endGame();
	  }
	  this.calculateScore();
	  this.context.font = "15px Verdana";
	  this.context.fillText("Level: " + this.level, 45, 25);
	  this.context.fillText("Score: " + this.score, 635, 25);
	  this.context.textAlign = "left";
	  this.context.fillText(this.lifeChars[this.lives], 15, 45);
	};

	Game.prototype.calculateScore = function () {
	  this.score = this.level * this.asteroidsDestroyed * 10 + this.aliensDestroyed * 30;
	};

	Game.prototype.intro = function () {
	  this.context.font = "45px Impact";
	  this.context.fillText("ASTEROIDS", 350, 220);
	  this.introTime += 1;
	  if (this.introTime < 25) {
	    this.context.font = "20px Verdana";
	    this.context.fillText("Hit Enter to Start!", 350, 250);
	  } else if (this.introTime > 50) {
	    this.introTime = 0;
	  }
	};

	module.exports = Game;

/***/ },
/* 2 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";

	var Particle = __webpack_require__(3);
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

	function Asteroid(context, center, radius) {
	  if (center === undefined) center = { x: -50, y: -50 };

	  this.center = center;
	  if (radius) {
	    this.radius = radius;
	  } else {
	    this.setRadius();
	  }
	  this.context = context;
	  this.slope = { x: Math.random() * 2 - 1, y: Math.random() * 2 - 1 };
	  this.hits = 0;
	}

	Asteroid.prototype.setRadius = function () {
	  this.radius = Math.random() * 80;
	  if (this.radius < 10) {
	    this.radius = 20;
	  }
	};

	Asteroid.prototype.explode = function () {
	  var i = 0;
	  var particles = [];
	  var thisAsteroid = this;
	  while (this.radius / 2 > i) {
	    particles.push(new Particle({ x: thisAsteroid.center.x, y: thisAsteroid.center.y }, { x: thisAsteroid.center.x + i, y: thisAsteroid.center.y + i }, thisAsteroid.context));
	    i++;
	  }
	  return particles;
	};

	Asteroid.prototype.draw = function () {
	  this.checkPosition();
	  this.context.fillStyle = "white";
	  this.context.beginPath();
	  this.context.moveTo(this.center.x + this.radius, this.center.y);
	  this.context.lineTo(this.center.x + this.radius * 0.8, this.center.y + this.radius * 0.6);
	  this.context.lineTo(this.center.x + this.radius * 0.5, this.center.y + this.radius * 0.85);
	  this.context.lineTo(this.center.x + this.radius * 0.3, this.center.y + this.radius * 0.95);
	  this.context.lineTo(this.center.x + this.radius * 0.12, this.center.y + this.radius);
	  this.context.lineTo(this.center.x - this.radius * 0.2, this.center.y + this.radius);
	  this.context.lineTo(this.center.x - this.radius * 0.5, this.center.y + this.radius * 0.8);
	  this.context.lineTo(this.center.x - this.radius * 0.8, this.center.y + this.radius * 0.6);
	  this.context.lineTo(this.center.x - this.radius, this.center.y + this.radius * 0.4);
	  this.context.lineTo(this.center.x - this.radius, this.center.y);
	  this.context.lineTo(this.center.x - this.radius * 0.7, this.center.y - this.radius * 0.7);
	  this.context.lineTo(this.center.x - this.radius * 0.4, this.center.y - this.radius * 0.85);
	  this.context.lineTo(this.center.x - this.radius * 0.15, this.center.y - this.radius);
	  this.context.lineTo(this.center.x + this.radius * 0.3, this.center.y - this.radius);
	  this.context.lineTo(this.center.x + this.radius * 0.7, this.center.y - this.radius * 0.7);
	  this.context.closePath();

	  this.context.stroke();
	  return this;
	};

	Asteroid.prototype.moveAsteroid = function () {
	  this.center.x += this.slope.x;
	  this.center.y += this.slope.y;
	  return this;
	};
	// math module?
	Asteroid.prototype.checkPosition = function () {
	  if (this.center.y < this.radius * -2) {
	    this.center.y = 529 + this.radius;
	  }
	  if (this.center.y > 530 + this.radius) {
	    this.center.y = 1 - this.radius;
	  }
	  if (this.center.x < this.radius * -2) {
	    this.center.x = 699 + this.radius;
	  }
	  if (this.center.x > 700 + this.radius) {
	    this.center.x = 1 - this.radius;
	  }
	};

	module.exports = Asteroid;

/***/ },
/* 3 */
/***/ function(module, exports) {

	"use strict";

	function Particle(startingPoint, center, context) {
	  this.size = { x: 2, y: 2 };
	  this.center = center;
	  this.startPoint = startingPoint;
	  this.context = context;
	  this.speed = 0;
	  this.slope = { x: Math.random() * 2 - 1, y: Math.random() * 2 - 1 };
	}

	Particle.prototype.move = function () {
	  var xDifference = Math.abs(this.center.x) - Math.abs(this.startPoint.x);
	  var yDifference = Math.abs(this.center.y) - Math.abs(this.startPoint.y);
	  if (xDifference < 20 && yDifference < 20) {
	    this.center.x += this.slope.x;
	    this.center.y += this.slope.y;
	  } else {
	    this.center.x = 900;
	    this.center.y = 900;
	    this.slope = { x: 0, y: 0 };
	  }
	};

	Particle.prototype.draw = function () {
	  this.context.fillStyle = "white";
	  this.context.fillRect(this.center.x - this.size.x / 2, this.center.y - this.size.y / 2, this.size.x, this.size.y);
	  return this;
	};

	module.exports = Particle;

/***/ },
/* 4 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";

	var Bullet = __webpack_require__(5);
	var Particle = __webpack_require__(3);

	function SpaceShip(x, y, context, keyboard) {
	  this.orientation = 4.7123;
	  this.momentum = this.orientation;
	  this.point = { x: x, y: y };
	  this.findSides();
	  this.speed = 0;
	  this.context = context;
	  this.keyboard = keyboard;
	  this.bullets = [];
	  this.coolDown = 0;
	  this.hidden = true;
	  this.invincible = false;
	  this.radius = 8;
	  this.center = { x: 350, y: 313 };
	}

	SpaceShip.prototype.explode = function () {
	  var i = 0;
	  var particles = [];
	  var thisShip = this;
	  while (20 > i) {
	    particles.push(new Particle({ x: thisShip.center.x, y: thisShip.center.y }, { x: thisShip.center.x + i, y: thisShip.center.y + i }, thisShip.context));
	    i++;
	  }
	  return particles;
	};

	SpaceShip.prototype.calculateSlope = function () {
	  this.findCenter();
	  this.slope = { x: this.point.x - this.center.x, y: this.point.y - this.center.y };
	};

	SpaceShip.prototype.findCenter = function () {
	  this.center.x = this.point.x + Math.cos(this.orientation) * 12;
	  this.center.y = this.point.y - Math.sin(this.orientation) * 12;
	};

	SpaceShip.prototype.decelerate = function () {
	  // this.speed = this.speed > 0 ? (this.speed -= 0.015) : 0;

	  if (this.speed > 0) {
	    this.speed -= 0.015;
	  }
	  if (this.speed < 0) {
	    this.speed = 0;
	  }
	};

	SpaceShip.prototype.draw = function () {
	  this.checkPosition();
	  this.findSides();

	  this.context.beginPath();
	  this.context.moveTo(this.point.x, this.point.y);
	  this.context.lineTo(this.rightSide.x, this.rightSide.y);
	  this.context.lineTo(this.leftSide.x, this.leftSide.y);
	  this.context.closePath();
	  this.context.strokeStyle = "white";
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

	SpaceShip.prototype.inertia = function () {
	  var inertiaX = this.point.x + Math.cos(this.momentum) * 20;
	  var inertiaY = this.point.y - Math.sin(this.momentum) * 20;
	  this.inertiaSlope = { x: this.point.x - inertiaX, y: this.point.y - inertiaY };
	};

	SpaceShip.prototype.accelerate = function () {
	  this.inertia();
	  this.point.x += this.speed * this.inertiaSlope.x / 10;
	  this.point.y += this.speed * this.inertiaSlope.y / 10;
	};

	SpaceShip.prototype.findSides = function () {
	  // have math module so you don't have to look at the math in here
	  this.rightSide = { x: this.point.x + Math.cos(this.orientation + 0.3) * 20.6155, y: this.point.y - Math.sin(this.orientation + 0.3) * 20.6155 };
	  this.leftSide = { x: this.point.x + Math.cos(this.orientation - 0.3) * 20.6155, y: this.point.y - Math.sin(this.orientation - 0.3) * 20.6155 };
	};

	SpaceShip.prototype.fireBullet = function () {
	  this.coolDown = 7;
	  return new Bullet({ x: this.point.x, y: this.point.y, slope: this.slope }, this.context);
	};

	SpaceShip.prototype.checkPosition = function () {
	  if (this.hidden === false) {
	    if (this.point.y < -20) {
	      this.point.y = 529;
	    };
	    if (this.point.y > 550) {
	      this.point.y = 1;
	    };
	    if (this.point.x < -20) {
	      this.point.x = 699;
	    };
	    if (this.point.x > 720) {
	      this.point.x = 1;
	    };
	  }
	};

	SpaceShip.prototype.clearBullets = function () {
	  if (this.bullets.length > 100) {
	    this.bullets.splice(49, 50);
	  }
	};

	SpaceShip.prototype.thrusters = function () {
	  var rightThruster = { x: this.point.x + Math.cos(this.orientation + 0.2) * 20.6155, y: this.point.y - Math.sin(this.orientation + 0.3) * 20.6155 };
	  var leftThruster = { x: this.point.x + Math.cos(this.orientation - 0.2) * 20.6155, y: this.point.y - Math.sin(this.orientation - 0.3) * 20.6155 };

	  // move to draw() function or some sort of helper
	  // drawThruster(args);
	  this.context.beginPath();
	  this.context.moveTo(this.point.x + Math.cos(this.orientation) * 30, this.point.y - Math.sin(this.orientation) * 30);
	  this.context.lineTo(rightThruster.x + Math.cos(this.orientation), rightThruster.y - Math.sin(this.orientation));
	  this.context.lineTo(leftThruster.x + Math.cos(this.orientation), leftThruster.y - Math.sin(this.orientation));
	  this.context.closePath();
	  this.context.fillStyle = "white";
	  this.context.fill();
	};

	SpaceShip.prototype.hide = function () {
	  this.hidden = true;
	  this.point = { x: -1000, y: -1000 };
	};

	SpaceShip.prototype.unHide = function () {
	  this.hidden = false;
	  this.point = { x: 350, y: 300 };
	};

	SpaceShip.prototype.update = function (time) {
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
	        this.speed = 1.75 / (difference + 1);
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
	    } else {
	      this.coolDown -= 1;
	    }
	  }
	};

	// const drawThruster = () => {
	//
	// }

	module.exports = SpaceShip;

/***/ },
/* 5 */
/***/ function(module, exports) {

	"use strict";

	function Bullet(center, context) {
	  this.size = { x: 4, y: 4 };
	  this.center = center;
	  this.context = context;
	  this.speed = 1;
	}

	Bullet.prototype.draw = function () {
	  this.context.fillStyle = "white";
	  this.context.fillRect(this.center.x - this.size.x / 2, this.center.y - this.size.y / 2, this.size.x, this.size.y);
	  return this;
	};

	Bullet.prototype.accelerate = function () {
	  if (this.withinBounds() === true) {
	    this.center.x += this.speed * this.center.slope.x / 1.5;
	    this.center.y += this.speed * this.center.slope.y / 1.5;
	  } else {
	    this.center.x = 900;
	    this.center.y = 900;
	    this.center.slope = { x: 0, y: 0 };
	  }
	};

	Bullet.prototype.withinBounds = function () {
	  if (this.center.x > 0 && this.center.x < 700 && this.center.y > 0 && this.center.y < 530) {
	    return true;
	  }
	};

	module.exports = Bullet;

/***/ },
/* 6 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";

	var Bullet = __webpack_require__(5);
	var Particle = __webpack_require__(3);

	function AlienShip(context, opponent) {
	  this.shipCenter = { x: -50, y: -50 };
	  this.speed = 1;
	  this.context = context;
	  this.slope = { x: Math.random() * 2 - 1, y: Math.random() * 2 - 1 };
	  this.hits = 0;
	  this.radius = this.setRadius();
	}

	AlienShip.prototype.update = function (time) {
	  if (time % 100 === 0) {
	    this.changeDirection();
	  }
	  this.drawAlien().moveAlienShip();
	};

	AlienShip.prototype.explode = function () {
	  var i = 0;
	  var particles = [];
	  var thisAlien = this;
	  while (this.radius / 2 > i) {
	    particles.push(new Particle({ x: thisAlien.shipCenter.x, y: thisAlien.shipCenter.y }, { x: thisAlien.shipCenter.x + i, y: thisAlien.shipCenter.y + i }, thisAlien.context));
	    i++;
	  }
	  return particles;
	};

	AlienShip.prototype.fireWeapon = function (opponent) {
	  return new Bullet({ x: this.shipCenter.x, y: this.shipCenter.y, slope: this.findOpponent(opponent) }, this.context);
	};

	AlienShip.prototype.findOpponent = function (opponent) {
	  var y = (this.shipCenter.y - opponent.y) * -1;
	  var x = this.shipCenter.x - opponent.x;
	  while (Math.abs(y) > 4 || Math.abs(x) > 4) {
	    y *= 0.9;
	    x *= 0.9;
	  }
	  return { x: x, y: y };
	};

	AlienShip.prototype.setRadius = function () {
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

	AlienShip.prototype.changeDirection = function () {
	  this.slope = { x: Math.random() * 2 - 1, y: Math.random() * 2 - 1 };
	};

	AlienShip.prototype.moveAlienShip = function () {
	  this.shipCenter.x += this.slope.x + this.speed;
	  this.shipCenter.y += this.slope.y + this.speed;
	  return this;
	};

	AlienShip.prototype.drawAlien = function () {
	  this.checkPosition();
	  this.context.strokeStyle = "white";
	  this.context.beginPath();
	  this.context.moveTo(this.shipCenter.x - this.radius, this.shipCenter.y);
	  this.context.lineTo(this.shipCenter.x + this.radius, this.shipCenter.y);
	  this.context.lineTo(this.shipCenter.x + this.radius - this.radius * 0.5, this.shipCenter.y - this.radius * .25);
	  this.context.arc(this.shipCenter.x, this.shipCenter.y - this.radius * 0.25, this.radius * .25, 3.1, 2 * Math.PI);
	  this.context.lineTo(this.shipCenter.x - this.radius * 0.5, this.shipCenter.y - this.radius * .25);
	  this.context.lineTo(this.shipCenter.x - this.radius, this.shipCenter.y);
	  this.context.lineTo(this.shipCenter.x - this.radius * 0.625, this.shipCenter.y + this.radius * 0.25);
	  this.context.lineTo(this.shipCenter.x + this.radius - this.radius * 0.375, this.shipCenter.y + this.radius * 0.25);
	  this.context.lineTo(this.shipCenter.x + this.radius, this.shipCenter.y);
	  this.context.stroke();
	  return this;
	};

	AlienShip.prototype.checkPosition = function () {
	  if (this.shipCenter.x < -50) {
	    this.shipCenter.x = 700;
	  }
	  if (this.shipCenter.x > 700) {
	    this.shipCenter.x = -50;
	  }
	  if (this.shipCenter.y < -50) {
	    this.shipCenter.y = 530;
	  }
	  if (this.shipCenter.y > 580) {
	    this.shipCenter.y = -50;
	  }
	};

	module.exports = AlienShip;

/***/ },
/* 7 */
/***/ function(module, exports) {

	"use strict";

	function Keyboard() {
	  var keyState = {};

	  window.onkeydown = function (event) {
	    keyState[event.keyCode] = true;
	  };

	  window.onkeyup = function (event) {
	    keyState[event.keyCode] = false;
	  };

	  this.isDown = function (keyCode) {
	    return keyState[keyCode] === true;
	  };
	  // this.isDown = (keyCode) => {
	  //   return keyState[keyCode] === true;
	  // };

	  this.KEYS = { LEFT: 37, RIGHT: 39, UP: 38, SPACE: 32, ENTER: 13 };
	}

	module.exports = Keyboard;

	// () => {}
	// function() {}

/***/ }
/******/ ]);