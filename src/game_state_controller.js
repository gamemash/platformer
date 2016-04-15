let {menuStream} = require("./input_stream.js");
let gameState = require('./game_state.js');

menuStream.onValue((x) => {
  gameState.togglePause();
});

document.getElementById('play-music').onclick = function() {
  gameState.playMusic();
};

document.getElementById('stop-music').onclick = function() {
  gameState.stopMusic();
};

