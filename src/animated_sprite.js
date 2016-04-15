let stampit = require('stampit');
let THREE = require('three');
let Sprite = require('./sprite.js');
let Debug = require('./debug.js');
let Updatable = require('./updatable.js');

let AnimatedSprite = stampit.compose(Updatable, Sprite)
  .methods({
    duration: function(){
      return this.animations[this.animationState][this.frame].duration;
    }
  })
  .refs({
    frames: [{id:0, duration: 1}],
    animationState: false,
    animations: {}
  })
  .init(function(){

    this.animated = true;

    this.frame = 0;
    this.timeElapsed = 0;

    this.registerUpdateCallback(function(dt) {
      if (!this.animations[this.animationState]) return;
      this.timeElapsed += dt;
      this.frame = this.frame % this.animations[this.animationState].length; // in case animation state changes

      if (this.timeElapsed > this.duration()) {
        this.frame = (this.frame + 1) % this.animations[this.animationState].length;;
        this.timeElapsed = 0;
      }

      this.material.uniforms['spritePosition']['value'].x = this.animations[this.animationState][this.frame].id;
      if (this.direction){
        this.material.uniforms['spriteFlipped'] = {type: 'i', value: this.direction == "left" };
      }
      this.material.needsUpdate = true;
    });
  });


module.exports = AnimatedSprite;
