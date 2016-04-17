let debug = require('./debug.js');
let stampit = require('stampit');

function _getMousePos(canvas, evt) {
  var rect = canvas.getBoundingClientRect();
  return {
    x: evt.clientX - rect.left,
    y: -(evt.clientY - rect.top) + rect.height
  };
}

function _addEventListener(canvas, event, callback){
  canvas.addEventListener(event, (evt) => {
    var mousePos = _getMousePos(canvas, evt);
    callback(mousePos.x, mousePos.y)
  }, true);
}

let MouseState = stampit()
  .refs({

  })
  .init(function(){
    this.canvas = document.getElementById(this.canvasId);
  })
  .methods({
    addMoveListener: function(callback) {
      _addEventListener(this.canvas, "mousemove", callback);
    },
    addClickListener: function(callback) {
      _addEventListener(this.canvas, "mousedown", callback);
    }
  });


module.exports = MouseState;
