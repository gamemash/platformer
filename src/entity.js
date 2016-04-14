let PhysicsEngine = require('./physics_engine.js');
let stampit = require('stampit');
let THREE = require('three');
let Debug = require('./debug.js');

let Entity = stampit()
  .methods({
    collided: function(block, direction){  },
    updateCollisions: function(dt){
      if (this.velocity == undefined) return;
      let position = [Math.floor(this.oldPosition.x), Math.floor(this.oldPosition.y)];
      this.onGround = false;
      if (this.velocity.y < 0) {
        for (let i = -1; i < 2; i += 1){
          let block = PhysicsEngine.checkPosition(position[0] + i, position[1] - 1);
          if (block && PhysicsEngine.boundingBox(this, block)){
            this.collided(block, 'below');
            break;
          }
        }
      } else if (this.velocity.y > 0) {
        for (let i = -1; i < 2; i += 1){
          let block = PhysicsEngine.checkPosition(position[0] + i, position[1] + 1);
          if (block && PhysicsEngine.boundingBox(this, block)){
            this.collided(block, 'above');
            break;
          }
        }
      }
      if (this.velocity.x > 0) {
        for (let i = -1; i < 2; i += 1){
          let block = PhysicsEngine.checkPosition(position[0] + 1, position[1] + i);
          if (block && PhysicsEngine.boundingBox(this, block)){
            this.collided(block, 'right');
            break;
          }
        }
      } else if (this.velocity.x < 0) {
        for (let i = -1; i < 2; i += 1){
          let block = PhysicsEngine.checkPosition(position[0] - 1, position[1] + i);
          if (block && PhysicsEngine.boundingBox(this, block)){
            this.collided(block, 'left');
            break;
          }
        }
      }

    }
  }).
  init(function(){
    this.velocity = new THREE.Vector2(0, 0),
    this.acceleration =  new THREE.Vector2(0, 0)
  });

module.exports = Entity;
