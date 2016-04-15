"use strict";

let stampit             = require('stampit');
let THREE               = require('three');
let WebGLRenderer       = require('./src/webgl_renderer.js');
let Player1             = require('./src/player1.js');
let Selector            = require('./src/selector.js');
let MouseState          = require('./src/mouse_state.js');
let MouseStream         = require('./src/mouse_stream.js');
let Debug               = require('./src/debug.js');
let {Goomba}            = require('./src/enemies.js')
let gameRules           = require('./src/game_rules.js').create();
let gameState           = require('./src/game_state.js');
let gameStateController = require('./src/game_state_controller.js');
let levelData           = require('./src/level_data.js');
let Interface           = require('./src/interface.js');

let {inputStream, menuStream, jumpStream, inputState} = require("./src/input_stream.js");

let renderer = WebGLRenderer.create({canvas: document.getElementById('game-canvas')});
let player1  = Player1.create({renderer: renderer, position: new THREE.Vector2(5, 4) });
let gui      = Interface.create({renderer: renderer, player: player1, gameRules: gameRules});
renderer.loadLevel(levelData['1-1']);

let entities = []

for(var i=-2; i<3; i++) {
  let goom = Goomba.create({renderer: renderer, position: new THREE.Vector2(20+i*2, 6)})
  entities.push(goom);
}

entities.push();

function render() {
  let dt = 1/60;
  if (!gameState.paused) {
    let relativeCameraPosition = player1.position.x + renderer.camera.position.x;
    if (relativeCameraPosition > 16){
      renderer.camera.position.x = (16 - player1.position.x);
    }

    if (relativeCameraPosition < 4 && renderer.camera.position.x < 0){
      renderer.camera.position.x = (4 - player1.position.x);
    }

    player1.update(dt);
    renderer.render(dt);
    gui.updateTime();

    gameRules.update(player1, entities, gameState);
  }

  Debug('mario-x', player1.position.x);
  Debug('mario-y', player1.position.y);

  requestAnimationFrame(render);
}

render();

let selector = Selector.create({renderer: renderer, position: new THREE.Vector2(0, 0)});
let mouseState = MouseState.create({canvasId: "game-canvas"});

mouseState.addListener(function(x,y) {
  x = Math.floor(x/32 - renderer.camera.position.x);
  y = Math.floor(y/32);
  selector.moveTo(x,y);
});