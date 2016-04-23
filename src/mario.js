let stampit = require('stampit');
let THREE = require('three');
let AnimatedSprite = require('./animated_sprite.js');
let Debug = require('./debug.js');
let SpriteGeometry = require('./sprite_geometry.js');
let Entity = require('./entity.js');
let ShaderLoader = require('./shader_loader.js');
let {InvulnerableAnimation, GrowAnimation, ShrinkAnimation, DeathAnimation} = require('./player_animations.js');
let PhysicsEngine = require('./physics_engine.js');
let sounds = require('./sounds.js');

let scale = 300; //pixel to reality ratio
let Mario = stampit.compose(AnimatedSprite, Entity)
  .refs({
    groundResistance: 3.6,
    accelerationConstant: 0.14 * scale,
    gravity: 20 * scale,
    mass: 80,
    jumpForce: 0.5 * 7.8 * scale,
    onGround: false,
    timeSinceJump: 10,
    jumpLength: 0.3,
    maxVelocity: 15,
    airJumpCount: 0,
    maxAirJumps: 2,
    dead: false,
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
    },
    jump: function(){
      if(this.onGround) {
        this.airJumpCount = 0;
      }

      if(this.onGround || (this.airJumpCount < this.maxAirJumps)){
        this.timeSinceJump = 0;
        this.airJumpCount += 1;
        this.velocity.y = this.jumpForce / this.mass;

        if (this.airJumpCount == 1) {
          sounds.jumpSmall.currentTime = 0;
          sounds.jumpSmall.volume = 0.4;
          sounds.jumpSmall.play();
        } else {
          sounds.kick.currentTime = 0;
          sounds.kick.playbackRate = 1;
          sounds.kick.play();
        }

      }

    },
    updateCallback: function(dt){
      this.oldPosition = this.position.clone();
      this.acceleration.set(0, -this.gravity / this.mass);

      this.animationState = "standing";
      switch(this.walking){
        case "left":
          this.acceleration.x = -this.accelerationConstant;
          this.direction = this.walking;
          this.animationState = "moving";
          break;
        case "right":
          this.acceleration.x = this.accelerationConstant;
          this.direction = this.walking;
          this.animationState = "moving";
          break;
      }

      let slidingSpeed = this.velocity.x / (this.direction == "left" ? -1 : 1);
      if (slidingSpeed < -1){
        this.animationState = "sliding";
      }

      if (this.jumping) {
        if (this.timeSinceJump < this.jumpLength){ // Jump further while jump button is held down
          this.velocity.y = this.jumpForce / this.mass;
        }
      }
      this.timeSinceJump += dt;

      if (this.onGround){
        this.acceleration.x -=  this.velocity.x * this.groundResistance;
      } else {
        this.acceleration.x -=  this.velocity.x * this.groundResistance / 2;
        this.animationState = "jumping";
      }

      if (Math.abs(this.velocity.x) < 0.5) {
        this.velocity.x = 0;
      }

      PhysicsEngine.newtonianResponse(this, dt);

      if (Math.abs(this.velocity.x) > this.maxVelocity){
        this.velocity.x = this.maxVelocity * this.velocity.x / Math.abs(this.velocity.x);
      }

      this.updateCollisions(dt);

    }

  })
  .init(function(){
    this.updateUniforms();
    this.registerUpdateCallback(this.updateCallback);
  });


module.exports = Mario;
