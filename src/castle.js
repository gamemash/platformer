let stampit = require('stampit');
let Sprite = require('./sprite.js');
let THREE = require('three');

let Castle = stampit.compose(Sprite)
  .refs({
    size: new THREE.Vector2(5,5),
    spriteLayout: [1, 1],
    texture: 'small_castle.png'
  })
  .init(function(){
    
  });


module.exports = Castle;

