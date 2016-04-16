let stampit = require('stampit');
let PhysicsEngine = require('./physics_engine.js');

let Collidable = stampit()
  .refs({
    physicsEngine: PhysicsEngine
  })
  .init(function(){
    this.physicsEngine.addObject(this);
  })
  .methods({
    collided: function(entity, direction) {}
  });

module.exports = Collidable;