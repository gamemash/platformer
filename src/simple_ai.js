let stampit = require('stampit');
let Collidable = require('./collidable.js')
let THREE = require('three');

let SimpleAI = stampit().compose(Collidable)
  .refs({
    walkSpeed: 1,
    onGround: false,
    dead: false
  })
  .init(function(){
    this.collisionStream.onValue(function(collision) {
      let entity = collision.entity;
      let direction = collision.direction;

      switch(direction){
        case 'left':
          this.position.x = entity.position.x + entity.size.x;
          this.velocity.x = -this.velocity.x;
          break;
        case 'right':
          this.position.x = entity.position.x - entity.size.x;
          this.velocity.x = -this.velocity.x;
          break;
        case 'below':
          this.position.y = entity.position.y + entity.size.y;
          this.velocity.y = 0;
          this.onGround = true;
          break;
       }
    }.bind(this));

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
