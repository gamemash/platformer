let stampit = require('stampit');
let Entity = require('./entity.js');
let THREE = require('three');
let AnimatedSprite = require('./animated_sprite.js');
let DelayedAction = require('./delayed_action.js');

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
    }
  })
  .init(function(){
    this.updateUniforms();
    this.fireball();
    DelayedAction.create({game: this.game, duration: 1, action: (function(){
      this.explosion();
    }.bind(this))});
  });

module.exports = FireFlower;


