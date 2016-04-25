let stampit = require('stampit');
let PhysicsEngine = require('./physics_engine.js');
let PointsAnimation = require('./points_animation.js');
let PlayerAnimations = require('./player_animations.js');
let DelayedAction = require('./delayed_action.js');
let THREE = require('three');

let CollisionResponses = function(){
  this.resolve = function(entity_a, entity_b){
    if (entity_a.disregardCollisions || entity_b.disregardCollisions) return;
    let result = [entity_a, entity_b].sort(function(a, b){
      return a.name < b.name;
    });
    let collision = result[0].name + result[1].name;

    if (this.responses[collision]){
      this.responses[collision](result[0],result[1]);
    } else {
      console.log("No response for ", collision);
    }
  },
  this.marioHitsKoopa = function(mario, koopa){
    if (koopa.dead || mario.dead) return;

    if (PhysicsEngine.hitFromAbove(mario, koopa)){
      if (koopa.shell){
        koopa.pushed = true;
        koopa.name = 'Shell';
        let direction = (mario.position.x < koopa.position.x ? 1 : -1 );
        koopa.velocity.set(direction * 10, 0);
        DelayedAction.create({
          game: mario.game,
          action: (function(){
            koopa.remove();
          }),
          duration: 8
        });
      } else {
        koopa.shell = true;
        koopa.velocity.set(0, 0);
        koopa.animationState = 'shell';
        koopa.setSize(new THREE.Vector2(1, 1));
        koopa.setSpriteSize(new THREE.Vector2(1, 1));
        DelayedAction.create({
          game: mario.game,
          action: (function(){
            koopa.reset();
          }),
          duration: 3
        });
      }
      mario.velocity.y = 17;
    } else {
      mario.getsHit();
    }

  },
  this.mushroomMario = function(mushroom, mario){
    mario.grow();
    PointsAnimation.create({game: mario.game, points: 1000, subject: mushroom});
    mushroom.remove();
    mario.score += 1000;
    mario.statsChanged();
  },
  this.marioHitsGoomba = function(mario, goomba){
    if (goomba.dead || mario.dead) return;
    if (PhysicsEngine.hitFromAbove(mario, goomba)){
      console.log("mario hits goomba and goomba dies");
      goomba.die();
      mario.velocity.y = 17;
      mario.killed(goomba);
    } else {
      mario.getsHit();
    }
  },
  this.shellHitsMario = function(shell, mario){
    mario.getsHit();
    if (mario.position.x > shell.position.x){
      shell.velocity.x = -Math.abs(shell.velocity.x);
    } else {
      shell.velocity.x = Math.abs(shell.velocity.x);
    }
  },
  this.shellHitsEnemy = function(shell, enemy){
    enemy.disregardCollisions = true;
    enemy.dead = true;
    enemy.velocity.set(shell.velocity.x, 8);
    DelayedAction.create({
      game: mario.game,
      action: (function(){
        enemy.remove();
      }),
      duration: 1
    });
  },
  this.resolveBump =  function(entity_a, entity_b){
    entity_a.velocity.multiplyScalar(-1);
    entity_b.velocity.multiplyScalar(-1);
  },
  this.marioEntersCastle = function(mario, castle){
    if (mario.position.x > castle.position.x - 1 + castle.size.x / 2){
      mario.remove();
      mario.delete();
      DelayedAction.create({
        game: mario.game,
        action: (function(){
          PlayerAnimations.CalculateScoreAnimation.create({game: castle.game, subject: mario, flag: castle.flag});
        }),
        duration: 1
      });
    }
  },
  this.marioHitsFlagpole = function(mario, flagpole){
    flagpole.disregardCollisions = true;

    //shitty equation, need more number pictures...
    let points = Math.pow(2,Math.round(Math.sqrt(mario.position.y - flagpole.position.y))) * 100;
    mario.score += points;
    mario.statsChanged();
    PointsAnimation.create({game: mario.game, points: points, subject: mario, duration: 2});
    PlayerAnimations.VictoryAnimation.create({game: mario.game, subject: mario, flagpole: flagpole});
  },
  this.marioPicksupFireFlower = function(mario, flower){
    flower.remove();
    PlayerAnimations.FlowerAnimation.create({game: mario.game, subject: mario});
  },
  this.responses = {
    'MarioCastle': this.marioEntersCastle,
    'MarioFlagpole': this.marioHitsFlagpole,
    'ShellMario': this.shellHitsMario,
    'ShellGoomba': this.shellHitsEnemy,
    'MarioKoopa': this.marioHitsKoopa,
    'MushroomMario': this.mushroomMario,
    'MarioGoomba': this.marioHitsGoomba,
    'GoombaGoomba': this.resolveBump,
    'KoopaGoomba': this.resolveBump,
    'MarioFireFlower': this.marioPicksupFireFlower
  }
};


module.exports = new CollisionResponses();

