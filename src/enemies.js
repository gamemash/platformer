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
let DelayedAction = require('./delayed_action.js');
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
    die: function(){
      if (this.dead) return;
      this.dead = true;
      this.velocity.set(0, 0);
      this.animationState = 'dead';
      DelayedAction.create({game: this.game, duration: 1, action: (function(){
        console.log("remove goomba");
        this.remove();
      }.bind(this))});
      return;
    },
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

let Koopa = stampit.compose(Updateable, AnimatedSprite, Entity, SimpleAI)
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
    reset: function(){
      this.name = "Koopa";
      this.shell = false;
      this.animationState = "walking";
      this.velocity = new THREE.Vector2(-this.walkSpeed, 0);
      this.acceleration = new THREE.Vector2(0, -60);
      this.setSize(new THREE.Vector2(1, 1.5));
      this.setSpriteSize(new THREE.Vector2(1, 1.5));
    }
  })
  .init(function(){
    this.updateUniforms();
    this.reset();
  });

module.exports = {
  Goomba: Goomba,
  Mushroom: Mushroom,
  Koopa: Koopa
}
