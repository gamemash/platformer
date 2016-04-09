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
      let blockLeft = this.checkPosition(position[0] - 1, position[1]);
      let blockRight = this.checkPosition(position[0] + 1, position[1]);
      document.getElementById("blockLeft").innerHTML = blockLeft;
      document.getElementById("blockRight").innerHTML = blockRight;

      return {
        blockLeft: blockLeft,
        blockRight: blockRight
        // blockUp: blockUp,
        // blockDown: blockDown
      }
    },

    checkPosition: function(x, y){
      let key = x + "x" + y;
      return (key in this.objects)
    }


  });

module.exports = PhysicsEngine.create();
