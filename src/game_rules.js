let stampit = require('stampit');
let sounds = require('./sounds.js');
let PhysicsEngine = require('./physics_engine.js');
let PointsAnimation = require('./points_animation.js');

let GameRules = stampit.compose()
  .refs({
    time: 4, 
  })
  .init().methods({
  resetTime: function(){
   this.time = 400;
  },
  update: function(player, entities, game) {
    this.time -= 1/60 / 0.65;
    if (this.time < 0 || player.position.y < -2) {
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
              if (player.invulnerable){
                break;
              }

              if (player.superMario){
                player.shrink();
              } else {
                player.die();
              }
            }
            break;
          case 'Mushroom':
            player.grow();
            PointsAnimation.create({game: player.game, points: 1000, subject: entity});
            entity.remove();
            player.score += 1000;
            player.statsChanged();
            break;
        }
      }
    }
  }
});

module.exports = GameRules;
