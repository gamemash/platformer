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
  })

module.exports = {
  BumpAnimation: BumpAnimation
}
