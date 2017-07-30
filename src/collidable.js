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
    collided: function(entity, direction) {},
    remove: function(){
      this.game.renderer.deleteFromScene(this.mesh);
      this.mesh.geometry.dispose();
      this.mesh.material.dispose();
      this.physicsEngine.removeObject(this);
    },
  });

module.exports = Collidable;