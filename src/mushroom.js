let stampit = require('stampit');
let SimpleAI = require('./simple_ai.js');
let Entity = require('./entity.js');
let THREE = require('three');
let Updateable = require('./updatable.js');
let Sprite = require('./sprite.js');
let {BumpAnimation, NewItemAnimation} = require('./animations.js');
let Animation = require('./animation.js');
let {Block, ItemBlock} = require('./blocks.js');
let sounds = require('./sounds.js');

let Mushroom = stampit.compose(Updateable, Sprite, Entity, SimpleAI)
  .refs({
    name: "Mushroom",
    texture: 'mushroom.png',
    walkSpeed: -2
  })
  .init(function(){
    Mushroom.NewAnimation.create({game: this.game, subject: this});
  });

Mushroom.NewAnimation = NewItemAnimation;

Mushroom.Block = stampit.compose(ItemBlock)
  .methods({
    collided: function(entity, direction) {
      if(direction == "below") {
        sounds.powerUpAppears.currentTime = 0;
        sounds.powerUpAppears.play();

        
        let block = this.transformToBlock();
        Mushroom.Block.Animation.create({game: this.game, subject: block});
      }
    }
  });


Mushroom.Block.Animation = stampit.compose(BumpAnimation)
  .methods({
    handleStop: function(){
      let shroomPosition = this.subject.position.clone();
      shroomPosition.y += 1;
      Mushroom.create({game: this.game, position: shroomPosition })
      Block.create({game: this.game, position: this.subject.position.clone() })
    }
  });


module.exports = Mushroom;
