let stampit = require('stampit');
let PhysicsEngine = require('./physics_engine.js');
let Kefir = require('kefir');

let StaticCollidable = stampit()
  .refs({
    physicsEngine: PhysicsEngine
  })
  .init(function(){
    this.physicsEngine.addObject(this);
    this.collisionCallbacks = [];
    this.collisionStream = Kefir.stream(emitter => {
      this.addCollisionCallback(function(entity,direction) {
        emitter.emit({entity: entity, direction: direction})
      });
    });

    this.collisionStream.onValue((collision) => {
      let entity = collision.entity;
      let direction = collision.direction;
      switch(direction){
        case 'below':
          entity.position.y = this.position.y - entity.size.y;
          entity.velocity.y = 0;
          entity.timeSinceJump = entity.jumpLength;
          break;
        case 'above':
          entity.position.y = this.position.y + this.size.y;
          entity.velocity.y = 0;
          entity.onGround = true;
          break;
        case 'left':
          entity.position.x = this.position.x - entity.size.x;
          entity.velocity.x = 0;
          break;
        case 'right':
          entity.position.x = this.position.x + this.size.x;
          entity.velocity.x = 0;
          break;
      }
    })
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

module.exports = StaticCollidable;