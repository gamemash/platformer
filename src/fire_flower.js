let stampit = require('stampit');
let Entity = require('./entity.js');
let THREE = require('three');
let AnimatedSprite = require('./animated_sprite.js');
let DelayedAction = require('./delayed_action.js');
let PhysicsEngine = require('./physics_engine.js');

let {BumpAnimation, BrickAnimation, NewMushroomAnimation} = require('./animations.js')

let FireFlower = stampit.compose(AnimatedSprite, Entity)
  .refs({
    name: "FireFlower",
    texture: "fireflower.png",
    spritePosition: [0, 0],
    spriteLayout: [4, 2],
    animationState: 'green',
    animations: {
      green: [
        {id: 0, duration: 0.05},
        {id: 1, duration: 0.05},
        {id: 2, duration: 0.05},
        {id: 3, duration: 0.05}
      ]
    }
  })
  .init(function(){
    NewMushroomAnimation.create({game: this.game, subject: this});

  });

FireFlower.Fireball = stampit.compose(AnimatedSprite, Entity)
  .refs({
    name: "Fireball",
    texture: "fireball.png",
    shootingSpeed: 15,
    animationState: 'fireball',
    animations: {
      fireball: [
        {id: 0, duration: 0.15},
        {id: 1, duration: 0.15},
        {id: 2, duration: 0.15},
        {id: 3, duration: 0.15}
      ],
      explode: [
        {id: 0, duration: 0.10},
        {id: 2, duration: 0.10},
        {id: 4, duration: 0.10}
      ]
    },
    spritePosition: [0, 0],
    spriteLayout: [6, 4]
    //spriteLayout: [6, 3]
  })
  .methods({
    fireball: function(){
      this.animationState = "fireball";
      this.setSize(new THREE.Vector2(1/2, 1/2));
      this.setSpritePositionY(0);
      this.setSpriteSize(new THREE.Vector2(1, 1));
    },
    explosion: function(){
      this.disregardCollisions = true;
      this.animationState = "explode";
      this.position.add(new THREE.Vector2(-1/8, -1/8));
      this.setSpritePosition(new THREE.Vector2(0, 2));
      this.setSize(new THREE.Vector2(1/2, 1/2));
      this.setSpriteSize(new THREE.Vector2(2, 2));
    },
    updateCallback: function(dt){
      this.oldPosition = this.position.clone();
      PhysicsEngine.newtonianResponse(this, dt);
      this.updateCollisions(dt);
    },
    updateCollisions: function(dt){
      if (this.disregardCollisions) return;
      let fromBlock = new THREE.Vector2(Math.floor(this.oldPosition.x), Math.floor(this.oldPosition.y));
      let position = [Math.floor(this.position.x), Math.floor(this.position.y)];
      let block = PhysicsEngine.checkPosition(position[0], position[1]);
      if (block && PhysicsEngine.boundingBox(this, block)){
        let difference = block.position.clone().sub(fromBlock);
        if (difference.length() < 0) return;
        if (difference.length() > 1){
          if (Math.abs(difference.x) > Math.abs(difference.y)) {
            difference.y = 0;
          } else {
            difference.x = 0;
          }
        }
        if (Math.abs(difference.x) > 0){
          this.collided(block, 'side');
        } else {
          PhysicsEngine.newtonianResponse(this, -dt);
          this.collided(block, 'below');
        }
      }
    },
    collided: function(obj, direction){
      switch(direction){
        case 'below':
          this.acceleration.y = -60;
          this.velocity.y = 10.0;
          break;
        case 'side':
          this.velocity.set(0, 0);
          this.acceleration.set(0, 0);
          this.explosion();
          DelayedAction.create({game: this.game, duration: 0.30, action: (function(){
            this.remove();
          }.bind(this))});
          break;
      }
    }
  })
  .init(function(){
    this.updateUniforms();
    this.fireball();
    this.acceleration = new THREE.Vector2(0, 0);
    this.velocity = (new THREE.Vector2(0.8, -0.6)).multiplyScalar(this.shootingSpeed);
    if (this.direction == "left"){
      this.velocity.x = -this.velocity.x;
    }
    this.velocity.x += this.player.velocity.x;

    DelayedAction.create({game: this.game, duration: 4.0, action: (function(){
      this.explosion();
    }.bind(this))});
    this.registerUpdateCallback(this.updateCallback);
  });

module.exports = FireFlower;


