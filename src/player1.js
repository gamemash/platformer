let stampit = require('stampit');
let THREE = require('three');
let Mario = require('./mario.js');
let PhysicsEngine = require('./physics_engine.js');
let {inputStream, menuStream, inputState} = require("./input_stream.js");

let Player1 = stampit.compose(Mario)
  .refs({
    velocity: new THREE.Vector2(0, 0),
    acceleration: new THREE.Vector2(0, 0),
    groundResistance: 3,
    accelerationConstant: 1000
  })
  .methods({
    update: function(dt){
      document.getElementById("mariox").innerHTML = this.gridPosition()[0];
      document.getElementById("marioy").innerHTML = this.gridPosition()[1];
      let oldPosition = this.position.clone();


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

      let collision = PhysicsEngine.checkCollision(this.gridPosition());
      if (collision){
        if (collision.blockLeft) {

        }

        if (collision.blockRight) {

        }
        // console.log("collided", collision);
        //position = [
        //  Math.ceil(oldPosition.x / this.size),
        //  Math.ceil(oldPosition.y / this.size)
        //];
        //console.log(position);
        //position[0] *= this.size;
        //position[1] *= this.size;
        //this.position.fromArray(position);
        //this.velocity.x = 0;
        //this.acceleration.x = 0;
      }


    }
  })

module.exports = Player1;
