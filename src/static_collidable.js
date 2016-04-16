let stampit = require('stampit');
let PhysicsEngine = require('./physics_engine.js');

let StaticCollidable = stampit()
  .refs({
    physicsEngine: PhysicsEngine
  })
  .init(function(){
    this.physicsEngine.addObject(this);
  }).methods({
    collided: function() {}
  });

module.exports = StaticCollidable;