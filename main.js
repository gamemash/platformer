"use strict";

let {inputStream, menuStream} = require("./src/input_stream.js");
let paused = false;

function renderLoop(){
  if (! paused) {
    // console.log("Game is running");
  }

  requestAnimationFrame(renderLoop);
}

renderLoop();

inputStream.log();

menuStream.onValue((x) => {
  document.getElementById("pause-menu").classList.toggle("visible");
  paused = ! paused;
  console.log("Menu pressed");
})