let stampit = require('stampit');
let THREE = require('three');
let Sprite = require('./sprite.js');
let Debug = require('./debug.js');
let Updatable = require('./updatable.js');
let CustomShader = require('./custom_shader.js');

let AnimatedSprite = stampit.compose(Updatable, CustomShader)
  .methods({
    duration: function(){
      return this.animations[this.animationState][this.frame].duration;
    },
    gridPosition: function(){
      return [Math.round(this.position.x), Math.round(this.position.y)];
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
    shaders: {
      vertexShader: 'animated.vert',
      fragmentShader: 'animated.frag'
    }
  })
  .methods({
    animatedSpriteUpdateCallback: function(dt){
      if (!this.animated || !this.animations[this.animationState]) return;
      this.timeElapsed += dt;
      this.frame = this.frame % this.animations[this.animationState].length; // in case animation state changes

      if (this.timeElapsed > this.duration()) {
        this.frame = (this.frame + 1) % this.animations[this.animationState].length;;
        this.timeElapsed = 0;
      }

      this.material.uniforms['spritePosition']['value'].x = this.animations[this.animationState][this.frame].id;
      this.material.uniforms['spriteFlipped'] = {type: 'i', value: this.direction == "left" };
      this.material.needsUpdate = true;
    }
  })
  .init(function(){
    this.animated = true;
    this.spriteLayout = new THREE.Vector2(0, 0).fromArray(this.spriteLayout);
    this.spritePosition = new THREE.Vector2(0, 0).fromArray(this.spritePosition);
    this.size = new THREE.Vector2(1, 1);
    this.spriteSize = new THREE.Vector2(1, 1);

    this.frame = 0;
    this.timeElapsed = 0;

    this.uniforms = {
      opacity: { type: "f", value: 1 },
      tileLocation: { type: "v2", value: this.position },
      screenSize: {type: "v2", value: this.game.renderer.screenSize},
      size: {type: "v2", value: this.size },
      spriteSize: {type: "v2", value: this.spriteSize },
      spriteLayout: {type: "v2", value: this.spriteLayout },
      spritePosition: {type: "v2", value: this.spritePosition },
      fixedPosition: {type: "i", value: this.fixed}
    };

    this.setupCustomShader();
    this.game.renderer.addToScene(this.mesh);

    this.registerUpdateCallback(this.animatedSpriteUpdateCallback);
  });


module.exports = AnimatedSprite;
