let stampit = require('stampit');
let THREE = require('three');
let Sprite = require('./sprite.js');

let Selector = stampit.compose(Sprite)
  .refs({
    texture: 'selector.png',
  })
  .init(function(){
  })
  .methods({
    update: function(dt){
    },
    moveToCoordinates: function(vector){
      this.position.x = vector.x;
      this.position.y = vector.y;
    }
  });


module.exports = Selector;
