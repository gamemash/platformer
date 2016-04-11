let stampit = require('stampit');
let THREE = require('three');
let Mario = require('./mario.js');
let PhysicsEngine = require('./physics_engine.js');
let {jumpStream, inputState} = require("./input_stream.js");
let sounds = require('./sounds.js');

let scale = 10000; //pixel to reality ratio
let Player1 = stampit.compose(Mario)
  .refs({
    velocity: new THREE.Vector2(0, 0),
    acceleration: new THREE.Vector2(0, 0),
    groundResistance: 3,
    accelerationConstant: 0.1 * scale,
    gravity: 9.8 * scale,
    mass: 80,
    jumpForce: 3 * 9.8 * scale,
    onGround: false,
    timeSinceJump: 10

  })
  .methods({
    boundingBox: function(obj_a, obj_b){
      return (obj_a.position.x < obj_b.position.x + obj_b.size &&
         obj_a.position.x + obj_a.size > obj_b.position.x &&
         obj_a.position.y < obj_b.position.y + obj_b.size &&
         obj_a.size + obj_a.position.y > obj_a.position.y);
    },
    update: function(dt){
      this.acceleration.y = -this.gravity / this.mass;

      if (inputState.pressed("jump")) { 
        if (this.onGround)
          this.timeSinceJump = 0;

        if (this.timeSinceJump < 0.2){ // Jump further while jump button is held down
          this.acceleration.y += this.jumpForce / this.mass;
        }
      }
      this.timeSinceJump += dt;

      jumpStream.onValue((x) => {
        if (this.onGround) {
          new Promise(function(resolve, reject) {
            sounds.jumpSmall.play();
          });
          this.acceleration.y += this.jumpForce / this.mass;
        }
      });

      this.position.addScaledVector(this.velocity, dt)
      this.position.addScaledVector(this.acceleration, dt * dt)
      this.velocity.addScaledVector(this.acceleration, dt)

      if (inputState.pressed("right")) {
        this.acceleration.x = this.accelerationConstant;
      } else if(inputState.pressed("left")) {
        this.acceleration.x = -this.accelerationConstant;
      } else {
        this.acceleration.x =  - this.velocity.x * this.groundResistance;
      }

      let position = this.gridPosition();
      let collision = PhysicsEngine.checkCollision(position);
      if (collision){
        if (collision.blockLeft) {
          if (this.boundingBox(this, collision.blockLeft)){
            this.position.x = collision.blockLeft.size + collision.blockLeft.position.x;
            if (this.velocity.x < 0.0){
              this.velocity.x = 0.0;
              this.acceleration.x = 0.0;
            }
          }
        }


        if (collision.blockRight) {
          if (this.boundingBox(this, collision.blockRight)){
            this.position.x = collision.blockRight.position.x - collision.blockRight.size;
            if (this.velocity.x > 0.0){
              this.velocity.x = 0.0;
              this.acceleration.x = 0.0;
            }
          }
        }

        this.onGround = false;
        if (collision.blockDown) {
          let block = collision.blockDown;
          if (this.boundingBox(this, block)){
            this.position.y = block.position.y + block.size;
            if (this.velocity.y < 0.0){
              this.velocity.y = 0.0;
            }
            this.onGround = true;
          }
        }
      }
    }
  })

module.exports = Player1;
