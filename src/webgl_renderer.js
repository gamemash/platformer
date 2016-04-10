let stampit = require('stampit');
let THREE = require('three');
let Sprite = require('./sprite.js');
let AnimatedSprite = require('./animated_sprite.js');
let PhysicsEngine = require('./physics_engine.js');

let Collidable = stampit()
  .refs({
    physicsEngine: PhysicsEngine
  })
  .init(function(){
    this.physicsEngine.addObject(this);
  });

let Goomba = stampit.compose(Sprite)
  .refs({
    texture: 'goomba.png'
  })
  .init(function(){
    this.material.uniforms['spriteLayout'] = { type: 'v2', value:  new THREE.Vector2( 3, 1) };
    this.material.uniforms['spritePosition'] = {type: "v2", value: new THREE.Vector2( 2, 0) };
  });

let ItemBlock = stampit.compose(AnimatedSprite).refs({texture: 'item_block.png'}).init(function() {
  this.material.uniforms['spriteLayout'] = { type: 'v2', value:  new THREE.Vector2( 3, 1) };
  this.material.uniforms['spritePosition'] = {type: "v2", value: new THREE.Vector2( 2, 0) };
});

let Ground = stampit.compose(Sprite, Collidable).refs({ texture: 'ground.png' });
let Block = stampit.compose(Sprite, Collidable).refs({ texture: 'block.png' })
let Brick = stampit.compose(Sprite, Collidable).refs({ texture: 'brick.png' });
let PipeTopLeft = stampit.compose(Sprite, Collidable).refs({ texture: 'pipe_top_left.png' });
let PipeTopRight = stampit.compose(Sprite, Collidable).refs({ texture: 'pipe_top_right.png' });
let PipeBottomLeft = stampit.compose(Sprite, Collidable).refs({ texture: 'pipe_bottom_left.png' });
let PipeBottomRight = stampit.compose(Sprite, Collidable).refs({ texture: 'pipe_bottom_right.png' });


let BlockData = [,Ground,Block, Brick, PipeTopLeft, PipeTopRight, PipeBottomLeft, PipeBottomRight, ItemBlock];
let WebGLRenderer = stampit()
  .methods({
    render: function(dt){
      this.renderer.render(this.scene, this.camera);

      for (let item of this.toUpdate) {
        item.update(dt);
      };
    },
    loadLevel: function(levelData){
      for (let y = levelData.length - 1; y >= 0; y -= 1){
        for (let x = 0; x < levelData[y].length; x += 1){
          if (levelData[y][x] != 0) {
            let block = BlockData[levelData[y][x]].create({renderer: this, position: new THREE.Vector2(x, levelData.length - 1 - y)});
            if (block.animated) {
              this.toUpdate.add(block);
            }
          }
        }
      }
    }
  })
  .init(function(){
    this.scene = new THREE.Scene();
    this.toUpdate = new Set();
    this.renderer = new THREE.WebGLRenderer({canvas: this.canvas, alpha: true});
    this.width = this.renderer.domElement.offsetWidth;
    this.height = this.renderer.domElement.offsetHeight;
    this.renderer.setSize(this.width, this.height);
    this.width /= 1.5;
    this.height /= 1.5;
    this.renderer.setClearColor(0x5c94fc, 0);
    this.camera = new THREE.OrthographicCamera(this.width / 2, this.width / 2, this.height / 2, this.height / 2, 0.1, 100 );
  });


module.exports = WebGLRenderer;
