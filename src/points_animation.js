let stampit = require('stampit');
let Sprite = require('./sprite.js');
let THREE = require('three');
let Animation = require('./animation.js');

let PointsAnimation = stampit.compose(Animation)
  .refs({
    duration: 0.5,
    points: 100
  })
  .methods({
    pointToTexture: function(points){
      if (points > 1000){
        return "one_up.png";
      } else {
        return "points_" + points + ".png";
      }
    },
    handleStart: function(){
      this.point = Sprite.create({game: this.game, texture: this.pointToTexture(this.points), position: this.subject.position.clone()});
    },
    handleAnimation: function(dt){
      this.point.position.y += 2 * dt;
    },
    handleStop: function(){
      this.game.renderer.deleteFromScene(this.point.mesh);
    }
  });


module.exports = PointsAnimation;
