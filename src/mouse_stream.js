let MouseState = require("./mouse_state.js");
let debug = require('./debug.js');
let Kefir = require('kefir');
let sounds = require('./sounds')

let mouseState = MouseState.create({canvasId: "game-canvas"});

var mouseStream = Kefir.stream(emitter => {
  mouseState.addListener(function(x,y) {
    emitter.emit([x,y])
  });
});

directionStream = mouseStream.bufferWithCount(2).map((x) => {
  if (x[0][0] > x[1][0]) {
    return "left"
  }

  if (x[0][0] < x[1][0]) {
    return "right"
  }

  if (x[0][1] > x[1][1]) {
    return "down"
  }

  if (x[0][1] < x[1][1]) {
    return "up"
  }
}).skipDuplicates();

directionStream.onValue((x) => {debug("mouse_direction", x)});
// directionStream.log();

shakeStream = directionStream.bufferWithTimeOrCount(600, 7).filter((x) => x.length == 7).map(() => {return "shake"})

shakeStream.onValue(() => {
  sounds.coin.pause();
  sounds.coin.currentTime = 0;
  sounds.coin.play();
});

module.exports = mouseStream;