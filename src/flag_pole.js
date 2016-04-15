let stampit = require('stampit');
let THREE = require('three');
let SpriteGeometry = require('./sprite_geometry.js');
let ShaderLoader = require('./shader_loader.js');
let TextureLoader = require('./texture_loader.js');
let Sprite = require('./sprite.js');

var Flag = stampit
  .compose(Sprite)
  .refs({
    texture: 'flag.png'
  });

var Top = stampit
  .compose(Sprite)
  .refs({
    texture: 'flagpole.png',
  });

var Rod = stampit
  .compose(Sprite)
  .refs({
    texture: 'flagpole_rod.png',
  });

var FlagPole = stampit
  .compose()
  .refs({
    height: 10,
  })
  .init(function() {
    let x_pos = this.position.x;
    let y_pos = this.position.y;

    this.top = Top.create({renderer: this.renderer, position: new THREE.Vector2(x_pos, y_pos + this.height)})

    for (var i = 0; i < this.height; i++) {
      console.log(i)
      Rod.create({renderer: this.renderer, position: new THREE.Vector2(x_pos, y_pos + i)})
    };

    this.flag = Flag.create({renderer: this.renderer, position: new THREE.Vector2(x_pos-0.5, y_pos + this.height - 0.8)})
  });

module.exports = FlagPole;
