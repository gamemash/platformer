let stampit = require('stampit');
let sounds = require('./sounds.js');
let PhysicsEngine = require('./physics_engine.js');

let GameRules = stampit.compose().refs().init().methods({
  update: function(player, entities, game) {
    if (player.position.y < -2) {
      player.die();
    }

    for(let entity of entities) {
      if (entity.dead) continue;
      if (!player.dead && PhysicsEngine.boundingBox(entity, player)) {
        //difference in current position and top of goomba
        let dy = (player.position.y - entity.position.y - entity.size);

        //time since it had that y position, assuming no acceleration
        let time = (dy / -player.velocity.y);

        //x position at that time
        let x = player.position.x + player.velocity.x * time;

        //that time point should be in the past. The position should be (player + size < x < entity + size)
        if (time < 0 && entity.position.x - player.size < x && x < entity.position.x + entity.size){
          entity.die();
        } else {
          player.die();
        }
      }
    }
  }
});

module.exports = GameRules;
