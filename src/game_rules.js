let stampit = require('stampit');
let sounds = require('./sounds.js');
let PhysicsEngine = require('./physics_engine.js');
let CollisionResponses = require('./collision_responses.js');

let GameRules = stampit.compose()
  .refs({
    time: 400,
  })
  .init().methods({
  resetTime: function(){
   this.time = 400;
  },
  update: function(player, entities, game) {
    if (this.levelInProgress){
      this.time -= 1/60 / 0.65;
    }
    if (this.time < 0 || player.position.y < -2) {
      player.die();
    }

    for (let a = 0; a < entities.length(); a += 1){
      let entity_a = entities.get(a);
      for (let b = a + 1; b < entities.length(); b += 1){
        let entity_b = entities.get(b);

        if (PhysicsEngine.boundingBox(entity_a, entity_b)){
          CollisionResponses.resolve(entity_a, entity_b);
        }
      }
    }
  }
});

module.exports = GameRules;
