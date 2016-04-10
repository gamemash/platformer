let debug = require('./debug.js');
let stampit = require('stampit');

function _getMousePos(canvas, evt) {
  var rect = canvas.getBoundingClientRect();
  return {
    x: evt.clientX - rect.left,
    y: -(evt.clientY - rect.top) + rect.height
  };
}

function _addEventListener(canvas, callback){
  canvas.addEventListener('mousemove', (evt) => {
    var mousePos = _getMousePos(canvas, evt);
    callback(mousePos.x, mousePos.y)
  }, false);
}

let MouseState = stampit()
  .refs({

  })
  .init(function(){
    console.log(this);
    this.canvas = document.getElementById(this.canvasId);
    _addEventListener(this.canvas, (x, y) => {
      debug(1, x);
      debug(2, y);
    });
  })
  .methods({
    addListener: function(callback) {
      console.log(this);
      _addEventListener(this.canvas, callback);
    }
  });


module.exports = MouseState;
