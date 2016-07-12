const chai = require('chai');
const assert = chai.assert;

const Game = require("../lib/game");

describe('Game', function(){
  context('it is a game', function(){
    var game = new Game();

    it('has a level', function(){
      assert.equal(game.level, 1)
    })

    it('creates a ship off screen', function(){
      game.createShip();
      assert.equal(game.ship.point.x, -1000)
      assert.equal(game.ship.point.y, -1000)
    })

    it('creates asteroids with random slope', function(){
      assert.equal(game.asteroids.length, 0)

      game.createAsteroid(1);
      game.createAsteroid(1);

      var asteroid1 = game.asteroids[0]
      var asteroid2 = game.asteroids[1]

      assert.notEqual(asteroid1.slope.x, asteroid2.slope.x)
      assert.notEqual(asteroid1.slope.y, asteroid2.slope.y)
    })

    it('it creates smaller asteroids with unique attributes', function(){
      game.asteroids = []

      game.createAsteroid(1);

      var asteroid1 = game.asteroids[0]

      game.createAsteroid(1, asteroid1, 2)

      var asteroid2 = game.asteroids[1]
      var asteroid3 = game.asteroids[2]

      assert.equal(asteroid2.center.x, asteroid1.center.x)
      assert.equal(asteroid3.center.x, asteroid1.center.x + 1)

      assert.equal(asteroid2.radius, asteroid1.radius / 3)
    })

    it("removes asteroids", function(){
      game.asteroids = []

      game.createAsteroid(1);
      game.createAsteroid(1);
      game.createAsteroid(1);

      game.asteroidsToRemove.push(1);

      assert.equal(game.asteroids.length, 3);

      game.removeAsteroids();

      assert.equal(game.asteroids.length, 2);
    })

    it('checks game time on condition', function(){
      game.time = 0

      game.checkTime();
      assert.equal(game.time, 0);

      game.started = true;
      game.checkTime();
      assert.equal(game.time, 1);

      game.gameOver = true;
      game.checkTime();
      assert.equal(game.time, 1);
    })

    it('levels up after time reaches 1000', function(){
      game.level = 1
      game.time = 1001

      game.checkTime();

      assert.equal(game.time, 0);
      assert.equal(game.level, 2);
    })

    // it('checks ship collision', function(){
    //   game.checkShipCollision();
    //   assert.equal(game.ship.dead, false)
    // })
  })
})
