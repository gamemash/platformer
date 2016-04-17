let stampit = require('stampit');
let THREE = require('three');
let AnimatedSprite = require('./animated_sprite.js');
let Debug = require('./debug.js');
let SpriteGeometry = require('./sprite_geometry.js');
let ShaderLoader = require('./shader_loader.js');
let Animation = require('./animation.js');

let GrowAnimation = stampit.compose(Animation)
  .refs({
    speed: 1,
  })
  .methods({
    handleStop: function() {
      this.subject.animated = true;
      this.game.renderer.updating = true;
      this.subject.uniforms.tileSize.value = this.subject.size = new THREE.Vector2(1, 2);
      this.subject.uniforms.spriteSize.value = this.subject.spriteSize = new THREE.Vector2(1, 2);
      this.subject.uniforms.spritePosition.value = this.subject.spritePosition = new THREE.Vector2( 2, 1);
    },
    handleAnimation: function(dt) {
      this.timeSinceAnimation += dt;
      if (this.timeSinceAnimation < this.animationSpeed) return;
      this.timeSinceAnimation = 0;

      if (this.big){
        this.subject.uniforms.tileSize.value.y = this.subject.size.y = this.subjectSize + this.time;
        this.subject.uniforms.spriteSize.value.y = this.subject.spriteSize.y = 1.5;
        this.subject.uniforms.spritePosition.value = this.subject.spritePosition = new THREE.Vector2( 15, 1);
      } else {
        this.subject.uniforms.tileSize.value.y = this.subject.size.y = this.subjectSize;
        this.subject.uniforms.spriteSize.value.y = this.subject.spriteSize.y = this.subjectSize;
        this.subject.uniforms.spritePosition.value = this.subject.spritePosition = new THREE.Vector2( 2, 0);
      }
      this.big = !this.big;
    },
    handleStart: function() {
      this.subject.animated = false;
      this.game.renderer.updating = false;
      this.subjectSize = this.subject.size.y;
      this.big = true;
      this.timeSinceAnimation = 0;
      this.animationSpeed = 0.1;
    }
  });


let Mario = stampit.compose(AnimatedSprite)
  .refs({
    spriteLayout: [21, 3],
    spritePosition: [2, 0],
    texture: 'mario.png',
    superMario: false,
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
    size: new THREE.Vector2(1, 1)
  })
  .methods({
    duration: function(){
      if (this.animationState == "moving"){
        return 0.2 - this.velocity.x / 100
      }
      return this.animations[this.animationState][this.frame].duration;
    },
    grow: function(){
      if (!this.superMario){
        console.log("Grow?");
        this.superMario = true;
        GrowAnimation.create({game: this.game, subject: this});
      }
    }
  });


module.exports = Mario;
