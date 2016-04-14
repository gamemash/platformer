let stampit = require('stampit');
let Sprite = require('./sprite.js');
let AnimatedSprite = require('./animated_sprite.js');
let THREE = require('three');
let Updateable = require('./updatable.js');
let Entity = require('./entity.js');
let Collidable = require('./collidable.js');
let Debug = require('./debug.js');

let Goomba = stampit.compose(Updateable, AnimatedSprite, Entity)
  .refs({
    texture: 'goomba.png',
    animationState: "walking",
    animations: {
      walking: [{id:0, duration: 0.15}, {id:1, duration: 0.15}],
      dead: [{id:2, duration: 1}]
    },
    walkSpeed: 3.0,
    onGround: false,
    dead: false

  })
  .methods({
    collided: function(block, direction){
      switch(direction){
        case 'left':
          this.position.x = block.position.x + block.size;
          this.velocity.x = -this.velocity.x;
          break;
        case 'right':
          this.position.x = block.position.x - block.size;
          this.velocity.x = -this.velocity.x;
          break;
        case 'below':
          this.position.y = block.position.y + block.size;
          this.velocity.y = 0;
          this.onGround = true;
          break;
      }
    },
    die: function(){
      this.dead = true;
      this.velocity.set(0, 0);
      this.animationState = 'dead';
      setTimeout((function(){
        this.delete();
      }.bind(this)),1000);
    }
  })
  .init(function(){
    this.material.uniforms['spriteLayout'] = { type: 'v2', value:  new THREE.Vector2( 3, 1) };
    this.material.uniforms['spritePosition'] = {type: "v2", value: new THREE.Vector2( 0, 0) };
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

module.exports = {
  Goomba: Goomba
}
