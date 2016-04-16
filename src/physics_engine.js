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
    checkPosition: function(x, y){
      let key = x + "x" + y;
      if (key in this.objects)
        return this.objects[key];
      return false;
    }


  });

module.exports = PhysicsEngine.create();
