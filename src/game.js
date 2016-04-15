let stampit             = require('stampit');
let THREE               = require('three');
let gameState           = require('./game_state.js');
let GameRules           = require('./game_rules.js');

var Game = stampit()
  .refs({
    entities: [],
    gameRules: GameRules.create()
  })
  .methods({
    start: function(){
      this.gameloop();
    },
    loadLevel: function(level){
      this.level = level;
      this.level.load(this);
    },
    gameloop: function(){
      let dt = 1/60;
      if (!gameState.paused) {
        let relativeCameraPosition = this.player.position.x + this.renderer.camera.position.x;
        if (relativeCameraPosition > 16){
          this.renderer.camera.position.x = (16 - this.player.position.x);
        }

        if (relativeCameraPosition < 4 && this.renderer.camera.position.x < 0){
          this.renderer.camera.position.x = (4 - this.player.position.x);
        }

        this.player.update(dt);
        this.renderer.render(dt);
        this.gui.updateTime();

        this.gameRules.update(this.player, this.entities, gameState);
      }

      requestAnimationFrame(this.gameloop.bind(this));
    }
  });



module.exports = Game;
