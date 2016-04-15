let stampit             = require('stampit');
let THREE               = require('three');
let gameState           = require('./game_state.js');
let gameRules           = require('./game_rules.js').create();

var Game = stampit()
  .refs({
    entities: []
  })
  .methods({
    start: function(){
      this.render();
    },
    loadLevel: function(level){
      this.level = level;
      this.level.load(this);
    },
    render: function(){
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

        gameRules.update(this.player, this.entities, gameState);
      }

      requestAnimationFrame(this.render.bind(this));
    }
  });



module.exports = Game;
