let stampit = require('stampit');
let Sprite = require('./sprite.js');
let AnimatedSprite = require('./animated_sprite.js');
let THREE = require('three');
let Updateable = require('./updatable.js');
let Entity = require('./entity.js');
let Collidable = require('./collidable.js');

let Goomba = stampit.compose(Updateable, AnimatedSprite, Entity)
  .refs({
    texture: 'goomba.png',
    frames: [{id:0, duration: 0.15}, {id:1, duration: 0.15}],
    velocity: new THREE.Vector2(100, 0),
  })
  .init(function(){
    this.material.uniforms['spriteLayout'] = { type: 'v2', value:  new THREE.Vector2( 3, 1) };
    this.material.uniforms['spritePosition'] = {type: "v2", value: new THREE.Vector2( 0, 0) };

    this.registerUpdateCallback(function(dt) {
      this.updateCollisions(dt);
    });
  });

module.exports = {
  Goomba: Goomba
}