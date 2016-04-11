let PhysicsEngine = require('./physics_engine.js');
var stampit = require('stampit');

var Entity = stampit().methods({
  collidedLeft: function(){

  },
  collidedRight: function(){

  },
  boundingBox: function(obj_a, obj_b){
    return (obj_a.position.x < obj_b.position.x + obj_b.size &&
       obj_a.position.x + obj_a.size > obj_b.position.x &&
       obj_a.position.y < obj_b.position.y + obj_b.size &&
       obj_a.size + obj_a.position.y > obj_b.position.y);
  },
  updateCollisions: function(dt){
    let position = this.gridPosition();
    let collision = PhysicsEngine.checkCollision(position);
    if (collision){
      if (collision.blockLeft) {
        this.collidedLeft();
        if (this.boundingBox(this, collision.blockLeft)){
          this.position.x = collision.blockLeft.size + collision.blockLeft.position.x;
          if (this.velocity.x < 0.0){
            this.velocity.x = 0.0;
            this.acceleration.x = 0.0;
          }
        }
      }


      if (collision.blockRight) {
        this.collidedRight();
        if (this.boundingBox(this, collision.blockRight)){
          this.position.x = collision.blockRight.position.x - collision.blockRight.size;
          if (this.velocity.x > 0.0){
            this.velocity.x = 0.0;
            this.acceleration.x = 0.0;
          }
        }
      }

      this.onGround = false;
      if (collision.blockDown) {
        let block = collision.blockDown;
        if (this.boundingBox(this, block)){
          this.position.y = block.position.y + block.size;
          if (this.velocity.y < 0.0){
            this.velocity.y = 0.0;
          }
          this.onGround = true;
        }
      }

      if (collision.blockUp) {
        let block = collision.blockUp;
        if (this.boundingBox(this, block)){
          if (this.velocity.y > 0.0){
            this.position.y = block.position.y - block.size - 0.1;
            this.velocity.y -= this.velocity.y;
          }
        }
      }
    }
  }
});

module.exports = Entity;
