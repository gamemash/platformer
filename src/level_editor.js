let stampit                             = require('stampit');
let THREE                               = require('three');
let {mouseMoveStream, mouseClickStream} = require('./mouse_stream.js');
let Selector                            = require('./selector.js');
let _                                   = require('underscore');
let Blocks = require('./blocks.js');

function convertToGridCoordinatesForRenderer(renderer, pixelCoordinates) {
  let newCoordinates = new THREE.Vector2()
  newCoordinates.x = Math.floor((pixelCoordinates.x / 32)- renderer.camera.position.x);
  newCoordinates.y = Math.floor(pixelCoordinates.y / 32);
  return newCoordinates;
}

let LevelEditor = stampit
  .init(function(){
    this.selector = Selector.create({game: this.game, position: new THREE.Vector2(0, 0)});
    let convertToGridCoordinates = convertToGridCoordinatesForRenderer.bind(this, this.game.renderer);
    let mouseMoveGridStream = mouseMoveStream.map(convertToGridCoordinates);

    mouseMoveGridStream.onValue(this.selector.moveToCoordinates.bind(this.selector));

    let clickPositionStream = mouseMoveGridStream.sampledBy(mouseClickStream.filter((x) => {return x}));
    let dragPositionStream = mouseMoveStream.map(convertToGridCoordinates).filterBy(mouseClickStream);

    clickPositionStream
      .merge(dragPositionStream)
      .skipDuplicates(_.isEqual)
      .onValue((coordinates) => {
        let block = Block.create({game: this.game, position: coordinates });
      });

    document.getElementById('toolbox');

    for (var key in Blocks) {
      if (Blocks.hasOwnProperty(key)) {
        element = document.createElement("div");
      }
    }

  })
  .methods()

module.exports = LevelEditor;