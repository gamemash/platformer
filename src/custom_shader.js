let stampit = require('stampit');
let THREE = require('three');
let SpriteGeometry = require('./sprite_geometry.js');
let ShaderLoader = require('./shader_loader.js');
let TextureLoader = require('./texture_loader.js');

let CustomShader = stampit()
  .refs({
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
    updateUniforms: function(){
      this.material.uniforms = this.uniforms;
      for (let uniform in this.uniforms){
        let propertyName = "set" + uniform.charAt(0).toUpperCase() + uniform.slice(1);
        this.registerUniform(uniform, propertyName);
        if (this.uniforms[uniform].type == "v2"){ //vector
          propertyName = "set" + uniform.charAt(0).toUpperCase() + uniform.slice(1) + "X";
          this.registerUniform(uniform, propertyName, "x");
          propertyName = "set" + uniform.charAt(0).toUpperCase() + uniform.slice(1) + "Y";
          this.registerUniform(uniform, propertyName, "y");
        }
      }
      this.material.needsUpdate = true;
    },
    registerUniform: function(variable, register, property){
      this[register] = (function(value){
        this[variable] = value;
        if (property){
          this.material.uniforms[variable].value[property] = value;
        } else {
          this.material.uniforms[variable].value = value;
        }
      }.bind(this));
    },
    setupCustomShader: function(){
      this.material = new THREE.ShaderMaterial();
      this.material.uniforms = this.uniforms;

      this.geometry = SpriteGeometry.create({size: this.size});
      this.mesh = new THREE.Mesh(this.geometry.geometry, this.material);

      let shaders = [
        ShaderLoader.load(this.shaders.vertexShader),
        ShaderLoader.load(this.shaders.fragmentShader)
      ];
      TextureLoader.get(this.texture).then(this.updateMaterial.bind(this));
      Promise.all(shaders).then(this.shadersReceived.bind(this));
    }
  })
  .init(function(){

  });

module.exports = CustomShader;
