let MouseState = require("./mouse_state.js");
let Kefir = require('kefir');
let sounds = require('./sounds');
let THREE = require('three');

let mouseState = MouseState.create({canvasId: "game-canvas"});

var mouseMoveStream = Kefir.stream(emitter => {
  mouseState.addMoveListener(function(x,y) {
    emitter.emit(new THREE.Vector2(x,y))
  });
});

var mouseClickStream = Kefir.stream(emitter => {
  mouseState.addMousedownListener(function(x,y) {
    emitter.emit(true);
  });

  mouseState.addMouseupListener(function(x,y) {
    emitter.emit(false);
  });
});

directionStream = mouseMoveStream.bufferWithCount(2).map((vectorArray) => {
  if (vectorArray[0].x > vectorArray[1].x) { return "left" }
  if (vectorArray[0].x < vectorArray[1].x) { return "right" }
  if (vectorArray[0].y > vectorArray[1].y) { return "down" }
  if (vectorArray[0].y < vectorArray[1].y) { return "up" }
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

