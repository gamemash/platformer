let stampit             = require('stampit');
let THREE               = require('three');
let {ItemBlock, Ground, Block, Brick, PipeTopLeft, PipeTopRight, PipeBottomLeft, PipeBottomRight} = require('./blocks.js');
let Blocks = [undefined, Ground, Block, Brick, PipeTopLeft, PipeTopRight, PipeBottomLeft, PipeBottomRight, ItemBlock];

let Level = stampit()
  .refs({
    entities: [],
    levelData: []
  })
  .methods({
    load: function(game){
      for (let y = this.levelData.length - 1; y >= 0; y -= 1){
        for (let x = 0; x < this.levelData[y].length; x += 1){
          if (this.levelData[y][x] != 0) {
            let block = Blocks[this.levelData[y][x]].create({game: game, position: new THREE.Vector2(x, this.levelData.length - 1 - y)});
            if (block.animated) {
              game.renderer.toUpdate.add(block);
            }
          }
        }
      }

      this.loadEntities(game);
    }

  });

module.exports = Level;

