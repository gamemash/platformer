let stampit = require('stampit');
let Sprite = require('./sprite.js');
let THREE = require('three');
let Entity = require('./entity.js');

let Castle = stampit.compose(Sprite, Entity)
  .refs({
    name: "Castle",
    size: new THREE.Vector2(5,5),
    spriteLayout: [1, 1],
    zIndex: 0.5,
    texture: 'small_castle.png'
  })
  .init(function(){
     this.flag = Castle.Flag.create({game: this.game, position: new THREE.Vector2(this.position.x + 2, this.position.y + 3.5)});
     this.updateUniforms();
  });

Castle.Flag = stampit.compose(Sprite)
  .refs({
    texture: 'castle_flag.png',
  });
  

module.exports = Castle;

