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
        switch(entity.name){
          case 'Goomba':
            if (PhysicsEngine.hitFromAbove(player, entity)){
              player.killed(entity);
              entity.die();
              player.velocity.y = 17;
              sounds.stomp.play();
            } else {
              player.die();
            }
            break;
          case 'Mushroom':
            player.grow();
            entity.remove();
            break;
        }
      }
    }
  }
});

module.exports = GameRules;
