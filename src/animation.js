let stampit = require('stampit');

let Animation = stampit()
  .refs({
    duration: 1,
    amplitude: 0.5,
    speed: 5

  })
  .methods({
    start: function(dt){
      this.startPosition = this.subject.position.clone();
      this.time = 0;
      this.game.renderer.toAnimate.add(this);
    },
    stop: function(){
      this.subject.position.copy(this.startPosition);
      this.game.renderer.toAnimate.delete(this);
    },
    updateAnimation: function(dt){
      this.time += dt;
      if (this.time * this.speed > this.duration){
        this.stop();
      } else {
        this.subject.position.y = this.startPosition.y + Math.sin(this.time * Math.PI * this.speed) * this.amplitude;
      }
    }
  })
  .init(function(){
    this.start();
  });


module.exports = Animation;
