let stampit = require('stampit');
let THREE = require('three');
let Animation = require('./animation.js');

let BumpAnimation = stampit.compose(Animation)
  .refs({
    speed: 5,
    amplitude: 0.5,
  })
  .methods({
    
    handleStop: function() {
      this.subject.position.copy(this.startPosition);
    },
    handleAnimation: function(dt) {
      this.subject.position.y = this.startPosition.y + Math.sin(this.time * Math.PI * this.speed) * this.amplitude;
    },
    handleStart: function() {
      this.startPosition = this.subject.position.clone();
    }
  });

let BrickAnimation = stampit.compose(BumpAnimation);

let NewMushroomAnimation = stampit.compose(Animation)
  .refs({
    speed: 2.5,
    amplitude: 1,
  })
  .methods({
    handleStop: function() {
      this.subject.position.copy(this.startPosition);
      this.subject.velocity.copy(this.objVelocity);
    },
    handleAnimation: function(dt) {
      this.subject.position.y = this.startPosition.y - 1 + this.time * this.speed * this.amplitude;
    },
    handleStart: function() {
      this.startPosition = this.subject.position.clone();
      this.objVelocity = this.subject.velocity.clone();
      this.subject.velocity.set(0, 0);
    }
  });



module.exports = {
  BumpAnimation: BumpAnimation,
  BrickAnimation: BrickAnimation,
  NewMushroomAnimation: NewMushroomAnimation
}
