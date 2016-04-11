let stampit = require('stampit');
let sounds = require('./sounds.js');

let GameRules = stampit.compose().refs().init().methods({
  update: function(player, game) {
    if (player.position.y < 0) {
      console.log('dead');
      sounds.die.play();
      game.paused = true;
    }
  }
});

module.exports = GameRules;