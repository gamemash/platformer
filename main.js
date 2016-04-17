"use strict";

let stampit                                           = require('stampit');
let THREE                                             = require('three');
let WebGLRenderer                                     = require('./src/webgl_renderer.js');
let Player1                                           = require('./src/player1.js');
let Selector                                          = require('./src/selector.js');
let {mouseMoveStream, mouseClickStream}               = require('./src/mouse_stream.js');
let gameStateController                               = require('./src/game_state_controller.js');
let Interface                                         = require('./src/interface.js');
let Game                                              = require('./src/game.js');
let Level                                             = require('./src/levels/level_1.js');
let {Block}                                           = require('./src/blocks.js');
let sounds                                            = require('./src/sounds.js');
let {inputStream, menuStream, jumpStream, inputState} = require("./src/input_stream.js");
let _                                                 = require('underscore');


let game = Game.create();
let renderer = WebGLRenderer.create({canvas: document.getElementById('game-canvas')});

game.renderer = renderer;
game.loadLevel(Level.create());
let player1  = Player1.create({game: game, position: new THREE.Vector2(5, 4) });
let gui      = Interface.create({game: game, player: player1});
game.player = player1;
game.gui = gui;
this.game = game;

let selector = Selector.create({game: game, position: new THREE.Vector2(0, 0)});

function convertToGridCoordinates(coordArray) {
  let newCoordArray = []
  newCoordArray[0] = Math.floor((coordArray[0] / 32)- renderer.camera.position.x);
  newCoordArray[1] = Math.floor(coordArray[1] / 32);
  return newCoordArray;
}

let mouseMoveGridStream = mouseMoveStream.map(convertToGridCoordinates);

mouseMoveGridStream.onValue((coordArray) => {
  selector.moveTo(coordArray[0],coordArray[1]);
});

let clickPositionStream = mouseMoveGridStream.sampledBy(mouseClickStream.filter((x) => {return x}));
let dragPositionStream = mouseMoveStream.map(convertToGridCoordinates).filterBy(mouseClickStream);

clickPositionStream
           .merge(dragPositionStream)
           .skipDuplicates(_.isEqual)
           .onValue((coordArray) => {
  let position = new THREE.Vector2(coordArray[0], coordArray[1]);
  let block = Block.create({game: this.game, position: position });
});

game.start();
