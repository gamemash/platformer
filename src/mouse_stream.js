let MouseState = require("./mouse_state.js");
let Kefir = require('kefir');
let sounds = require('./sounds')

let mouseState = MouseState.create({canvasId: "game-canvas"});

var mouseMoveStream = Kefir.stream(emitter => {
  mouseState.addMoveListener(function(x,y) {
    emitter.emit([x,y])
  });
});

var mouseClickStream = Kefir.stream(emitter => {
  mouseState.addClickListener(function(x,y) {
    emitter.emit([x,y])
  });
});

directionStream = mouseMoveStream.bufferWithCount(2).map((x) => {
  if (x[0][0] > x[1][0]) { return "left" }
  if (x[0][0] < x[1][0]) { return "right" }
  if (x[0][1] > x[1][1]) { return "down" }
  if (x[0][1] < x[1][1]) { return "up" }
}).skipDuplicates();

shakeStream = directionStream.bufferWithTimeOrCount(600, 7).filter((x) => x.length == 7).map(() => {return "shake"})

shakeStream.onValue(() => {
  sounds.coin.pause();
  sounds.coin.currentTime = 0;
  sounds.coin.play();
});

module.exports = {
  mouseMoveStream: mouseMoveStream,
  mouseClickStream: mouseClickStream
}