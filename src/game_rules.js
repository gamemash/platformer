let stampit = require('stampit');
let sounds = require('./sounds.js');
let dead = false;
let GameRules = stampit.compose().refs().init().methods({
  update: function(player, game) {
    if (player.position.y < -2) {
      if (!dead){
        sounds.die.play();
        window.setTimeout(function() {
          player.position.x = 6;
          player.position.y = 5;
          player.acceleration.y = 0;
          player.velocity.y = 18;
          player.velocity.x = 2;
          sounds.kick.play();
          dead = false;
        }, 3000)
      }

      dead = true;
    }
  }
});

module.exports = GameRules;