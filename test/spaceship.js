const chai = require('chai');
const assert = chai.assert;

const Bullet = require("../lib/bullet");
const SpaceShip = require('../lib/spaceship');

describe('Spaceship', function() {
  context('with default attributes', function() {
    var ship = new SpaceShip(350, 300, context);

    it('should have a point', function(){
      assert.equal(ship.point.x, 350);
      assert.equal(ship.point.y, 300);
    });

    it('should have rightSide', function(){
      assert.equal(ship.rightSide.x, 356.0905443508238)
      assert.equal(ship.rightSide.y, 319.6952814085163)
    });

    it('should have leftSide', function(){
      assert.equal(ship.leftSide.x, 343.90595075820596)
      assert.equal(ship.leftSide.y, 319.69419721868826)
    });

    it('should have no speed', function(){
      assert.equal(ship.speed, 0)
    });

    it('should be oriented vertically', function(){
      assert.equal(ship.orientation, 4.7123)
    });

    it('calculates slope', function(){
      ship.calculateSlope();
      assert.equal(ship.slope.x, 0.001779607691446472)
      assert.equal(ship.slope.y, -19.999999920824905)
    });

    it('accelerates properly', function(){
      ship.speed = 1
      ship.accelerate();
      assert.equal(ship.point.x, 350.0001779607691)
      assert.equal(ship.point.y, 298.0000000079175)
    });

    it('decelerates properly', function(){
      ship.speed = 1
      ship.decelerate();
      assert.equal(ship.speed, 0.985)
    });

    it('stops decelerating at 0', function(){
      ship.speed = 0
      ship.decelerate();
      assert.equal(ship.speed, 0)
    });

    it('fires bullets', function(){
      assert.equal(ship.fireBullet().constructor, Bullet)
    })

    it('checks checks position when exiting screen', function(){
      ship.hidden = false
      ship.point.y = -30
      ship.checkPosition();
      assert.equal(ship.point.y, 529)

      ship.point.y = 560
      ship.checkPosition();
      assert.equal(ship.point.y, 1)

      ship.point.x = -30
      ship.checkPosition();
      assert.equal(ship.point.x, 699)

      ship.point.x = 730
      ship.checkPosition();
      assert.equal(ship.point.x, 1)
    });

    it('finds rockets', function(){
      ship.findRockets();
      assert.equal(ship.rocketX, 0.9982203923085499)
      assert.equal(ship.rocketY, 20.999999920824912)
    })

    it('clears bullets every 100', function(){
      assert.equal(ship.bullets.length, 0)
      for (var i = 0; i < 100; i++) {
        ship.bullets.push(ship.fireBullet())
      }
      assert.equal(ship.bullets.length, 100)

      ship.clearBullets();

      assert.equal(ship.bullets.length, 100)
      ship.bullets.push(ship.fireBullet())
      ship.clearBullets();

      assert.equal(ship.bullets.length, 51)
    });

    it('finds its sides', function(){
      assert.equal(ship.rightSide.x, 356.0905443508238)

      ship.accelerate()

      assert.equal(ship.rightSide.x, 356.0905443508238)

      ship.findSides();

      assert.equal(ship.rightSide.x, 7.090544350823818)
    });

    it('calculates intertia', function(){
      assert.equal(ship.inertiaSlope.x, 0.0017796076914501358)

      ship.momentum += 3
      assert.equal(ship.inertiaSlope.x, 0.0017796076914501358)
      ship.inertia();

      assert.equal(ship.inertiaSlope.x, -2.82416194828558358)
    })
  });
})
