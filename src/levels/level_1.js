let stampit = require('stampit');
let Level = require('../level.js');
let {Goomba, Mushroom, Koopa} = require('../enemies.js')
let THREE               = require('three');
let FireFlower               = require('../fire_flower.js');

let levelData = [

];

let Level1_1 = stampit.compose(Level)
  .refs({
    levelData: levelData
  })
  .methods({
    loadEntities: function(game){
      for(var i=-2; i<3; i++) {
        Goomba.create({game: game, position: new THREE.Vector2(20+i*2, 7)})
      }
      Koopa.create({game: game, position: new THREE.Vector2(10, 3)});
    }
  });


module.exports = Level1_1;
