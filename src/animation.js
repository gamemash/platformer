let stampit = require('stampit');

let Animation = stampit()
  .refs({
    duration: 1,
    speed: 1

  })
  .methods({
    handleAnimation: function() {},
    handleStart: function() {},
    handleStop: function() {},
    handleReactivation: function() {},

    start: function(dt){
      if (this.subject.animation){
        this.handleReactivation(dt);
        return;
      }
      this.time = 0;
      this.handleStart();
      this.game.renderer.toAnimate.add(this);
      this.subject.animation = this;
    },
    stop: function(){
      this.handleStop();
      this.game.renderer.toAnimate.delete(this);
      delete this.subject.animation;
    },
    updateAnimation: function(dt){
      this.time += dt;
      if (this.time * this.speed > this.duration){
        this.stop();
      } else {
        this.handleAnimation(dt);
      }
    }
  })
  .init(function(){
    this.start();
  });


module.exports = Animation;
