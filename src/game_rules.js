let stampit = require('stampit');
let sounds = require('./sounds.js');
let PhysicsEngine = require('./physics_engine.js');
let PointsAnimation = require('./points_animation.js');
let PlayerAnimations = require('./player_animations.js');

let GameRules = stampit.compose()
  .refs({
    time: 400, 
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

    for (let a = 0; a < entities.length(); a += 1){
      let entity_a = entities.get(a);
      for (let b = a + 1; b < entities.length(); b += 1){
        let entity_b = entities.get(b);
        
        if (PhysicsEngine.boundingBox(entity_a, entity_b)){
          let aHitBFromAbove = PhysicsEngine.hitFromAbove(entity_a, entity_b);
          let bHitAFromAbove = PhysicsEngine.hitFromAbove(entity_b, entity_a);
          if (entity_a.hitBy){
            entity_a.hitBy(entity_b, bHitAFromAbove, aHitBFromAbove);
          }
          if (entity_b.hitBy){
            entity_b.hitBy(entity_a, aHitBFromAbove, bHitAFromAbove);
          }
        }
      }
    }

    //for(let entity of entities) {
    //  if (entity.dead) continue;
    //  if (!player.dead && PhysicsEngine.boundingBox(entity, player)) {
    //    switch(entity.name){
    //      case 'Goomba':
    //      case 'Koopa':
    //        if (PhysicsEngine.hitFromAbove(player, entity)){
    //          player.killed(entity);
    //          entity.hitBy(player);
    //          player.velocity.y = 17;
    //          sounds.stomp.play();
    //        } else {
    //          if (player.invulnerable){
    //            break;
    //          }

    //          if (player.superMario){
    //            player.shrink();
    //          } else {
    //            player.die();
    //          }
    //        }
    //        break;
    //      case 'Mushroom':
    //        player.grow();
    //        PointsAnimation.create({game: player.game, points: 1000, subject: entity});
    //        entity.remove();
    //        player.score += 1000;
    //        player.statsChanged();
    //        break;
    //      case 'Flagpole':
    //        //shitty equation, need more number pictures...
    //        let points = Math.pow(2,Math.round(Math.sqrt(player.position.y - entity.position.y))) * 100;
    //        PointsAnimation.create({game: player.game, points: points, subject: player, duration: 2});
    //        PlayerAnimations.VictoryAnimation.create({game: player.game, subject: player, flagpole: entity});
    //        break;
    //    }
    //  }
    //}
  }
});

module.exports = GameRules;
