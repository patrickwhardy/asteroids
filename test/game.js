const chai = require('chai');
const assert = chai.assert;

const Game = require("../lib/game");

describe('Game', function(){
  context('it is a game', function(){
    var game = new Game();

    it('has a level', function(){
      assert.equal(game.level, 1)
    })
  })
})
