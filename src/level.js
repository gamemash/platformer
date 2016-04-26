let stampit             = require('stampit');
let THREE               = require('three');
let {CoinBlock, MushroomBlock, FireFlowerBlock, Ground, Block, Brick, PipeTopLeft, PipeTopRight, PipeBottomLeft, PipeBottomRight, Coin, Tile, Castle} = require('./blocks.js');
let FlagPole = require('./flag_pole.js');
let Blocks = [undefined, Ground, Block, Brick, PipeTopLeft, PipeTopRight, PipeBottomLeft, PipeBottomRight, CoinBlock, FlagPole, MushroomBlock, Tile, Castle, FireFlowerBlock];

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
          }
        }
      }

      this.loadEntities(game);
    }

  });

module.exports = Level;

