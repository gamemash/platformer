let stampit = require('stampit');
let THREE = require('three');
let AnimatedSprite = require('./animated_sprite.js');

let Mario = stampit.compose(AnimatedSprite)
  .refs({
    texture: 'mario_small.png',
    frames: [
      {id: 1, duration: 0.10},
      {id: 2, duration: 0.10},
      {id: 3, duration: 0.10}
    ]
  })
  .methods({
    selectDirection: function(facedLeft){
      this.material.uniforms['spriteFlipped'] = {type: 'i', value: facedLeft };
      this.material.needsUpdate = true;
    }
  })
  .init(function(){
    this.material.uniforms['spriteLayout'] = { type: 'v2', value:  new THREE.Vector2( 14, 1) };
    this.material.uniforms['spritePosition'] = {type: "v2", value: new THREE.Vector2( 2, 0) };
    this.selectDirection(false);
  });


module.exports = Mario;
