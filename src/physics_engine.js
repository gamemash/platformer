let stampit = require('stampit');
let THREE = require('three');



let PhysicsEngine = stampit()
  .refs({
    objects: {},
    height: 16
  })
  .methods({
    boundingBox: function(obj_a, obj_b){
      return (obj_a.position.x < obj_b.position.x + obj_b.size.x &&
         obj_a.position.x + obj_a.size.x > obj_b.position.x &&
         obj_a.position.y < obj_b.position.y + obj_b.size.y &&
         obj_a.size.y + obj_a.position.y > obj_b.position.y);
    },
    key: function(obj){
      return obj.gridPosition()[0] + "x" + obj.gridPosition()[1];
    },
    addObject: function(obj){
      this.objects[this.key(obj)] = obj;
    },
    deleteObject: function(obj){
      delete this.objects[this.key(obj)];
    },
    checkPosition: function(x, y){
      let key = x + "x" + y;
      if (key in this.objects)
        return this.objects[key];
      return false;
    },
    newtonianResponse: function(obj, dt){
      obj.position.addScaledVector(obj.velocity, dt);
      if (obj.acceleration){
        obj.position.addScaledVector(obj.acceleration, dt * dt);
        obj.velocity.addScaledVector(obj.acceleration, dt);
      }
    },
    hitFromAbove: function(entity_a, entity_b){
        //difference in current position and top of goomba
        let dy = (entity_a.position.y - entity_b.position.y - entity_b.size.y);

        //time since it had that y position, assuming no acceleration
        let time = (dy / -entity_a.velocity.y);

        //x position at that time
        let x = entity_a.position.x + entity_a.velocity.x * time;

        //that time point should be in the past. The position should be (player + size < x < entity + size)
        return (time < 0 && entity_b.position.x - entity_a.size.x < x && x < entity_b.position.x + entity_b.size.x);
    }


  });

module.exports = PhysicsEngine.create();
