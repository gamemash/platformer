let stampit = require('stampit');
let Sprite = require('./sprite.js');
let AnimatedSprite = require('./animated_sprite.js');
let THREE = require('three');
let Updateable = require('./updatable.js');
let Entity = require('./entity.js');
let Collidable = require('./collidable.js');
let Debug = require('./debug.js');
let SimpleAI = require('./simple_ai.js');

let Goomba = stampit.compose(Updateable, AnimatedSprite, Entity, SimpleAI)
  .refs({
    texture: 'goomba.png',
    animationState: "walking",
    animations: {
      walking: [{id:0, duration: 0.15}, {id:1, duration: 0.15}],
      dead: [{id:2, duration: 1}]
    },
    walkSpeed: 3
  })
  .methods({
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
  });

module.exports = {
  Goomba: Goomba
}
