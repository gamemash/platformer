let stampit = require('stampit');
let THREE = require('three');
let Animation = require('./animation.js');

let InvulnerableAnimation = stampit.compose(Animation)
  .refs({
    duration: 2
  })
  .methods({
    handleStop: function() {
      this.subject.invulnerable = false;
      this.subject.setOpacity(1);
    },
    handleAnimation: function(dt) {
      this.timeSinceAnimation += dt;
      if (this.timeSinceAnimation < this.animationSpeed) return;
      this.timeSinceAnimation = 0;

      if (this.opaque){
        this.subject.setOpacity(1);
      } else {
        this.subject.setOpacity(0.5);
      }
      this.opaque = !this.opaque;
    },
    handleStart: function() {
      this.opaque = false;
      this.subject.invulnerable = true;
      this.timeSinceAnimation = 0;
      this.animationSpeed = 0.1;
    }

  });

let GrowAnimation = stampit.compose(Animation)
  .refs({
    speed: 1,
  })
  .methods({
    handleStop: function() {
      this.subject.animated = true;
      this.game.renderer.updating = true;
      this.subject.setSizeY(2);
      this.subject.setSpriteSizeY(2);
      this.subject.setSpritePosition(new THREE.Vector2( 2, 1));
    },
    handleAnimation: function(dt) {
      this.timeSinceAnimation += dt;
      if (this.timeSinceAnimation < this.animationSpeed) return;
      this.timeSinceAnimation = 0;

      if (this.big){
        this.subject.setSizeY(this.subjectSize + this.time);
        this.subject.setSpriteSizeY(1.5);
        this.subject.setSpritePosition(new THREE.Vector2( 15, 1));
      } else {
        this.subject.setSizeY(this.subjectSize);
        this.subject.setSpriteSizeY(this.subjectSize);
        this.subject.setSpritePosition(new THREE.Vector2( 2, 0));
      }
      this.big = !this.big;
    },
    handleStart: function() {
      this.subject.animated = false;
      this.game.renderer.updating = false;
      this.subjectSize = this.subject.size.y;
      this.big = true;
      this.timeSinceAnimation = 0;
      this.animationSpeed = 0.1;
    }
  });

let ShrinkAnimation = stampit.compose(Animation)
  .refs({
    speed: 1,
  })
  .methods({
    handleStop: function() {
      this.subject.animated = true;
      this.game.renderer.updating = true;
      this.subject.setSizeY(1);
      this.subject.setSpriteSizeY(1);
      this.subject.setSpritePosition(new THREE.Vector2( 2, 0));
    },
    handleAnimation: function(dt) {
      this.timeSinceAnimation += dt;
      if (this.timeSinceAnimation < this.animationSpeed) return;
      this.timeSinceAnimation = 0;

      if (this.big){
        this.subject.setSizeY(2 - this.time);
        this.subject.setSpriteSizeY(1.5);
        this.subject.setSpritePosition(new THREE.Vector2( 15, 1));
      } else {
        this.subject.setSizeY(1);
        this.subject.setSpriteSizeY(1);
        this.subject.setSpritePosition(new THREE.Vector2( 11, 0));
      }
      this.big = !this.big;
    },
    handleStart: function() {
      this.subject.animated = false;
      this.game.renderer.updating = false;
      this.subjectSize = this.subject.size.y;
      this.big = false;
      this.timeSinceAnimation = 0;
      this.animationSpeed = 0.1;
    }
  });

let DeathAnimation = stampit.compose(Animation)
  .refs({
    duration: 3.25,
  })
  .methods({
    handleStop: function() {
      this.subject.animated = true;
      this.game.renderer.updating = true;
      this.subject.reset();
    },
    handleAnimation: function(dt) {
      this.subject.animatedSpriteUpdateCallback(dt);
      if (this.time > this.deathDelay){
        if (this.kick == false){
          this.subject.velocity.set(0,25);
          this.subject.acceleration.x = 0;
          this.kick = true;
        }
        this.subject.position.addScaledVector(this.subject.velocity, dt)
        this.subject.position.addScaledVector(this.subject.acceleration, dt * dt)
        this.subject.velocity.addScaledVector(this.subject.acceleration, dt)
      }
    },
    handleStart: function() {
      this.subject.setSpritePosition(new THREE.Vector2( 6, 0));
      this.deathDelay = 0.5;
      this.subject.animated = false;
      this.kick = false;
      this.game.renderer.updating = false;
    }
  });

module.exports = {
  InvulnerableAnimation: InvulnerableAnimation,
  GrowAnimation: GrowAnimation,
  ShrinkAnimation: ShrinkAnimation,
  DeathAnimation: DeathAnimation
}
