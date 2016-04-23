let stampit = require('stampit');
let PhysicsEngine = require('./physics_engine.js');
let PointsAnimation = require('./points_animation.js');
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
        setTimeout((function(){
          koopa.remove();
        }.bind(koopa)),8000);
      } else {
        koopa.shell = true;
        koopa.velocity.set(0, 0);
        koopa.animationState = 'shell';
        koopa.setSize(new THREE.Vector2(1, 1));
        koopa.setSpriteSize(new THREE.Vector2(1, 1));
        setTimeout((function(){
          if (!koopa.pushed){
            koopa.reset();
          }
        }.bind(koopa)),3000);
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
    //enemy.die();
    enemy.disregardCollisions = true;
    enemy.dead = true;
    enemy.velocity.set(shell.velocity.x, 8);
    setTimeout((function(){
      enemy.remove();
    }.bind(enemy)),1000);
  },
  this.resolveBump =  function(entity_a, entity_b){
    entity_a.velocity.multiplyScalar(-1);
    entity_b.velocity.multiplyScalar(-1);
  },
  this.responses = {
    'ShellMario': this.shellHitsMario,
    'ShellGoomba': this.shellHitsEnemy,
    'MarioKoopa': this.marioHitsKoopa,
    'MushroomMario': this.mushroomMario,
    'MarioGoomba': this.marioHitsGoomba,
    'GoombaGoomba': this.resolveBump,
    'KoopaGoomba': this.resolveBump
  }
};


module.exports = new CollisionResponses();

