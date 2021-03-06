let stampit = require('stampit');
let THREE = require('three');

let CustomShader = require('./custom_shader.js');

let charMap = [
        ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', '-', 'x', '!'],
        ['Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'],
        ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P']
      ];

var Font = stampit.compose(CustomShader)
  .refs({
    spriteLayout: [16, 3],
    spritePosition: [0, 0],
    text: "NO TEXT",
    texture: "font_white.png",
    shaders: {
      vertexShader: 'font.vert',
      fragmentShader: 'font.frag'
    },
    fixed: true,
    fontSize: 2,
    size: new THREE.Vector2(1,1)
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
    setText: function(text){
      let length = text.length;
      let data = this.textToData(text);

      let dataTexture = new THREE.DataTexture(data, length, 1, THREE.RGBFormat);
      dataTexture.needsUpdate = true;
      this.material.uniforms.textData = { type: "t", value: dataTexture };
      this.material.uniforms.textLength = { type: "f", value: length };
      this.material.needsUpdate = true;
    },
    gridPosition: function(){
      return [Math.round(this.position.x), Math.round(this.position.y)];
    }
  })
  .init(function(){
    this.spriteLayout = new THREE.Vector2(0, 0).fromArray(this.spriteLayout);
    this.spritePosition = new THREE.Vector2(0, 0).fromArray(this.spritePosition);
    this.uniforms = {
      fontSize: {type: "f", value: this.fontSize},
      tileLocation: { type: "v2", value: this.position },
      screenSize: {type: "v2", value: this.game.renderer.screenSize},
      tileSize: {type: "v2", value: this.size },
      spriteLayout: {type: "v2", value: this.spriteLayout },
      spritePosition: {type: "v2", value: this.spritePosition },
      fixedPosition: {type: "i", value: this.fixed}
    };

    this.setupCustomShader();
    this.game.renderer.addToScene(this.mesh);
    this.setText(this.text);
  });

module.exports = Font;
