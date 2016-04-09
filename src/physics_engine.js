let stampit = require('stampit');
let THREE = require('three');



let PhysicsEngine = stampit()
  .refs({
    objects: {},
    height: 16
  })
  .methods({
    key: function(obj){
      return obj.gridPosition()[0] + "x" + obj.gridPosition()[1];
    },
    addObject: function(obj){
      this.objects[this.key(obj)] = obj;
    },
    checkCollision: function(position){
      console.log(position);
      return checkPosition(position[0] - 1, position[1]);
    },
    checkPosition: function(position){
      let key = position[0] + "x" + position[1];
      if (key in this.objects)
        return this.objects[key];
      //objects[position.x * this.height + position.y]
    }


  });

module.exports = PhysicsEngine.create();
