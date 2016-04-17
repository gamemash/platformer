let stampit = require('stampit');
let Sprite = require('./sprite.js');
let AnimatedSprite = require('./animated_sprite.js');
let THREE = require('three');
let Collidable = require('./collidable.js');
let StaticCollidable = require('./static_collidable.js');
let sounds = require('./sounds.js');
let {BumpAnimation, BrickAnimation} = require('./animations.js')
let {Goomba, Mushroom} = require('./enemies.js')

let Ground          = stampit.compose(Sprite, StaticCollidable).refs({ name: 'ground', texture: 'ground.png' });
let Block           = stampit.compose(Sprite, StaticCollidable).refs({ texture: 'block.png' })
let PipeTopLeft     = stampit.compose(Sprite, StaticCollidable).refs({ texture: 'pipe_top_left.png' });
let PipeTopRight    = stampit.compose(Sprite, StaticCollidable).refs({ texture: 'pipe_top_right.png' });
let PipeBottomLeft  = stampit.compose(Sprite, StaticCollidable).refs({ texture: 'pipe_bottom_left.png' });
let PipeBottomRight = stampit.compose(Sprite, StaticCollidable).refs({ texture: 'pipe_bottom_right.png' });

let MushroomBlockAnimation = stampit.compose(BumpAnimation)
  .methods({
    handleStop: function(){
      let shroomPosition = this.subject.position.clone();
      shroomPosition.y += 1;
      Mushroom.create({game: this.game, position: shroomPosition })
      Block.create({game: this.game, position: this.subject.position.clone() })
    }
  });


let ItemBlock = stampit.compose(AnimatedSprite, StaticCollidable)
  .refs({
    texture: 'item_block.png',
    animationState: "blinking",
    animations: {
      blinking: [
        {id: 0, duration: 0.05},
        {id: 1, duration: 0.05},
        {id: 2, duration: 0.60},
        {id: 1, duration: 0.05},
        {id: 0, duration: 0.05}
      ]
    },
    spritePosition: new THREE.Vector2( 2, 0),
    spriteLayout: new THREE.Vector2( 3, 1)
  })
  .init(function(){
    this.collisionStream.onValue((collision) => {
      let direction = collision.direction;
      if(direction == "below") {
        sounds.powerUpAppears.currentTime = 0;
        sounds.powerUpAppears.play();

        this.game.renderer.deleteFromScene(this.mesh);
        let block = Block.create({game: this.game, position: this.position.clone() });
        MushroomBlockAnimation.create({game: this.game, subject: block});
      }
    });
  });

let Coin = stampit.compose(AnimatedSprite, StaticCollidable)
  .refs({
    texture: 'coin.png',
    animationState: "blinking",
    animations: {
      blinking: [
        {id: 0, duration: 0.05},
        {id: 1, duration: 0.05},
        {id: 2, duration: 0.60},
        {id: 1, duration: 0.05},
        {id: 0, duration: 0.05}
      ]
    },
    spritePosition: new THREE.Vector2( 2, 0),
    spriteLayout: new THREE.Vector2( 3, 1)
  });


let Brick = stampit.compose(Sprite, StaticCollidable)
    .refs({
      bumptime: 0,
      texture: 'brick.png'
    })
    .init(function(){
      this.collisionStream.onValue((collision) => {
        let direction = collision.direction;
        if(direction == "below") {
          sounds.breakBlock.currentTime = 0;
          sounds.breakBlock.play();
          BrickAnimation.create({game: this.game, subject: this});
        }
      });
    })
    .methods({
      bump: function(){
        if (this.bumptime < 0.4){
          this.position.y += Math.sin(bumptime);
          this.bumptime = 0;
        }
      }
    });

module.exports = {
  ItemBlock: ItemBlock,
  Ground: Ground,
  Block: Block,
  Brick: Brick,
  PipeBottomRight: PipeBottomRight,
  PipeBottomLeft: PipeBottomLeft,
  PipeTopRight: PipeTopRight,
  PipeTopLeft: PipeTopLeft,
  Coin: Coin
}
