let stampit = require('stampit');
let sounds = require('./sounds.js');

let boundingBox = function(obj_a, obj_b){
  return (
     obj_a.position.x < obj_b.position.x + obj_b.size   &&
     obj_a.position.x + obj_a.size > obj_b.position.x   &&
     obj_a.position.y < obj_b.position.y + obj_b.size   &&
     obj_a.size + obj_a.position.y > obj_b.position.y
  );
}

let GameRules = stampit.compose().refs().init().methods({
  update: function(player, entities, game) {
    if (player.position.y < -2) {
      player.die();
    }

    for(let entity of entities) {
      if (boundingBox(entity, player)) {
        player.die();
      }
    }
  }
});

module.exports = GameRules;