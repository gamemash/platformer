let sounds = require('./sounds.js');

let gameState = {
  paused: false,
  musicPlaying: false,

  playMusic: function() {
    musicPlaying = true;
    sounds.groundTheme.play();
  },

  stopMusic: function() {
    musicPlaying = false;
    sounds.groundTheme.pause();
    sounds.groundTheme.currentTime = 0;
  },

  togglePause: function() {
    sounds.pauseSound.pause();
    sounds.pauseSound.currentTime = 0;
    sounds.pauseSound.volume = 1;
    sounds.pauseSound.play();
    document.getElementById("game-wrapper").classList.toggle("paused");
    this.paused = ! this.paused;
  },

  toggleEdit: function() {
    this.editing = ! this.editing;
  }
};

module.exports = gameState;