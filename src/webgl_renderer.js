let stampit = require('stampit');
let THREE = require('three');
let Sprite = require('./sprite.js');
let PhysicsEngine = require('./physics_engine.js');
let {ItemBlock, Ground, Block, Brick, PipeTopLeft, PipeTopRight, PipeBottomLeft, PipeBottomRight} = require('./blocks.js');
let FlagPole = require('./flag_pole.js');

let Blocks = [undefined, Ground, Block, Brick, PipeTopLeft, PipeTopRight, PipeBottomLeft, PipeBottomRight, ItemBlock, FlagPole];
let WebGLRenderer = stampit()
  .methods({
    render: function(dt){
      this.renderer.render(this.scene, this.camera);

      for (let item of this.toUpdate) {
        item.updateSprite(dt);
      };
    },
    addToScene: function(obj){
      this.scene.add(obj);
    },
    deleteFromScene: function(obj){
      this.scene.remove(obj);
    }
  })
  .init(function(){
    this.scene = new THREE.Scene();
    this.toUpdate = new Set();
    this.renderer = new THREE.WebGLRenderer({canvas: this.canvas, alpha: true});
    this.width = this.renderer.domElement.offsetWidth;
    this.height = this.renderer.domElement.offsetHeight;
    this.renderer.setSize(this.width, this.height);
    this.width /= 2;
    this.height /= 2;
    this.renderer.setClearColor(0x5c94fc, 0);
    this.camera = new THREE.OrthographicCamera(0, this.width, 0, this.height, 0.1, 100 );
  });


module.exports = WebGLRenderer;
