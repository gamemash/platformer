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
    boundingBox: function(obj_a, obj_b){
      let a_xy = obj_a.position;
      let a_XY = new THREE.Vector2(obj_a.size + obj_a.position.x, obj_a.size + obj_a.position.y);

      let b_xy = obj_a.position;
      let b_XY = new THREE.Vector2(obj_b.size + obj_b.position.x, obj_b.size + obj_b.position.y);

      let not_collided = (
        a_XY.x < b_xy.x || b_XY.x < a_xy.x || 
        a_XY.y < b_xy.y || b_XY.y < a_xy.y);
      return !not_collided;
    },
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

      let position = this.gridPosition();
      let collision = PhysicsEngine.checkCollision(position);
      document.getElementById("blockLeft").innerHTML = false;
      if (collision){
        if (collision.blockLeft) {
          //let blockPosition = [position[0] - 1, position[1]];
          if (this.boundingBox(this, collision.blockLeft)){
            this.position.x = collision.blockLeft.size + collision.blockLeft.position.x;
            if (this.velocity.x < 0.0){
              this.velocity.x = 0.0;
              this.acceleration.x = 0.0;
            }
          }

          //document.getElementById("blockRight").innerHTML = blockRight;
          //if (this.velocity.x < 0)
          //  this.velocity.x = 0;
          //this.position.x = (blockPosition[0] + 1) * this.size;
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
