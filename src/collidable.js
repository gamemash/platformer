let stampit = require('stampit');
let Kefir = require('kefir');

let Collidable = stampit()
  .refs({
  })
  .init(function(){
    this.collisionCallbacks = [];
    this.collisionStream = Kefir.stream(emitter => {
      this.addCollisionCallback(function(entity,direction) {
        emitter.emit({entity: entity, direction: direction})
      });
    });
  })
  .methods({
    collided: function(entity, direction) {
      for(let callback of this.collisionCallbacks) {
        callback.bind(this)(entity, direction);
      }
    },
    addCollisionCallback: function(callback) {
      this.collisionCallbacks.push(callback)
    }
  });

module.exports = Collidable;