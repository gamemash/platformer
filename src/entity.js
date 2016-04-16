let PhysicsEngine = require('./physics_engine.js');
let stampit = require('stampit');
let THREE = require('three');
let Debug = require('./debug.js');

let Entity = stampit()
  .methods({
    collided: function(block, direction){ },
    updateCollisions: function(dt){
      if (this.velocity == undefined) return;
      let position = [Math.round(this.oldPosition.x), Math.round(this.oldPosition.y)];
      this.onGround = false;
      let pos = [0, 1, -1];
      if (this.velocity.y < 0) {
        for (let i = 0; i < 3; i += 1){
          let block = PhysicsEngine.checkPosition(position[0], position[1] - 1);
          if (block && PhysicsEngine.boundingBox(this, block)){
            this.collided(block, 'below');
            block.collided(this, 'above');
            break;
          }
        }
      } else if (this.velocity.y > 0) {
        let block = PhysicsEngine.checkPosition(position[0], position[1] + this.size.y);
        if (block && PhysicsEngine.boundingBox(this, block)){
          this.collided(block, 'above');
          block.collided(this, 'below');
        }
      }
      if (this.velocity.x > 0) {
        for (let i = 0; i < 3; i += 1){
          let block = PhysicsEngine.checkPosition(position[0] + 1, position[1] + pos[i]);
          if (block && PhysicsEngine.boundingBox(this, block)){
            this.collided(block, 'right');
            block.collided(this, 'left');
            break;
          }
        }
      } else if (this.velocity.x < 0) {
        for (let i = 0; i < 3; i += 1){
          let block = PhysicsEngine.checkPosition(position[0] - 1, position[1] + pos[i]);
          if (block && PhysicsEngine.boundingBox(this, block)){
            this.collided(block, 'left');
            block.collided(this, 'right');
            break;
          }
        }
      }

    }
  }).
  init(function(){
    this.velocity = new THREE.Vector2(0, 0),
    this.acceleration =  new THREE.Vector2(0, 0)
    this.game.entities.push(this);
  });

module.exports = Entity;
