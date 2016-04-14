let stampit = require('stampit');
let sounds = require('./sounds.js');
let PhysicsEngine = require('./physics_engine.js');

let GameRules = stampit.compose().refs().init().methods({
  update: function(player, entities, game) {
    if (player.position.y < -2) {
      player.die();
    }

    for(let entity of entities) {
      if (PhysicsEngine.boundingBox(entity, player)) {
        player.die();
      }
    }
  }
});

module.exports = GameRules;
