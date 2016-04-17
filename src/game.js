let stampit             = require('stampit');
let THREE               = require('three');
let gameState           = require('./game_state.js');
let GameRules           = require('./game_rules.js');
let List                = require('./list.js');

var Game = stampit()
  .refs({
    entities: new List(),
    gameRules: GameRules.create()
  })
  .methods({
    start: function(){
      this.gameRules.levelInProgress = true;
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

        if (this.renderer.updating){
          //this.player.update(dt);
          this.gui.updateTime(dt);
          this.gameRules.update(this.player, this.entities, gameState);
        }
        this.renderer.render(dt);

        this.entities.clean();
      }

      requestAnimationFrame(this.gameloop.bind(this));
    }
  });



module.exports = Game;
