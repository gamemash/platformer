"use strict";

let stampit = require('stampit');
let THREE = require('three');

let Shader = stampit()
  .methods({
    update: function(){
      console.log("Updating the following uniforms");
      for (let uniform in this.uniforms){
        this.material.uniforms[uniform].value = this.uniforms[uniform];
      }
    }
  })
  .init(function(){
    this.material.uniforms = this.uniforms;
  });

let Sprite = stampit()
  .refs({
  })
  .init(function(){
    this.position = new THREE.Vector2(0, 1)
    this.material = new THREE.ShaderMaterial();
    this.shader = Shader.create({
      uniforms: {
        position: { type: "v2" , value: this.position }
      },
      material: this.material
    });
  });


let a = Sprite.create();
a.position.set(1,1);
a.shader.update();

let b = Sprite.create();
console.log(b.position);
