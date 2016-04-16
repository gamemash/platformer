let stampit = require('stampit');
let THREE = require('three');
let AnimatedSprite = require('./animated_sprite.js');
let Debug = require('./debug.js');

let Mario = stampit.compose(AnimatedSprite)
  .refs({
    texture: 'mario_big.png',
    animationState: 'standing',
    animations: {
      standing: [
        {id: 0, duration: 0.10},
      ],
      moving: [
        {id: 1, duration: 0.10},
        {id: 2, duration: 0.10},
        {id: 3, duration: 0.10}
      ],
      sliding: [
        {id: 4, duration: 0.10}
      ],
      jumping: [
        {id: 5, duration: 0.0}
      ],
      dead: [
        {id: 6, duration: 0.0}
      ]
    },
    size: new THREE.Vector2(1, 2)
  })
  .methods({
    duration: function(){
      if (this.animationState == "moving"){
        return 0.2 - this.velocity.x / 100
      }
      return this.animations[this.animationState][this.frame].duration;
    },
    selectAnimation: function(name, facingLeft){
      if (this.animationState == name)
        return;

      this.frame = 0;
      this.timeElapsed = 0;
      this.animationState = name;
      if (facingLeft !== undefined){
        this.material.uniforms['spriteFlipped'] = {type: 'i', value: facingLeft };
      }
      this.material.needsUpdate = true;
    }
  })
  .init(function(){
    this.material.uniforms['spriteLayout'] = { type: 'v2', value:  new THREE.Vector2( 21, 1) };
    this.material.uniforms['spritePosition'] = {type: "v2", value: new THREE.Vector2( 2, 0) };
    this.selectAnimation('standing', false);
  });


module.exports = Mario;
