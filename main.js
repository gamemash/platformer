"use strict";

let stampit                                           = require('stampit');
let THREE                                             = require('three');
let WebGLRenderer                                     = require('./src/webgl_renderer.js');
let Player1                                           = require('./src/player1.js');
let gameStateController                               = require('./src/game_state_controller.js');
let Interface                                         = require('./src/interface.js');
let Game                                              = require('./src/game.js');
let Level                                             = require('./src/levels/level_1.js');
let {Block}                                           = require('./src/blocks.js');
let sounds                                            = require('./src/sounds.js');
let {inputStream, menuStream, jumpStream, inputState} = require("./src/input_stream.js");
let LevelEditor                                       = require("./src/level_editor.js");

let game = Game.create();
let renderer = WebGLRenderer.create({canvas: document.getElementById('game-canvas')});

game.renderer = renderer;
game.loadLevel(Level.create());
let player1  = Player1.create({game: game, position: new THREE.Vector2(5, 4) });
let gui      = Interface.create({game: game, player: player1});
game.player = player1;
game.gui = gui;
this.game = game;

game.start();

LevelEditor.create({game: game})