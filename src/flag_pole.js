let stampit = require('stampit');
let THREE = require('three');
let SpriteGeometry = require('./sprite_geometry.js');
let ShaderLoader = require('./shader_loader.js');
let TextureLoader = require('./texture_loader.js');
let Sprite = require('./sprite.js');
let Entity = require('./entity.js');
let Collidable = require('./collidable.js');
let Updateable = require('./updatable.js');

var Flag = stampit
  .compose(Sprite)
  .refs({
    texture: 'flag.png'
  });

var Top = stampit
  .compose(Entity, Sprite)
  .refs({
    texture: 'flagpole.png',
  });

var Rod = stampit
  .compose(Entity, Sprite)
  .init(function(){
  })
  .refs({
    name: 'Flagpole',
    texture: 'flagpole_rod.png'
  })

var FlagPole = stampit
  .compose()
  .refs({
    height: 10,
  })
  .init(function() {
    let x_pos = this.position.x;
    let y_pos = this.position.y;

    this.top = Top.create({game: this.game, position: new THREE.Vector2(x_pos, y_pos + this.height)})
    this.flag = Flag.create({game: this.game, position: new THREE.Vector2(x_pos-0.5, y_pos + this.height - 0.8)})

    Rod.create({game: this.game, flag: this.flag, size: new THREE.Vector2(1, this.height), position: new THREE.Vector2(x_pos, y_pos)})
    //for (let i = 0; i < this.height; i++) {
    //  Rod.create({game: this.game, position: new THREE.Vector2(x_pos, y_pos + i)})
    //};

  });

module.exports = FlagPole;
