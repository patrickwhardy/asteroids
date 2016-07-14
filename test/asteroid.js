const chai = require('chai');
const assert = chai.assert;

const Asteroid = require("../source/scripts/asteroid");

describe('Asteroid', function(){
  context('with default attributes', function(){
    var asteroid = new Asteroid();

    it('starts with a center off screen', function(){
      assert.equal(asteroid.center.x, -50);
      assert.equal(asteroid.center.y, -50);
    });

    it('has a random size', function(){
      var asteroid2 = new Asteroid();
      assert.notEqual(asteroid.radius, asteroid2.radius)
    });

    it('has a random slope', function(){
      var asteroid2 = new Asteroid();
      assert.notEqual(asteroid.slope.x, asteroid2.slope.x)
      assert.notEqual(asteroid.slope.y, asteroid2.slope.y)
    });

    it('moves in random direction', function(){
      var coordinates = {x: 300, y: 300}
      asteroid.center.x = 300
      asteroid.center.y = 300

      asteroid.moveAsteroid();
      assert.notEqual(asteroid.center.x, coordinates.x)
      assert.notEqual(asteroid.center.y, coordinates.y)
    });

    it('checks if its off screen', function(){
      asteroid.center.y = -1000
      asteroid.checkPosition();
      assert.equal(asteroid.center.y, 529 + asteroid.radius)

      asteroid.center.y = 1000
      asteroid.checkPosition();
      assert.equal(asteroid.center.y, 1 - asteroid.radius)

      asteroid.center.x = -1000
      asteroid.checkPosition();
      assert.equal(asteroid.center.x, 699 + asteroid.radius)

      asteroid.center.x = 1000
      asteroid.checkPosition();
      assert.equal(asteroid.center.x, 1 - asteroid.radius)
    })
  });
})
