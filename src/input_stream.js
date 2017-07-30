let inputState = require("./input_state.js");
let Kefir = require('kefir');

var inputStream = Kefir.stream(emitter => {
  function inputLoop() {
    if (inputState.pressed("up")) { emitter.emit("up"); }
    if (inputState.pressed("right")) { emitter.emit("right"); }
    if (inputState.pressed("left")) { emitter.emit("left"); }
    if (inputState.pressed("down")) { emitter.emit("down"); }
    if (inputState.pressed("jump")) { emitter.emit("jump"); }
    if (inputState.pressed("run")) { emitter.emit("run"); }
    if (inputState.pressed("menu")) { emitter.emit("menu"); }
    if (inputState.pressed("edit")) { emitter.emit("edit"); }
    requestAnimationFrame(inputLoop);
  }

  inputLoop();
});

var menuStream  = inputStream.filter(x => x == "menu").debounce(50, {immediate: true});
var editStream  = inputStream.filter(x => x == "edit").debounce(50, {immediate: true});
var jumpStream  = inputStream.filter(x => x == "jump").debounce(50, {immediate: true});
var shootStream = inputStream.filter(x => x == "run").throttle(500, {trailing: false});

module.exports = {
  inputStream: inputStream,
  menuStream: menuStream,
  editStream: editStream,
  jumpStream: jumpStream,
  inputState: inputState,
  shootStream: shootStream
};
