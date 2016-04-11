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
    groundResistance: 3,
    accelerationConstant: 0.1 * scale,
    gravity: 9.8 * scale,
    mass: 80,
    jumpForce: 3 * 9.8 * scale,
    onGround: false,
    timeSinceJump: 10,
    jumpLength: 0.2
  })
  .init(function(){
  })
  .methods({
    update: function(dt){
      this.acceleration.x = 0;
      this.acceleration.y = -this.gravity / this.mass;

      if (inputState.pressed("jump")) {
        if (this.onGround)
          this.timeSinceJump = 0;

        if (this.timeSinceJump < this.jumpLength){ // Jump further while jump button is held down
          this.acceleration.y += this.jumpForce / this.mass;
        }
      }
      this.timeSinceJump += dt;

      jumpStream.onValue((x) => {
        if (this.onGround) {
          sounds.jumpSmall.currentTime = 0;
          // sounds.jumpSmall.play();
          this.acceleration.y += this.jumpForce / this.mass;
        }
      });

      this.animationState = "moving";
      if (this.onGround || this.timeSinceJump < this.jumpLength){
        if (inputState.pressed("right")) {
          this.direction = "right";
          this.acceleration.x = this.accelerationConstant;
        } else if(inputState.pressed("left")) {
          this.direction = "left";
          this.acceleration.x = -this.accelerationConstant;
        } else {
          this.animationState = "standing";
          this.acceleration.x =  - this.velocity.x * this.groundResistance;
        }
      } else {
          this.animationState = "jumping";
      }

      let slidingSpeed = this.velocity.x / (this.direction == "left" ? -1 : 1);
      if (slidingSpeed < -1){
        this.animationState = "sliding";
      }

      this.position.addScaledVector(this.velocity, dt)
      this.position.addScaledVector(this.acceleration, dt * dt)
      this.velocity.addScaledVector(this.acceleration, dt)

      this.updateCollisions(dt);
      this.updateSprite(dt);
    }
  })

module.exports = Player1;
