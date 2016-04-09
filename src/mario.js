let stampit = require('stampit');
let THREE = require('three');
let Sprite = require('./sprite.js');

let Mario = stampit.compose(Sprite)
  .refs({
    texture: 'mario_small.png'
  })
  .init(function(){
    this.material.uniforms['spriteLayout'] = { type: 'v2', value:  new THREE.Vector2( 14, 1) };
    this.material.uniforms['spritePosition'] = {type: "v2", value: new THREE.Vector2( 2, 0) };

    console.log(this.material);
  });


module.exports = Mario;
