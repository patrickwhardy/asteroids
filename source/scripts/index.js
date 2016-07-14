var canvas = document.getElementById("main-canvas");
var context = canvas.getContext("2d");
import Game from "./game";
import Keyboard from "./keyboard";

var game = new Game(context, new Keyboard());

requestAnimationFrame(function gameLoop() {
  context.clearRect(0, 0, canvas.width, canvas.height);
  game.gameText();
  game.update();
  requestAnimationFrame(gameLoop);
});
