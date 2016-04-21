let stampit = require('stampit');
let THREE = require('three');
let CustomShader = require('./custom_shader.js');

let loader = new THREE.TextureLoader();
let Sprite = stampit.compose(CustomShader)
  .refs({
    fixed: false,
    size: new THREE.Vector2(1, 1),
    shaders: {
      vertexShader: 'tile.vert',
      fragmentShader: 'tile.frag'
    }
  })
  .methods({
    gridPosition: function(){
      return [Math.round(this.position.x), Math.round(this.position.y)];
    }
  })
  .init(function(){
    this.uniforms = {
      tileLocation: { type: "v2", value: this.position },
      screenSize: {type: "v2", value: this.game.renderer.screenSize},
      fixedPosition: {type: "i", value: this.fixed}
    };
    this.setupCustomShader();
    this.game.renderer.addToScene(this.mesh);
  });



module.exports = Sprite;

