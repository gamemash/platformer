let stampit = require('stampit');
let THREE = require('three');
let AnimatedSprite = require('./animated_sprite.js');
let Debug = require('./debug.js');
let SpriteGeometry = require('./sprite_geometry.js');
let ShaderLoader = require('./shader_loader.js');
let {InvulnerableAnimation, GrowAnimation, ShrinkAnimation, DeathAnimation} = require('./player_animations.js');
let sounds = require('./sounds.js');

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
      ],
      victory: [
        {id : 8, duration: 1 }
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
        this.superMario = true;
        sounds.powerUp.currentTime = 0;
        sounds.powerUp.playbackRate = 1;
        sounds.powerUp.play();
        GrowAnimation.create({game: this.game, subject: this});
      }
    },
    die: function() {
      this.disregardCollisions = true;
      if (!this.dead){
        sounds.die.play();
        DeathAnimation.create({game: this.game, subject: this});
      }

      this.dead = true;
    },
    shrink: function(){
      InvulnerableAnimation.create({game: this.game, subject: this});
      ShrinkAnimation.create({game: this.game, subject: this});
      sounds.pipe.currentTime = 0;
      sounds.pipe.playbackRate = 1;
      sounds.pipe.play();
      this.superMario = false;
    }
  })
  .init(function(){
    this.updateUniforms();
  });


module.exports = Mario;
