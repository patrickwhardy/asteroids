const chai = require('chai');
const assert = chai.assert;

const Bullet = require("../lib/bullet");

describe('Bullet', function(){
  context('with default attributes', function(){
    var bullet = new Bullet({ x: 350, y: 300, slope: {x: 0.01, y: -15}})

    it('has default size', function(){
      assert.equal(bullet.size.x, 4)
      assert.equal(bullet.size.y, 4)
    });

    it('has center', function(){
      assert.equal(bullet.center.x, 350)
      assert.equal(bullet.center.y, 300)
      assert.equal(bullet.center.slope.x, 0.01)
      assert.equal(bullet.center.slope.y, -15)
    });

    it('has speed of 1', function(){
      assert.equal(bullet.speed, 1)
    });

    it('accelerates', function(){
      bullet.accelerate();
      assert.equal(bullet.center.x, 350.005)
      assert.equal(bullet.center.y, 292.5)
    })
  });
})
