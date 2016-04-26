let stampit = require('stampit');
let THREE = require('three');
let Mario = require('./mario.js');
let {jumpStream, inputState, shootStream} = require("./input_stream.js");
let sounds = require('./sounds.js');
let Debug = require('./debug.js');
let PointsAnimation = require('./points_animation.js');
let FireFlower = require('./fire_flower.js');

let Player1 = stampit.compose(Mario)
  .refs({
    name: "Mario",
    score: 0,
    coins: 0,
    streak: 0,
    invulnerable: false,
    input: inputState

  })
  .init(function(){
    Debug('score', this.score);
    jumpStream.onValue((x) => {
      if (this.onGround) {

        // this.acceleration.y += this.jumpForce / this.mass;
      }
    });

    shootStream.onValue((x) => {
      if (this.powerUp == 1){
        let position = this.position.clone();
        position.y += this.size.y - 0.5
        if (this.direction == "right"){
          position.x += 0.7
        }
        FireFlower.Fireball.create({game: this.game, position: position, direction: this.direction, player: this});
      }
    });

    jumpStream.onValue(function(x) {
      this.jump();
    }.bind(this));

    this.registerUpdateCallback(this.handleInput);

  })
  .methods({
    getsHit: function(){
      if (this.invulnerable) return;

      if (this.superMario){
        this.shrink();
        this.setPowerUp(0);
      } else {
        this.die();
      }
    },
    killed: function(entity){
      let addedScore = 100 * Math.pow(2, this.streak);
      this.score += addedScore;
      PointsAnimation.create({game: this.game, subject: entity, points: addedScore});
      this.streak += 1;
      if (this.statsChanged){
        this.statsChanged();
      }
    },
    reset: function(){
      this.superMario = false;
      this.disregardCollisions = false;
      this.position.x = 6;
      this.position.y = 5;
      this.acceleration.y = 0;
      this.velocity.y = 18;
      this.velocity.x = 2;
      this.setSizeY(1);
      this.setSpriteSizeY(1);
      this.setSpritePosition(new THREE.Vector2( 2, 0));
      this.game.gameRules.resetTime();
      sounds.kick.play();
      this.dead = false;
    },

    collided: function(block, direction){
      if (this.disregardCollisions) return;
      switch(direction){
        case 'above':
          this.position.y = block.position.y - this.size.y;
          this.velocity.y = 0;
          this.timeSinceJump = this.jumpLength;
          break;
        case 'below':
          this.position.y = block.position.y + block.size.y;
          this.velocity.y = 0;
          this.onGround = true;
          break;
        case 'right':
          this.position.x = block.position.x - this.size.x;
          this.velocity.x = 0;
          break;
        case 'left':
          this.position.x = block.position.x + block.size.x;
          this.velocity.x = 0;
          break;
      }
      if (this.onGround){
        this.streak = 0;
      }
    },
    handleInput: function(dt){
      if (this.input.pressed("right")){
        this.walking = "right";
      } else if (this.input.pressed("left")){
        this.walking = "left";
      } else {
        this.walking = "not";
      }

      if (this.input.pressed("run")){
        this.maxVelocity = 20;
      } else {
        this.maxVelocity = 14;
      }

      this.jumping = this.input.pressed("jump");
    }
  });

module.exports = Player1;
