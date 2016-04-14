let stampit = require('stampit');
let THREE = require('three');
let Sprite = require('./sprite.js');
let Debug = require('./debug.js');
let Updatable = require('./updatable.js');

let AnimatedSprite = stampit.compose(Updatable, Sprite)
  .refs({
    frames: [{id:0, duration: 1}]
  })
  .init(function(){
    this.animated = true;
    this.frame = 0;
    this.timeElapsed = 0;
    this.registerUpdateCallback(function(dt) {
      this.timeElapsed += dt;

      if (this.timeElapsed > this.frames[this.frame].duration) {
        this.frame += 1;
        this.frame = this.frame % this.frames.length;
        this.timeElapsed = 0;
      }

      this.material.uniforms['spritePosition']['value'].x = this.frames[this.frame].id;
    });
  });


module.exports = AnimatedSprite;
