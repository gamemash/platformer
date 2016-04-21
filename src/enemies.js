let stampit = require('stampit');
let Sprite = require('./sprite.js');
let AnimatedSprite = require('./animated_sprite.js');
let THREE = require('three');
let Updateable = require('./updatable.js');
let Entity = require('./entity.js');
let Collidable = require('./collidable.js');
let Debug = require('./debug.js');
let SimpleAI = require('./simple_ai.js');
let PhysicsEngine = require('./physics_engine.js');
let {BumpAnimation, BrickAnimation, NewMushroomAnimation} = require('./animations.js')

let Goomba = stampit.compose(Updateable, AnimatedSprite, Entity, SimpleAI)
  .refs({
    name: "Goomba",
    deadly: true,
    texture: 'goomba.png',
    animationState: "walking",
    animations: {
      walking: [{id:0, duration: 0.15}, {id:1, duration: 0.15}],
      dead: [{id:2, duration: 1}]
    },
    spritePosition: [0, 0],
    spriteLayout: [3, 1],
    walkSpeed: 3
  })
  .methods({
    hitBy: function(){
      this.dead = true;
      this.velocity.set(0, 0);
      this.animationState = 'dead';
      setTimeout((function(){
        this.delete();
      }.bind(this)),1000);
    }
  });

let Mushroom = stampit.compose(Updateable, Sprite, Entity, SimpleAI)
  .refs({
    name: "Mushroom",
    texture: 'mushroom.png',
    walkSpeed: -2
  })
  .init(function(){
    NewMushroomAnimation.create({game: this.game, subject: this});
  });

let Koopa = stampit.compose(Updateable, AnimatedSprite, Entity)
  .refs({
    name: "Koopa",
    deadly: true,
    texture: 'koopa.png',
    direction: "right",
    animationState: "walking",
    animations: {
      walking: [{id:0, duration: 0.15}, {id:1, duration: 0.15}],
      shell: [{id:6, duration: 1}]
    },
    spritePosition: [0, 0],
    spriteLayout: [8, 2],
    walkSpeed: 3
  })
  .methods({
    hitBy: function(player){
      if (this.shell){
        this.pushed = true;
        let direction = (player.position.x < this.position.x ? 1 : -1 );
        this.velocity.set(direction * 10, 0);
        setTimeout((function(){
          this.remove();
        }.bind(this)),8000);

      } else {
        this.shell = true;
        this.velocity.set(0, 0);
        this.animationState = 'shell';
        this.setSize(new THREE.Vector2(1, 1));
        this.setSpriteSize(new THREE.Vector2(1, 1));
        setTimeout((function(){
          if (!this.pushed){
            this.reset();
          }
        }.bind(this)),3000);
      }

    },
    reset: function(){
      this.animationState = "walking";
      this.velocity = new THREE.Vector2(-this.walkSpeed, 0);
      this.acceleration = new THREE.Vector2(0, -60);
      this.setSize(new THREE.Vector2(1, 1.5));
      this.setSpriteSize(new THREE.Vector2(1, 1.5));
    },
    collided: function(block, direction){
      switch(direction){
        case 'left':
          this.position.x = block.position.x + block.size.x;
          this.velocity.x = -this.velocity.x;
          this.direction = "left";
          break;
        case 'right':
          this.position.x = block.position.x - block.size.x;
          this.direction = "right";
          this.velocity.x = -this.velocity.x;
          break;
        case 'below':
          this.position.y = block.position.y + block.size.y;
          this.velocity.y = 0;
          this.onGround = true;
          break;
      }
    },
    updateCallback: function(dt){
      this.oldPosition = this.position.clone();
      PhysicsEngine.newtonianResponse(this, dt);
      this.updateCollisions(dt);
    }
  })
  .init(function(){
    this.updateUniforms();
    this.reset();
    this.registerUpdateCallback(this.updateCallback);
  });

module.exports = {
  Goomba: Goomba,
  Mushroom: Mushroom,
  Koopa: Koopa
}
