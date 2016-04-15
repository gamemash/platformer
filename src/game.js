let stampit             = require('stampit');
let THREE               = require('three');
let {ItemBlock, Ground, Block, Brick, PipeTopLeft, PipeTopRight, PipeBottomLeft, PipeBottomRight} = require('./blocks.js');
let gameState           = require('./game_state.js');
let gameRules           = require('./game_rules.js').create();
let {Goomba}            = require('./enemies.js')

let Blocks = [undefined, Ground, Block, Brick, PipeTopLeft, PipeTopRight, PipeBottomLeft, PipeBottomRight, ItemBlock];
var Game = stampit()
  .refs({
    entities: []
  })
  .methods({
    start: function(){
      this.render();
    },
    loadLevel: function(levelData){
      for (let y = levelData.length - 1; y >= 0; y -= 1){
        for (let x = 0; x < levelData[y].length; x += 1){
          if (levelData[y][x] != 0) {
            let block = Blocks[levelData[y][x]].create({game: this, position: new THREE.Vector2(x, levelData.length - 1 - y)});
            if (block.animated) {
              this.renderer.toUpdate.add(block);
            }
          }
        }
      }

      for(var i=-2; i<3; i++) {
        let goom = Goomba.create({game: this, position: new THREE.Vector2(20+i*2, 6)})
        this.entities.push(goom);
      }

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
