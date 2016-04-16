let stampit = require('stampit');
let sounds = require('./sounds.js');
let PhysicsEngine = require('./physics_engine.js');

let GameRules = stampit.compose()
  .refs({
    time: 400,
  })
  .init().methods({
  update: function(player, entities, game) {
    this.time -= 1/60 / 0.65;
    if (player.position.y < -2) {
      player.die();
    }
  }
});

module.exports = GameRules;
