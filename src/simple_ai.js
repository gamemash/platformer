let stampit = require('stampit');
let THREE = require('three');

let SimpleAI = stampit()
  .refs({
    walkSpeed: 1,
    onGround: false,
    dead: false
  })
  .methods({
    collided: function(block, direction){
      if (this.disregardCollisions) return;

      switch(direction){
        case 'left':
          this.position.x = block.position.x + block.size.x;
          this.velocity.x = -this.velocity.x;
          break;
        case 'right':
          this.position.x = block.position.x - block.size.x;
          this.velocity.x = -this.velocity.x;
          break;
        case 'below':
          this.position.y = block.position.y + block.size.y;
          this.velocity.y = 0;
          this.onGround = true;
          break;
      }
    },
  })
  .init(function(){
    this.velocity.x = -this.walkSpeed;

    this.registerUpdateCallback(function(dt) {
      this.acceleration.y = -60;
      this.oldPosition = this.position.clone();
      this.position.addScaledVector(this.velocity, dt)
      if (this.onGround == false){
        this.position.y += this.acceleration.y * dt * dt * .5;
        this.velocity.y += this.acceleration.y * dt;
      }
      this.updateCollisions(dt);
    });
  });


module.exports = SimpleAI;
