var canvas = document.getElementById("main-canvas");
var context = canvas.getContext("2d");
const Game = require("./game");
const Keyboard = require("./keyboard");

var game = new Game(context, new Keyboard());

requestAnimationFrame(function gameLoop() {
  console.log('in rAF');
  context.clearRect(0, 0, canvas.width, canvas.height);
  game.gameText();
  game.update();
  requestAnimationFrame(gameLoop);
});
