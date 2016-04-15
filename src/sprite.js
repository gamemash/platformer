let stampit = require('stampit');
let THREE = require('three');
let SpriteGeometry = require('./sprite_geometry.js');
let ShaderLoader = require('./shader_loader.js');
let TextureLoader = require('./texture_loader.js');

let loader = new THREE.TextureLoader();
let Sprite = stampit()
  .refs({
    spriteLayout: new THREE.Vector2(1, 1),
    spritePosition: new THREE.Vector2(0, 0),
    position: new THREE.Vector2(0, 0),
    fixed: false,
    shaders: [
      ShaderLoader.load('tile.vert'),
      ShaderLoader.load('tile.frag')
    ],
    size: 1

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
      return [Math.round(this.position.x / this.size), Math.round(this.position.y / this.size)];
    }
  })
  .init(function(){
    this.material = new THREE.ShaderMaterial();
    if (!this.game){
      console.log(this);
    }
    this.material.uniforms = {
      tileLocation: { type: "v2", value: this.position.multiplyScalar(this.size) },
      screenSize: {type: "v2", value: new THREE.Vector2(this.game.renderer.width, this.game.renderer.height) },
      tileSize: {type: "f", value: this.size },
      spriteLayout: {type: "v2", value: this.spriteLayout },
      spritePosition: {type: "v2", value: this.spritePosition },
      spriteFlipped: {type: 'i', value: false },
      fixedPosition: {type: "i", value: this.fixed}
    };
    this.geometry = SpriteGeometry.create();
    this.mesh = new THREE.Mesh(this.geometry.geometry, this.material);

    TextureLoader.get(this.texture).then(this.updateMaterial.bind(this));
    Promise.all(this.shaders).then(this.shadersReceived.bind(this));
    this.game.renderer.addToScene(this.mesh);
  });



module.exports = Sprite;

