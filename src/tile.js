let stampit = require('stampit');
let THREE = require('three');
let TileGeometry = require('./tile_geometry.js');
let ShaderLoader = require('./shader_loader.js');


let Tile = stampit()
  .refs({
    position: new THREE.Vector2(0, 0),
    shaders: [
      ShaderLoader.load('tile.vert'),
      ShaderLoader.load('tile.frag')
    ],
    size: 50

  })
  .methods({
    shadersReceived: function(result){

      this.material.vertexShader = result[0];
      this.material.fragmentShader = result[1];
      this.material.uniforms = {
        tileLocation: { type: "v2", value: this.position.multiplyScalar(this.size) },
        screenSize: {type: "v2", value: new THREE.Vector2(this.renderer.width, this.renderer.height) },
        tileSize: {type: "f", value: this.size }
  

      };
      this.material.needsUpdate = true;
    },
    updateMaterial: function(texture){
      this.material.uniforms.texture1 = { type: "t", value: texture };
      this.material.needsUpdate = true;
    }

  })
  .init(function(){
    this.material = new THREE.ShaderMaterial();
    this.geometry = TileGeometry.create();
    this.mesh = new THREE.Mesh(this.geometry.geometry, this.material);

    let loader = new THREE.TextureLoader();
    loader.load('images/ground.png', this.updateMaterial.bind(this));
    Promise.all(this.shaders).then(this.shadersReceived.bind(this));
    this.renderer.scene.add(this.mesh);
  });



module.exports = Tile;

