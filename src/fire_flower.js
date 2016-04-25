let stampit = require('stampit');
let Entity = require('./entity.js');
let THREE = require('three');
let AnimatedSprite = require('./animated_sprite.js');
let DelayedAction = require('./delayed_action.js');
let PhysicsEngine = require('./physics_engine.js');

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
        {id: 0, duration: 0.15},
        {id: 2, duration: 0.15},
        {id: 4, duration: 0.15}
      ]
    },
    spritePosition: [0, 0],
    spriteLayout: [6, 4]
    //spriteLayout: [6, 3]
  })
  .methods({
    fireball: function(){
      this.animationState = "fireball";
      this.setSize(new THREE.Vector2(1/4, 1/4));
      this.setSpritePositionY(0);
      this.setSpriteSize(new THREE.Vector2(1, 1));
    },
    explosion: function(){
      this.animationState = "explode";
      this.position.add(new THREE.Vector2(-1/8, -1/8));
      this.setSpritePositionY(2);
      this.setSize(new THREE.Vector2(1/2, 1/2));
      this.setSpriteSize(new THREE.Vector2(2, 2));
    },
    updateCallback: function(dt){
      this.oldPosition = this.position.clone();
      PhysicsEngine.newtonianResponse(this, dt);
      this.updateCollisions(dt);
    },
    collided: function(obj, direction){
      console.log(direction);
      switch(direction){
        case 'below':
          this.acceleration.y = -60;
          this.velocity.y = -this.velocity.y * 1.2;
          break;
        case 'left':
        case 'right':
          this.velocity.set(0, 0);
          this.acceleration.set(0, 0);
          this.explosion();
          DelayedAction.create({game: this.game, duration: 0.45, action: (function(){
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
    console.log(this);

    DelayedAction.create({game: this.game, duration: 4.0, action: (function(){
      this.explosion();
    }.bind(this))});
    this.registerUpdateCallback(this.updateCallback);
    //this.fireball();
    //DelayedAction.create({game: this.game, duration: 1, action: (function(){
    //  this.explosion();
    //}.bind(this))});
  });

module.exports = FireFlower;


