let stampit = require('stampit');
let Animation = require('./animation.js');

let DelayedAction = stampit.compose(Animation)
  .refs({
    
  })
  .methods({
    handleStop: function(){
      this.action();
    }
  });

module.exports = DelayedAction;



