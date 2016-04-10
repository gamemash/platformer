let stampit = require('stampit');
let THREE = require('three');
let Sprite = require('./sprite.js');
let Debug = require('./debug.js');

let AnimatedSprite = stampit.compose(Sprite)
  .refs({
    animated: true,
    frames: [
      {id: 0, duration: 0.05},
      {id: 1, duration: 0.05},
      {id: 2, duration: 0.6},
      {id: 1, duration: 0.05},
      {id: 0, duration: 0.05}
    ] // seconds
  })
  .init(function(){
    this.animated = true;
    this.frame = 0;
    this.timeElapsed = 0;
  })
  .methods({
    update: function(dt) {
      this.timeElapsed += dt;

      if (this.timeElapsed > this.frames[this.frame].duration) {
        this.frame += 1;
        this.frame = this.frame % this.frames.length;
        this.timeElapsed = 0;
      }

      this.material.uniforms['spritePosition']['value'].x = this.frames[this.frame].id;
    }
  });


module.exports = AnimatedSprite;
