let stampit = require('stampit');
let THREE = require('three');
let SpriteGeometry = require('./sprite_geometry.js');
let ShaderLoader = require('./shader_loader.js');
let TextureLoader = require('./texture_loader.js');

let charMap = [
        ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', '-', 'x', '!'],
        ['Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'],
        ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P']
      ];

var Font = stampit()
  .refs({
    position: new THREE.Vector2(5, 5),
    text: "NO TEXT",
    fixed: false,
    shaders: [
      ShaderLoader.load('font.vert'),
      ShaderLoader.load('font.frag')
    ],
    fontSize: 2,
    size: 1
  })
  .methods({
    charToCoordinates: function(character){
      for (let y = 0; y < charMap.length; y += 1){
        let row = charMap[y];
        for (let x = 0; x < row.length; x += 1){
          if (row[x] == character){
            return [x, y, 0];
          }
        }
      }
      return [15, 0, 0];
    },
    textToData: function(text){
      let data = new Uint8Array(text.length * 3);
      for (let i = 0; i < text.length; i += 1){
        let character = text[i];
        let coordinates = this.charToCoordinates(character);

        data[i * 3 + 0] = coordinates[0];
        data[i * 3 + 1] = coordinates[1];
        data[i * 3 + 2] = coordinates[2];
      }
      return data;
    },
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
    setText: function(text){
      let length = text.length;
      let data = this.textToData(text);

      let dataTexture = new THREE.DataTexture(data, length, 1, THREE.RGBFormat);
      dataTexture.needsUpdate = true;
      this.material.uniforms.textData = { type: "t", value: dataTexture };
      this.material.uniforms.textLength = { type: "f", value: length };
      this.material.needsUpdate = true;
    }
  })
  .init(function(){
    this.material = new THREE.ShaderMaterial();
    this.material.uniforms = {
      tileLocation: { type: "v2", value: this.position.multiplyScalar(this.size) },
      screenSize: {type: "v2", value: new THREE.Vector2(this.renderer.width, this.renderer.height) },
      spriteLayout: {type: "v2", value: new THREE.Vector2(16, 3) },
      fontSize: {type: "f", value: this.fontSize},
      fixedPosition: {type: "i", value: this.fixed}
    
    }

    TextureLoader.get("font_white.png").then(this.updateMaterial.bind(this));
    Promise.all(this.shaders).then(this.shadersReceived.bind(this));

    this.geometry = SpriteGeometry.create();
    this.mesh = new THREE.Mesh(this.geometry.geometry, this.material);

    this.setText(this.text);

    this.renderer.addToScene(this.mesh);
  });

module.exports = Font;
