var canvas = document.getElementById("main-canvas");
var context = canvas.getContext("2d");
const Game = require("./game")

var game = new Game(context);

requestAnimationFrame(function gameLoop() {
  context.clearRect(0, 0, canvas.width, canvas.height)
  game.gameText();
  // game.drawShip()
  // game.ship.decelerate();
  game.update()
  requestAnimationFrame(gameLoop)
})
