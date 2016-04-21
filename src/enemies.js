let stampit = require('stampit');
let Sprite = require('./sprite.js');
let AnimatedSprite = require('./animated_sprite.js');
let THREE = require('three');
let Updateable = require('./updatable.js');
let Entity = require('./entity.js');
let Collidable = require('./collidable.js');
let Debug = require('./debug.js');
let SimpleAI = require('./simple_ai.js');
let {BumpAnimation, BrickAnimation, NewMushroomAnimation} = require('./animations.js')

let Goomba = stampit.compose(Updateable, AnimatedSprite, Entity, SimpleAI)
  .refs({
    name: "Goomba",
    deadly: true,
    texture: 'goomba.png',
    animationState: "walking",
    animations: {
      walking: [{id:0, duration: 0.15}, {id:1, duration: 0.15}],
      dead: [{id:2, duration: 1}]
    },
    spritePosition: [0, 0],
    spriteLayout: [3, 1],
    walkSpeed: 3
  })
  .methods({
    die: function(){
      this.dead = true;
      this.velocity.set(0, 0);
      this.animationState = 'dead';
      setTimeout((function(){
        this.delete();
      }.bind(this)),1000);
    }
  });

let Mushroom = stampit.compose(Updateable, Sprite, Entity, SimpleAI)
  .refs({
    name: "Mushroom",
    texture: 'mushroom.png',
    walkSpeed: -2
  })
  .init(function(){
    NewMushroomAnimation.create({game: this.game, subject: this});
  });

module.exports = {
  Goomba: Goomba,
  Mushroom: Mushroom
}
