let stampit = require('stampit');
let THREE = require('three');
let Sprite = require('./sprite.js');
let Debug = require('./debug.js');
let Updatable = require('./updatable.js');

let SpriteGeometry = require('./sprite_geometry.js');
let ShaderLoader = require('./shader_loader.js');
let TextureLoader = require('./texture_loader.js');

let AnimatedSprite = stampit.compose(Updatable)
  .methods({
    duration: function(){
      return this.animations[this.animationState][this.frame].duration;
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
    gridPosition: function(){
      return [Math.round(this.position.x), Math.round(this.position.y)];
    },
    setUniforms: function(){
      this.material.uniforms = {
        tileLocation: { type: "v2", value: this.position },
        screenSize: {type: "v2", value: this.game.renderer.screenSize},
        tileSize: {type: "v2", value: this.size },
        spriteLayout: {type: "v2", value: this.spriteLayout },
        spritePosition: {type: "v2", value: this.spritePosition },
        fixedPosition: {type: "i", value: this.fixed}
      };
    }
  })
  .refs({
    spritePosition: [0, 0],
    direction: 'right',
    spriteLayout: [1, 1],
    frames: [{id:0, duration: 1}],
    animationState: false,
    animations: {},
    fixed: false,
    size: new THREE.Vector2(1,1),
    shaders: [
      ShaderLoader.load('animated.vert'),
      ShaderLoader.load('animated.frag')
    ]
  })
  .init(function(){
    this.animated = true;
    this.spriteLayout = new THREE.Vector2(0, 0).fromArray(this.spriteLayout);
    this.spritePosition = new THREE.Vector2(0, 0).fromArray(this.spritePosition);
    this.size = new THREE.Vector2(1, 1);

    this.frame = 0;
    this.timeElapsed = 0;

    this.material = new THREE.ShaderMaterial();
    this.geometry = SpriteGeometry.create();
    this.mesh = new THREE.Mesh(this.geometry.geometry, this.material);

    TextureLoader.get(this.texture).then(this.updateMaterial.bind(this));
    Promise.all(this.shaders).then(this.shadersReceived.bind(this));
    this.setUniforms();
    this.game.renderer.addToScene(this.mesh);

    this.registerUpdateCallback(function(dt) {
      if (!this.animations[this.animationState]) return;
      this.timeElapsed += dt;
      this.frame = this.frame % this.animations[this.animationState].length; // in case animation state changes

      if (this.timeElapsed > this.duration()) {
        this.frame = (this.frame + 1) % this.animations[this.animationState].length;;
        this.timeElapsed = 0;
      }

      this.material.uniforms['spritePosition']['value'].x = this.animations[this.animationState][this.frame].id;
      this.material.uniforms['spriteFlipped'] = {type: 'i', value: this.direction == "left" };
      this.material.needsUpdate = true;
    });
  });


module.exports = AnimatedSprite;
