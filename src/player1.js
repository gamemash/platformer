let stampit = require('stampit');
let THREE = require('three');
let Mario = require('./mario.js');
let {jumpStream, inputState} = require("./input_stream.js");
let sounds = require('./sounds.js');
let Entity = require('./entity.js');
let Debug = require('./debug.js');

let scale = 300; //pixel to reality ratio
let Player1 = stampit.compose(Mario, Entity)
  .refs({
    velocity: new THREE.Vector2(0, 0),
    acceleration: new THREE.Vector2(0, 0),
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
    dead: false
  })
  .init(function(){
    jumpStream.onValue((x) => {
      if (this.onGround) {

        // this.acceleration.y += this.jumpForce / this.mass;
      }
    });

    jumpStream.onValue(function(x) {
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
    }.bind(this));

  })
  .methods({
    die: function() {
      if (!this.dead){
        console.log('died');
        sounds.die.play();

        window.setTimeout(function() { // Respawn the player after 3 seconds
          this.position.x = 6;
          this.position.y = 5;
          this.acceleration.y = 0;
          this.velocity.y = 18;
          this.velocity.x = 2;
          sounds.kick.play();
          this.dead = false;
        }.bind(this), 3250)
      }

      this.dead = true;
    },
    update: function(dt){
      if (this.dead) {
        this.animationState = "dead";
        this.position.y -= 0.02;
        return;
      }

      this.acceleration.x = 0;
      this.acceleration.y = -this.gravity / this.mass;

      if (inputState.pressed("jump")) {
        if (this.timeSinceJump < this.jumpLength){ // Jump further while jump button is held down
          this.velocity.y = this.jumpForce / this.mass;
        }
      }

      this.timeSinceJump += dt;

      let slidingSpeed = this.velocity.x / (this.direction == "left" ? -1 : 1);
      this.animationState = "moving";

      if (inputState.pressed("right")) {
        this.direction = "right";
        this.acceleration.x = this.accelerationConstant;
      } else if(inputState.pressed("left")) {
        this.direction = "left";
        this.acceleration.x = -this.accelerationConstant;
      } else {
        this.animationState = "standing";
      }

      if (slidingSpeed < -1){
        this.animationState = "sliding";
      }

      if (this.onGround){
        this.acceleration.x -=  this.velocity.x * this.groundResistance;
      } else {
        this.acceleration.x -=  this.velocity.x * this.groundResistance / 2;
        this.animationState = "jumping";
      }

      if (Math.abs(this.velocity.x) < 0.5) {
        this.velocity.x = 0;
      }

      this.position.addScaledVector(this.velocity, dt)
      this.position.addScaledVector(this.acceleration, dt * dt)
      this.velocity.addScaledVector(this.acceleration, dt)

      if (Math.abs(this.velocity.x) > this.maxVelocity){
        this.velocity.x = this.maxVelocity * this.velocity.x / Math.abs(this.velocity.x);
      }

      this.updateCollisions(dt);
      this.updateSprite(dt);
    }
  })

module.exports = Player1;
