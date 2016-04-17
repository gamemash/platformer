let stampit = require('stampit');
let THREE = require('three');
let SpriteGeometry = require('./sprite_geometry.js');
let ShaderLoader = require('./shader_loader.js');
let TextureLoader = require('./texture_loader.js');

let loader = new THREE.TextureLoader();
let Sprite = stampit()
  .refs({
    fixed: false,
    size: new THREE.Vector2(1, 1),
    shaders: [
      ShaderLoader.load('tile.vert'),
      ShaderLoader.load('tile.frag')
    ]

  })
  .methods({
    shadersReceived: function(result){
      this.material.vertexShader = result[0];
      this.material.fragmentShader = result[1];
      this.material.needsUpdate = true;
    },
    updateMaterial: function(texture){
      texture.magFilter = THREE.NearestFilter;
      texture.minFilter = THREE.NearestFilter;
      this.material.uniforms.texture1 = { type: "t", value: texture };
      this.material.needsUpdate = true;
    },
    gridPosition: function(){
      return [Math.round(this.position.x), Math.round(this.position.y)];
    }
  })
  .init(function(){
    //this.position = new THREE.Vector2(0, 0);
    this.material = new THREE.ShaderMaterial();
    this.material.uniforms = {
      tileLocation: { type: "v2", value: this.position },
      screenSize: {type: "v2", value: this.game.renderer.screenSize},
      fixedPosition: {type: "i", value: this.fixed}
    };
    this.geometry = SpriteGeometry.create();
    this.mesh = new THREE.Mesh(this.geometry.geometry, this.material);

    TextureLoader.get(this.texture).then(this.updateMaterial.bind(this));
    Promise.all(this.shaders).then(this.shadersReceived.bind(this));
    this.game.renderer.addToScene(this.mesh);
  });



module.exports = Sprite;

