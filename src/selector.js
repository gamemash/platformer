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
    moveTo: function(x, y){
      this.position.x = x * this.size
      this.position.y = y * this.size
    }
  });


module.exports = Selector;
