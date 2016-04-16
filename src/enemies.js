let stampit = require('stampit');
let Sprite = require('./sprite.js');
let AnimatedSprite = require('./animated_sprite.js');
let THREE = require('three');
let Updateable = require('./updatable.js');
let Entity = require('./entity.js');
let Collidable = require('./collidable.js');
let Debug = require('./debug.js');
let SimpleAI = require('./simple_ai.js');
let sounds = require('./sounds.js');
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
    walkSpeed: 3
  })
  .methods({
    die: function(){
      this.dead = true;
      this.velocity.set(0, 0);
      this.animationState = 'dead';
      setTimeout((function(){
        this.remove();
      }.bind(this)),1000);
    }
  })
  .init(function(){
    this.material.uniforms['spriteLayout'] = { type: 'v2', value:  new THREE.Vector2( 3, 1) };
    this.material.uniforms['spritePosition'] = {type: 'v2', value: new THREE.Vector2( 0, 0) };

    function isMario(collision) { return (collision.entity.name == "MARIO"); }
    function cameFromAbove(collision){ return (collision.direction == "above"); }
    function didntComeFromAbove(collision){ return ! cameFromAbove(collision); }

    this.collisionsWithMario = this.collisionStream.filter(isMario)

    this.collisionsWithMario.filter(cameFromAbove)
        .onValue(function(collision) {
          if (!this.dead) {
            this.die();
            collision.entity.killed(this);
            collision.entity.velocity.y = 17;
            sounds.stomp.play();
          }
        }.bind(this));

    this.collisionsWithMario.filter(didntComeFromAbove).onValue(function(collision) {
      collision.entity.die();
    });
  });

let Mushroom = stampit.compose(Updateable, Sprite, Entity, SimpleAI)
  .refs({
    name: "Mushroom",
    texture: 'mushroom.png',
    walkSpeed: -2
  })
  .init(function(){
    NewMushroomAnimation.create({game: this.game, subject: this});
    this.collisionStream
        .filter((x) => {return (x.entity.name == "MARIO")})
        .onValue(function(collision) {
          console.log("collide");
          // TODO: Refactor this somehow?
          // modules need to register 'cleanup' callbacks
          // to a 'cleanupable' component?
          sounds.powerUp.play();
          this.delete(); // Updateable
          this.remove(); // Entity
          collision.entity.grow();
        }.bind(this))
  });

module.exports = {
  Goomba: Goomba,
  Mushroom: Mushroom
}
