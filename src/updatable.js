let stampit = require('stampit');

let Updatable = stampit
  .init(function(){
    this.updateCallbacks = [];
    this.renderer.toUpdate.add(this);
  })
  .methods({
    registerUpdateCallback: function(callback){
      this.updateCallbacks.push(callback);
    },
    delete: function(){
      this.renderer.toUpdate.delete(this);
      this.renderer.deleteFromScene(this.mesh);
    },
    updateSprite: function(dt) {
      for(let callback of this.updateCallbacks) {
        callback.bind(this)(dt);
      }
    }
  });


module.exports = Updatable;
