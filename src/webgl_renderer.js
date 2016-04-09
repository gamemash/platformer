let stampit = require('stampit');
let THREE = require('three');
let Tile = require('./tile.js');

let WebGLRenderer = stampit()
  .methods({
    render: function(){

      this.renderer.render(this.scene, this.camera);
    },
    loadLevel: function(levelData){
      for (let y = levelData.length - 1; y >= 0; y -= 1){
        for (let x = 0; x < levelData[y].length; x += 1){
          if (levelData[y][x] != 0)
            Tile.create({renderer: this, position: new THREE.Vector2(x, levelData.length - 1 - y)});
        }
      }
    }



  })
  .init(function(){
    this.scene = new THREE.Scene();
    this.renderer = new THREE.WebGLRenderer({canvas: this.canvas, alpha: true});
    this.width = this.renderer.domElement.offsetWidth;
    this.height = this.renderer.domElement.offsetHeight;
    this.renderer.setSize(this.width, this.height);
    this.renderer.setClearColor(0x5c94fc, 0);
    this.camera = new THREE.OrthographicCamera(-this.width / 2, this.width / 2, this.height / 2, this.height / 2, 0.1, 100 );
  });


module.exports = WebGLRenderer;
