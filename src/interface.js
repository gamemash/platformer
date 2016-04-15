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
    update: function(){
      this.score.setText(padZero(this.player.score, 6));
    }
  })
  .init(function(){

    Font.create({position: new THREE.Vector2(5,15), text: this.player.name, renderer: this.renderer});
    this.score = Font.create({text: padZero(this.player.score, 6), position: new THREE.Vector2(5,14.5), renderer: this.renderer});
    this.player.stateChanged = this.update.bind(this);


    Font.create({position: new THREE.Vector2(10,14.5), text: ("x" + padZero(this.player.coins, 2)),    renderer: this.renderer});
    Coin.create({position: new THREE.Vector2(9,14.5), renderer: this.renderer});


    Font.create({position: new THREE.Vector2(13,15),   text: "WORLD",  renderer: this.renderer});
    Font.create({position: new THREE.Vector2(13,14.5), text: " 1-1",   renderer: this.renderer});

    Font.create({position: new THREE.Vector2(17,15),   text: "TIME",    renderer: this.renderer});
    this.time = Font.create({text: " 000",  position: new THREE.Vector2(17,14.5), renderer: this.renderer});


  });


module.exports = Interface;
