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

    for(let entity of entities) {
      if (entity.dead) continue;
      if (!player.dead && PhysicsEngine.boundingBox(entity, player)) {
        //difference in current position and top of goomba
        let dy = (player.position.y - entity.position.y - entity.size.y);

        //time since it had that y position, assuming no acceleration
        let time = (dy / -player.velocity.y);

        //x position at that time
        let x = player.position.x + player.velocity.x * time;

        //that time point should be in the past. The position should be (player + size < x < entity + size)
        if (time < 0 && entity.position.x - player.size.x < x && x < entity.position.x + entity.size.x){
          player.killed(entity);
          entity.die();
          player.velocity.y = 17;
          sounds.stomp.play();
        } else {
          player.die();
        }
      }
    }
  }
});

module.exports = GameRules;
