let stampit = require('stampit');
let THREE = require('three');
let Animation = require('./animation.js');
let Sprite = require('./sprite.js');
let PhysicsEngine = require('./physics_engine.js');

let BumpAnimation = stampit.compose(Animation)
  .refs({
    speed: 5,
    amplitude: 0.5,
  })
  .methods({
    
    handleStop: function() {
      this.subject.position.copy(this.startPosition);
    },
    handleAnimation: function(dt) {
      this.subject.position.y = this.startPosition.y + Math.sin(this.time * Math.PI * this.speed) * this.amplitude;
    },
    handleStart: function() {
      this.startPosition = this.subject.position.clone();
    }
  });

let BrickAnimation = stampit.compose(BumpAnimation);

let NewMushroomAnimation = stampit.compose(Animation)
  .refs({
    speed: 2.5,
    amplitude: 1,
  })
  .methods({
    handleStop: function() {
      this.subject.position.copy(this.startPosition);
      this.subject.velocity.copy(this.objVelocity);
    },
    handleAnimation: function(dt) {
      this.subject.position.y = this.startPosition.y - 1 + this.time * this.speed * this.amplitude;
    },
    handleStart: function() {
      this.startPosition = this.subject.position.clone();
      this.objVelocity = this.subject.velocity.clone();
      this.subject.velocity.set(0, 0);
    }
  });

let Gravel = stampit.compose(Sprite)
  .refs({
    texture: "brick_piece.png"
  })
  .init(function(){
    this.velocity     = new THREE.Vector2(0, 0).fromArray(this.velocity);
    this.acceleration = new THREE.Vector2(0, -60);
  });

let BreakBrickAnimation = stampit.compose(Animation)
  .methods({
    handleStop: function() {
      for (let piece of this.gravel){
        this.game.renderer.deleteFromScene(piece.mesh);
      }
    },
    handleAnimation: function(dt) {
      for (let piece of this.gravel){
        PhysicsEngine.newtonianResponse(piece, dt);
      }
    },
    handleStart: function() {
      this.gravel = [
        Gravel.create({velocity: [6, 20], game: this.game, position: this.subject.position.clone() }),
        Gravel.create({velocity: [-6, 20], game: this.game, position: this.subject.position.clone() }),
        Gravel.create({velocity: [ 6, 10], game: this.game, position: this.subject.position.clone() }),
        Gravel.create({velocity: [-6, 10], game: this.game, position: this.subject.position.clone() })
      ];
    }
  });


module.exports = {
  BumpAnimation: BumpAnimation,
  BrickAnimation: BrickAnimation,
  NewMushroomAnimation: NewMushroomAnimation,
  BreakBrickAnimation: BreakBrickAnimation
}
