let stampit = require('stampit');
let THREE = require('three');
let Font = require('./font.js');
let Coin = require('./blocks.js').Coin;

let padZero = function(number, digits) {
    return Array(Math.max(digits - String(number).length + 1, 0)).join(0) + number;
}



let Interface = stampit()
  .refs({
  })
  .methods({
    updateScore: function(){
      this.score.setText(padZero(this.player.score, 6));
      this.coins.setText("x" + padZero(this.player.coins, 2));
    },
    updateTime: function(){
      this.time.setText(padZero(Math.round(this.game.gameRules.time),3));
    }
  })
  .init(function(){

    Font.create({position: new THREE.Vector2(5,15), text: this.player.name, game: this.game});
    this.score = Font.create({text: padZero(this.player.score, 6), position: new THREE.Vector2(5,14.5), game: this.game});
    this.player.statsChanged = this.updateScore.bind(this);


    this.coins = Font.create({position: new THREE.Vector2(10,14.5), text: ("x" + padZero(this.player.coins, 2)),    game: this.game});
    Coin.create({position: new THREE.Vector2(9,14.5), game: this.game, fixed: true});


    Font.create({position: new THREE.Vector2(13,15),   text: "WORLD",  game: this.game});
    Font.create({position: new THREE.Vector2(13,14.5), text: " 1-1",   game: this.game});

    Font.create({position: new THREE.Vector2(17,15),   text: "TIME",    game: this.game});
    this.time = Font.create({text: "000",  position: new THREE.Vector2(17.5,14.5), game: this.game});


  });


module.exports = Interface;
