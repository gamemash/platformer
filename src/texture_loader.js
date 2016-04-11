var THREE = require('three');

let loader = new THREE.TextureLoader();

let TextureLoader = {
  textures: {},

  load: function(name, resolve){
    loader.load('images/' + name, (function(texture){
      resolve(texture);
    }.bind(this)));
  },
  get: function(name){
    if (!(name in this.textures)) {
      this.textures[name] = new Promise(this.load.bind(this, name));
    }
    return this.textures[name];
  }

}
module.exports = TextureLoader;
