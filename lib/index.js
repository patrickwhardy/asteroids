var canvas = document.getElementById("main-canvas");
var context = canvas.getContext("2d");

context.beginPath();
context.moveTo(345, 300);
context.lineTo(355, 300);
context.lineTo(350, 320);
context.closePath();
context.strokeStyle="white";
context.stroke();
