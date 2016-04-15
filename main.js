"use strict";

let stampit             = require('stampit');
let THREE               = require('three');
let WebGLRenderer       = require('./src/webgl_renderer.js');
let Player1             = require('./src/player1.js');
let Selector            = require('./src/selector.js');
let MouseState          = require('./src/mouse_state.js');
let MouseStream         = require('./src/mouse_stream.js');
let gameRules           = require('./src/game_rules.js').create();
let gameState           = require('./src/game_state.js');
let gameStateController = require('./src/game_state_controller.js');
let Interface           = require('./src/interface.js');
let Game                = require('./src/game.js');
let Level               = require('./src/levels/level_1.js');

let {inputStream, menuStream, jumpStream, inputState} = require("./src/input_stream.js");


let game = Game.create();
let renderer = WebGLRenderer.create({canvas: document.getElementById('game-canvas')});

game.renderer = renderer;
game.loadLevel(Level.create());
let player1  = Player1.create({game: game, position: new THREE.Vector2(5, 4) });
let gui      = Interface.create({game: game, player: player1, gameRules: gameRules});
game.player = player1;
game.gui = gui;


game.start();

let selector = Selector.create({game: game, position: new THREE.Vector2(0, 0)});
let mouseState = MouseState.create({canvasId: "game-canvas"});

mouseState.addListener(function(x,y) {
  x = Math.floor(x/32 - renderer.camera.position.x);
  y = Math.floor(y/32);
  selector.moveTo(x,y);
});
