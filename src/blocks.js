let stampit = require('stampit');
let Sprite = require('./sprite.js');
let AnimatedSprite = require('./animated_sprite.js');
let THREE = require('three');
let Collidable = require('./collidable.js')

let ItemBlock = stampit.compose(AnimatedSprite, Collidable)
  .refs({
    texture: 'item_block.png',
    frames: [
      {id: 0, duration: 0.05},
      {id: 1, duration: 0.05},
      {id: 2, duration: 0.60},
      {id: 1, duration: 0.05},
      {id: 0, duration: 0.05}
    ]
  })
  .init(function() {
    this.material.uniforms['spriteLayout'] = { type: 'v2', value:  new THREE.Vector2( 3, 1) };
    this.material.uniforms['spritePosition'] = {type: "v2", value: new THREE.Vector2( 2, 0) };
  });

let Ground          = stampit.compose(Sprite, Collidable).refs({ texture: 'ground.png' });
let Block           = stampit.compose(Sprite, Collidable).refs({ texture: 'block.png' })
let Brick           = stampit.compose(Sprite, Collidable).refs({ texture: 'brick.png' });
let PipeTopLeft     = stampit.compose(Sprite, Collidable).refs({ texture: 'pipe_top_left.png' });
let PipeTopRight    = stampit.compose(Sprite, Collidable).refs({ texture: 'pipe_top_right.png' });
let PipeBottomLeft  = stampit.compose(Sprite, Collidable).refs({ texture: 'pipe_bottom_left.png' });
let PipeBottomRight = stampit.compose(Sprite, Collidable).refs({ texture: 'pipe_bottom_right.png' });

module.exports = {
  ItemBlock: ItemBlock,
  Ground: Ground,
  Block: Block,
  Brick: Brick,
  PipeBottomRight: PipeBottomRight,
  PipeBottomLeft: PipeBottomLeft,
  PipeTopRight: PipeTopRight,
  PipeTopLeft: PipeTopLeft
}